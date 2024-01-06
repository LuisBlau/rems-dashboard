/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from '../../pages/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import DownloadAzureFileButton from '../Buttons/DownloadAzureFileButton';
import RequestLinkButton from '../Buttons/RequestLinkButton';
const PREFIX = 'ExtractGrid';

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

export default function ExtractGrid({ store, height }) {
    const [storeExtracts, setStoreExtracts] = useState([]);
    const context = useContext(UserContext)
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(100);

    useEffect(() => {
        if (context) {
            functionApiCall(page, pageSize)
        }
    }, [store, context]);

    const functionApiCall = (page, pageSize) => {
        if (store) {
            if (store.tenantId !== null) {
                axios.get(`/api/registers/extractsForStore?storeName=${store.store}&retailerId=${store.retailer}&tenantId=${store.tenantId}&page=${page}&limit=${pageSize}`).then(function (res) {
                    const extracts = res?.data?.items?.map((v, index) => {
                        return { ...v, id: index }
                    });
                    setTotalItems(res.data.pagination.totalItem);
                    setLoading(false)
                    setStoreExtracts(extracts);
                });
            } else {
                axios.get(`/api/registers/extractsForStore?storeName=${store.store}&retailerId=${store.retailer}&page=${page}&limit=${pageSize}`).then(function (res) {
                    const extracts = res?.data?.items?.map((v, index) => {
                        return { ...v, id: index }
                    });
                    setTotalItems(res.data.pagination.totalItem);
                    setLoading(false)
                    setStoreExtracts(extracts);
                });
            }
        } else {
            if (context.selectedRetailer) {
                if (context.selectedRetailerIsTenant === false) {
                    axios.get(`/api/registers/extracts?retailerId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`).then(function (res) {
                        const extracts = res?.data?.items?.map((v, index) => {
                            return { ...v, id: index }
                        });
                        setTotalItems(res.data.pagination.totalItem);
                        setLoading(false)
                        setStoreExtracts(extracts);
                    });
                } else if (context.selectedRetailerParentRemsServerId) {
                    axios.get(`/api/registers/extracts?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`).then(function (res) {
                        const extracts = res?.data?.items?.map((v, index) => {
                            return { ...v, id: index }
                        });
                        setTotalItems(res.data.pagination.totalItem);
                        setLoading(false)
                        setStoreExtracts(extracts);
                    });
                }
            }
        }
    }

    const columns = [
        {
            field: 'Timestamp',
            headerName: 'Timestamp',
            sortable: true,
            filter: true,
            flex: 1,
        },
        { field: 'Store', headerName: 'Store', sortable: true, filter: true, flex: 1 },
        { field: 'RegNum', headerName: 'RegNum', sortable: true, filter: true, flex: 1 },
        { field: 'ExtractType', headerName: 'ExtractType', sortable: true, filter: true, flex: 1 },
        { field: 'State', headerName: 'State', sortable: true, filter: true, flex: 1 },
        {
            field: 'SBreqLink',
            headerName: 'Azure',
            headerAlign: 'center',
            sortable: true,
            filter: true,
            flex: 1,
            renderCell: (params) => {
                return (
                    <RequestLinkButton link={params.value} />
                )
            }
        },
        {
            field: 'Download',
            headerName: 'Download',
            headerAlign: 'center',
            sortable: true,
            filter: true,
            flex: 1,
            renderCell: (params) => {
                return (
                    <DownloadAzureFileButton link={params.value} />
                )
            }
        },
    ];

    return (
        <Box sx={{ height: height, width: '100%' }}>
            <DataGrid
                loading={loading}
                columns={columns}
                rows={storeExtracts}
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
                disableSelectionOnClick
            />
        </Box>
    );
}
