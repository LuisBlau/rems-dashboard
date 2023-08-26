/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import UserContext from '../../pages/UserContext';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress } from '@mui/material';


const PREFIX = 'VersionGrid';

const approvedVersions = [
    { "rems": "1.5.1", "rma": "4.3.1", "cf": "2.1.2" },
    { "rems": "1.4.1", "rma": "4.2.0", "cf": "2.1.0" },
    { "rems": "1.3", "rma": "4.1.1", "cf": "2.0.5" }
]
const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,

};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

const getBackgroundColor = (color) =>
    color === 'green' ? '#5BA52E' : '#E7431F';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--Approved': {
        backgroundColor: getBackgroundColor('green'),
        '&:hover': {
            background: "#097a18"
        }
    },
    '& .super-app-theme--NotApproved': {
        backgroundColor: getBackgroundColor('red'),
        '&:hover': {
            background: "#ff5252"
        }
    },
}));

export default function VersionGrid({ height }) {
    const [versions, setVersions] = useState([]);
    const [showAllRetailers, setShowAllRetailers] = useState(false);
    const context = useContext(UserContext)
    const [loading, setLoading] = useState(false);

    const changeShownRetailers = (event) => {
        setShowAllRetailers(event.target.checked)
        setVersions([])
    }

    const versionColumns = [
        { field: 'rems', headerName: 'REMS', sortable: true, flex: 1 },
        { field: 'rma', headerName: 'RMA', sortable: true, flex: 1 },
        { field: 'cf', headerName: 'CF', sortable: true, flex: 1 },
        { field: 'count', headerName: 'Count', sortable: true, flex: 1 },
        { field: 'retailer', headerName: 'Retailer', sortable: true, flex: 1 }
    ];


    useEffect(() => {
        if (context.selectedRetailer || showAllRetailers) {
            setLoading(true);
            if (context.selectedRetailerIsTenant !== null) {
                let retailerParam = ''
                if (context.selectedRetailerIsTenant === false) {
                    retailerParam = showAllRetailers ? 'allRetailers=true' : `allRetailers=false&retailerId=${context.selectedRetailer}`
                } else {
                    retailerParam = showAllRetailers ? `allRetailers=true` : `allRetailers=false&retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`;
                }
                axios.get(`/api/REMS/versionCombinations?${retailerParam}`)
                    .then((res) => {
                        setVersions(res.data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error(err);
                        setLoading(false);
                    });
            }
        }
    }, [showAllRetailers, context]);

    const getRowId = (row) => {
        //combination of fields to create a unique id for each row
        return `${row.rems}-${row.rma}-${row.cf}`;
    };

    function CustomNoRowsOverlay() {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <h3 variant="h6">No agents available</h3>
            </Box>
        );
    }

    return (
        <div style={{ height: height, width: '100%' }}>
            <FormControlLabel
                control={<Checkbox onChange={changeShownRetailers} />}
                label="Show All Retailers"
                style={{ height: 30 }}
            />

            <Box sx={{ display: 'flex', marginTop: 1, height: 600, width: '100%', justifyContent: 'center' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <StyledDataGrid

                        rows={versions.map((version) => ({
                            id: getRowId(version),
                            rems: version.rems,
                            rma: version.rma,
                            cf: version.cf,
                            count: version.count,
                            retailer: version.retailer,
                        }))}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        columns={versionColumns}
                        pageSizeOptions={[5, 10, 15]}
                        // isRowSelectable={false}
                        onRowClick={(params, event) => {
                            event.defaultMuiPrevented = true;
                        }}
                        getRowId={(row) => row.id}
                        className={`${PREFIX}-container`}
                        getRowClassName={(row) => {
                            const isApproved = approvedVersions.some(
                                approvedVersion => {
                                    let approvedRemsMajor = approvedVersion.rems.split('.').join('')
                                    let approvedRmaMajor = approvedVersion.rma.split('.').join('')
                                    let approvedCfMajor = approvedVersion.cf.split('.').join('')

                                    let rowRemsMajor = row.row.rems ? row.row.rems.split('.').join('') : ""
                                    let rowRmaMajor = row.row.rma ? row.row.rma.split('.').join('') : ""
                                    let rowCfMajor = row.row.cf ? row.row.cf.split('.').join('') : ""

                                    return (rowRemsMajor === approvedRemsMajor) &&
                                        (rowRmaMajor === approvedRmaMajor || rowRmaMajor.includes(approvedRmaMajor)) &&
                                        (rowCfMajor === approvedCfMajor);
                                }
                            );
                            return isApproved ? 'super-app-theme--Approved' : 'super-app-theme--NotApproved';
                        }}
                        components={{
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                    />
                )}
            </Box>
        </div>
    )
};
