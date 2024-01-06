
/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../pages/UserContext';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import RequestLinkButton from '../Buttons/RequestLinkButton';
import DownloadAzureFileButton from '../Buttons/DownloadAzureFileButton';
import _ from 'lodash';
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
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(100);

    useEffect(() => {

        if (context.selectedRetailerIsTenant !== null) {
            functionApiCall(page, pageSize);
        }
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId, context.selectedRetailerIsTenant])

    const functionApiCall = (page, pageSize) => {
        if (context.selectedRetailerIsTenant === false) {
            axios.get(`/api/registers/captures?retailerId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`).then(function (response) {
                setTotalItems(response.data.pagination.totalItem);
                const captures = []
                response.data.items.forEach(element => {
                    captures.push({
                        ...element,
                        id: element._id
                    })
                });
                setLoading(false)
                setCaptures(captures)
            })
        } else {
            if (context.selectedRetailerParentRemsServerId)
                axios.get(`/api/registers/captures?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}&page=${page}&limit=${pageSize}&isAdmin=${_.includes(context.userRoles, 'toshibaAdmin')}`).then(function (response) {
                    const captures = []
                    setTotalItems(response.data.pagination.totalItem);


                    response.data.items.forEach(element => {
                        captures.push({
                            ...element,
                            id: element._id
                        })
                    });
                    setLoading(false)
                    setCaptures(captures)
                })
        }
    }
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
            valueGetter: (params) => {
                var dateString = _.replace(params.value, /-/g, '/') // firefox doesn't like '-' in date strings
                return new Date(dateString)
            }
        },
        {
            field: 'SBreqLink',
            headerName: 'Request from Store',
            headerAlign: 'center',
            flex: 1,
            renderCell: (params) => {
                return (
                    <RequestLinkButton link={params.value} />
                )
            },
        },
        {
            field: 'Download',
            headerName: 'Pushed to Cloud',
            headerAlign: 'center',
            flex: 1,
            renderCell: (params) => {
                return (
                    params.value !== undefined && <DownloadAzureFileButton link={params.value} />
                )
            }
        }
    ];

    return (
        <Box sx={{ height: '70vh', width: '100%' }}>
            <DataGrid
                loading={loading}
                rows={captures}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'Timestamp', sort: 'desc' }]
                    },
                    pagination: { paginationModel: { pageSize: pageSize } },
                }}
                rowCount={totalItems}
                onPaginationModelChange={({ page, pageSize }) => { setPage(page); setPageSize(pageSize); functionApiCall(page, pageSize) }}
                pageSizeOptions={[25, 50, 100]}
                paginationMode="server"
                checkboxSelection={false}
                disableSelectionOnClick
            />
        </Box>
    );
}
