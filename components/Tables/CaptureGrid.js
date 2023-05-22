/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../pages/UserContext';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
const PREFIX = 'CaptureGrid';

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

export default function CaptureGrid() {
    const context = useContext(UserContext)
    const [captures, setCaptures] = useState([])

    useEffect(() => {
        if (context.selectedRetailer !== '') {
            if (context.selectedRetailerIsTenant === false) {
                axios.get(`/api/registers/captures?retailerId=${context.selectedRetailer}`).then(function (response) {
                    const captures = []
                    response.data.forEach(element => {
                        captures.push({
                            ...element,
                            id: element._id
                        })
                    });
                    setCaptures(captures)
                })
            } else {
                axios.get(`/api/registers/captures?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`).then(function (response) {
                    const captures = []
                    response.data.forEach(element => {
                        captures.push({
                            ...element,
                            id: element._id
                        })
                    });
                    setCaptures(captures)
                })
            }
        }
    }, [context])

    const columns = [
        {
            field: 'Store',
            headerName: 'Store',
            flex: 1,
            sortable: true,
            filterable: true
        },
        {
            field: 'CaptureType',
            headerName: 'Capture Type',
            flex: 1,
            filterable: true
        },
        {
            field: 'Agent',
            headerName: 'Agent',
            flex: 1,
            sortable: true,
            filterable: true
        },
        {
            field: 'CaptureSource',
            headerName: 'Capture Source',
            flex: 1,
            filterable: true
        },
        {
            field: 'Timestamp',
            headerName: 'Timestamp',
            flex: 1,
            type: 'dateTime',
            sortable: true,
            valueGetter: (params) => new Date(params.value),
        },
        {
            field: 'SBreqLink',
            headerName: 'Request from Store',
            flex: 1,
            renderCell: (params) => (
                <a href={'javascript:fetch("' + params.value + '")'}>Request File</a>
            ),
        },
        {
            field: 'Download',
            headerName: 'Pushed to Cloud',
            flex: 1,
            renderCell: (params) => {
                if (params.value !== undefined) {
                    return (
                        <a href={params.value}> Download</a >
                    )
                }
            },
        }
    ];

    return (
        <Box sx={{ height: '80vh', width: '100%' }}>
            <DataGrid
                rows={captures}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection={false}
                disableSelectionOnClick
            />
        </Box>
    );
}