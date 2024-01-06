/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import UserContext from '../../pages/UserContext';
import { Box } from '@mui/material';
import RequestLinkButton from '../Buttons/RequestLinkButton';
import DownloadAzureFileButton from '../Buttons/DownloadAzureFileButton';

export default function DumpGrid({ store, height }) {
    const [storeDumps, setStoreDumps] = useState([]);
    const [loading, setLoading] = useState(true)
    const context = useContext(UserContext)
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

                axios.get(`/api/dumps/getDumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}&tenantId=${store.tenantId}&page=${page}&limit=${pageSize}`).then(function (res) {
                    const dumps = res?.data?.items?.map((v, index) => {
                        return { ...v, id: index }

                    });
                    setTotalItems(res.data.pagination.totalItem);
                    setLoading(false)
                    setStoreDumps(dumps);
                });
            } else {
                axios.get(`/api/dumps/getDumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}&page=${page}&limit=${pageSize}`).then(function (res) {
                    const dumps = res?.data?.items?.map((v, index) => {
                        return { ...v, id: index }
                    });
                    setTotalItems(res.data.pagination.totalItem);
                    setLoading(false)
                    setStoreDumps(dumps);
                });
            }
        } else {
            if (context.selectedRetailer) {
                // need to check for tenant
                if (context.selectedRetailerIsTenant === false) {

                    axios.get(`/api/dumps/getDumps?retailerId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`).then(function (res) {
                        const dumps = res?.data?.items?.map((v, index) => {
                            return { ...v, id: index }

                        });
                    setTotalItems(res.data.pagination.totalItem);
                        setLoading(false)
                        setStoreDumps(dumps);
                    });
                } else if (context.selectedRetailerParentRemsServerId) {
                    axios.get(`/api/dumps/getDumps?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`).then(function (res) {
                        const dumps = res?.data?.items?.map((v, index) => {
                            return { ...v, id: index }
                        });
                    setTotalItems(res.data.pagination.totalItem);
                        setLoading(false)
                        setStoreDumps(dumps);
                    });
                }
            }
        }
    }
    if (loading) {
        return <div>loading...</div>;
    } else {
        const columns = [
            {
                field: 'Timestamp',
                headerName: 'Dump Timestamp',
                flex: 3,
                type: 'datetime',
                sortable: true,
                valueGetter: (params) => params.value ? new Date(params.value) : null,
                renderCell: (params) => params.value ? new Date(params.value).toLocaleString() : null
            },
            {
                field: "Store",
                flex: 2,
                sortable: true
            },
            {
                field: "System",
                flex: 2
            },
            {
                field: "Reason",
                flex: 8,
                sortable: true
            },
            {
                field: "SBreqLink",
                headerName: "Azure",
                flex: 2,
                headerAlign: 'center',
                renderCell: (params) => {
                    return (
                        <RequestLinkButton link={params.value} />
                    )
                }
            },
            {
                field: "Download",
                headerName: "Download",
                headerAlign: 'center',
                flex: 2,
                sortable: true,
                renderCell: (params) => {
                    return (
                        <DownloadAzureFileButton link={params.value} />
                    )
                }
            }
        ];

        return (
            <Box sx={{ height: height, width: '100%' }}>

                <DataGrid
                    loading={loading}
                    rows={storeDumps}
                    columns={columns}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'Timestamp', sort: 'desc' }]
                        },
                        pagination: { paginationModel: { pageSize: pageSize } },
                    }}
                    rowCount={totalItems}
                    onPaginationModelChange={({ page, pageSize }) => { setPage(page); setPageSize(pageSize); functionApiCall(page, pageSize) }}
                    pageSizeOptions={[100, 500, 1000]}
                    paginationMode="server"
                   // sx={{ height: height }}
                />
            </Box>

        );
    }
}
