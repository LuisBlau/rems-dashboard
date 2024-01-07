/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import UserContext from '../../pages/UserContext';
import { Box } from '@mui/material';
import RequestLinkButton from '../Buttons/RequestLinkButton';
import DownloadAzureFileButton from '../Buttons/DownloadAzureFileButton';
import { useDebounce } from '../../src/hooks/useDebounce';

export default function DumpGrid({ store, height }) {
    const [storeDumps, setStoreDumps] = useState([]);
    const [loading, setLoading] = useState(true)
    const context = useContext(UserContext)
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(100);
     const [filter, setFilter] = React.useState(null);
    const filterQuery = useDebounce(filter, 1500)
    const onFilterChange = React.useCallback((filterModel) => {
        const filter = filterModel.items?.[0];
        if (filter) {
            const f = { [filter.field]: filter.value };
            setFilter(f);
        }
    }, []);

    useEffect(() => {
        if (filterQuery) {
            functionApiCall(page, pageSize, filterQuery)
        }
    }, [filterQuery])

    useEffect(() => {
        if (context) {
            functionApiCall(page, pageSize,filter)
        }
    }, [store, context]);

    const functionApiCall = (page, pageSize,filter={}) => {
        if (store) {
            if (store.tenantId !== null) {
                axios.get(`/api/dumps/getDumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}&tenantId=${store.tenantId}&page=${page}&limit=${pageSize}`,{ params: filter }).then(function (res) {
                    const dumps = res?.data?.items?.map((v, index) => {
                        return { ...v, id: index }

                    });
                    setTotalItems(res.data.pagination.totalItem);
                    setLoading(false)
                    setStoreDumps(dumps);
                });
            } else {
                axios.get(`/api/dumps/getDumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}&page=${page}&limit=${pageSize}`,{ params: filter }).then(function (res) {
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

                    axios.get(`/api/dumps/getDumps?retailerId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`,{ params: filter }).then(function (res) {
                        const dumps = res?.data?.items?.map((v, index) => {
                            return { ...v, id: index }
                        });
                        setTotalItems(res.data.pagination.totalItem);
                        setLoading(false)
                        setStoreDumps(dumps);
                    });
                } else if (context.selectedRetailerParentRemsServerId) {
                    axios.get(`/api/dumps/getDumps?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`,{ params: filter }).then(function (res) {
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
                filterable : false,
                valueGetter: (params) => params.value ? new Date(params.value) : null,
                renderCell: (params) => params.value ? new Date(params.value).toLocaleString() : null
            },
            {
                field: "Store",
                flex: 2,
                sortable: true,
                filterable : true
            },
            {
                field: "System",
                flex: 2, 
                filterable : false

            },
            {
                field: "Reason",
                flex: 8,
                sortable: true,
                filterable : false
            },
            {
                field: "SBreqLink",
                headerName: "Azure",
                filterable : false,
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
                filterable : false,
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
                    onPaginationModelChange={({ page, pageSize }) => { setPage(page); setPageSize(pageSize); functionApiCall(page, pageSize,filter) }}
                    pageSizeOptions={[25, 50, 100]}
                    paginationMode="server"
                     filterMode="server"
                onFilterModelChange={onFilterChange}
                // sx={{ height: height }}
                />
            </Box>

        );
    }
}
