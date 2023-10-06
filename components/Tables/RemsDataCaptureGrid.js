/* eslint-disable react/prop-types */
import Button from '@mui/material/Button';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import UserContext from '../../pages/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const successHideDuration = 1500;
const failHideDuration = 8000;

const sortGrid = function (event) {
    const columnState = {
        state: [
            {
                colId: 'Timestamp',
                sort: 'desc',
            },
        ],
    };
    event.columnApi.applyColumnState(columnState);
};

export default function RemsDataCaptureGrid(props) {
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastFailure, setToastFailure] = useState('');
    const [servers, setServers] = useState([])
    const context = useContext(UserContext)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        if (context.selectedRetailer) {
            if (context.selectedRetailerIsTenant === false) {
                axios.get(`/api/REMS/versionsData?retailer_id=${context.selectedRetailer}`).then(function (res) {
                    res.data.rem.forEach(server => {
                        server.id = server._id
                    });
                    setServers(res.data.rem)
                    setLoading(false)
                })
            } else if (context.selectedRetailerParentRemsServerId) {
                axios.get(`/api/REMS/versionsData?retailer_id=${context.selectedRetailerParentRemsServerId}&tenant=${context.selectedRetailer}`).then(function (res) {
                    res.data.rem.forEach(server => {
                        server.id = server._id
                    });
                    setServers(res.data.rem)
                    setLoading(false)
                })
            }
        }
    }, [context])

    const processSuccessfulResponse = function (res, type) {
        if (res.status !== 200) {
            setToastFailure(`Logs capture failed with a status code ${res.status}`);
            setOpenFailure(true);
        } else {
            setToastSuccess(`Successfully requested ${type} capture`);
            setOpenSuccess(true);
        }
    };

    const processFailedResponse = function (res, type) {
        setToastFailure(`Failed ${type} capture with message: ${res.message}`);
        setOpenFailure(true);
    };

    const remsDataCaptureButtonRenderer = function (params) {
        if (params.row && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        if (context.selectedRetailerIsTenant === true) {
                            axios.post(`/api/registers/requestRemsDump?remsId=${params.row.remsId}`, { retailer: context.selectedRetailerParentRemsServerId, dataCapture: 'REMS' })
                                .then((res) => {
                                    processSuccessfulResponse(res, 'REMS Data');
                                })
                                .catch((res) => {
                                    processFailedResponse(res, 'REMS Data');
                                });
                        } else {
                            axios.post(`/api/registers/requestRemsDump?remsId=${params.row.remsId}`, { retailer: context.selectedRetailer, dataCapture: 'REMS' })
                                .then((res) => {
                                    processSuccessfulResponse(res, 'REMS Data');
                                })
                                .catch((res) => {
                                    processFailedResponse(res, 'REMS Data');
                                });
                        }
                    }}
                >
                    Request
                </Button>
            );
        } else {
            return null;
        }
    };

    return (
        <Box sx={{ height: '50vh', width: '100%' }}>
            <DataGrid
                loading={loading}
                rows={servers}
                columns={[
                    { field: 'remsId', headerName: 'REMS Id', sortable: true, filterable: true, width: 400, valueGetter: (params) => params.row.remsId !== undefined ? params.row.remsId : 'Not Reported' },
                    {
                        field: 'remsDataCaptureButtonRenderer',
                        headerName: 'REMS Data Capture',
                        renderCell: remsDataCaptureButtonRenderer,
                        width: 150,
                    },
                ]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection={false}
                disableSelectionOnClick
                onGridReady={sortGrid}
            />


            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSuccess}
                autoHideDuration={successHideDuration}
                onClose={(event) => {
                    setOpenSuccess(false);
                }}
            >
                <Alert variant="filled" severity="success">
                    <AlertTitle>Success!</AlertTitle>
                    {toastSuccess}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openFailure}
                autoHideDuration={failHideDuration}
                onClose={(event) => {
                    setOpenFailure(false);
                }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle>Error!!!</AlertTitle>
                    {toastFailure}
                </Alert>
            </Snackbar>
        </Box>
    );
}
