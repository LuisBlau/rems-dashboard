/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import UserContext from '../../pages/UserContext';
import { Box } from '@mui/material';



export default function DumpGrid({ store, height }) {
    const [storeDumps, setStoreDumps] = useState([]);
    const [loading, setLoading] = useState(true)
    const context = useContext(UserContext)
    useEffect(() => {
        if (context) {
            if (store) {
                if (store.tenantId !== null) {

                    axios.get(`/api/registers/dumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}&tenantId=${store.tenantId}`).then(function (res) {
                        const dumps = res.data.map((v, index) => {
                            return { ...v, id: index }

                        });
                        setLoading(false)
                        setStoreDumps(dumps);
                    });
                } else {
                    axios.get(`/api/registers/dumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}`).then(function (res) {
                        const dumps = res.data.map((v, index) => {
                            return { ...v, id: index }
                        });
                        setLoading(false)
                        setStoreDumps(dumps);
                    });
                }
            } else {
                if (context.selectedRetailer) {
                    // need to check for tenant
                    if (context.selectedRetailerIsTenant === false) {

                        axios.get('/api/registers/dumps?retailerId=' + context.selectedRetailer).then(function (res) {
                            const dumps = res.data.map((v, index) => {
                                return { ...v, id: index }

                            });
                            setLoading(false)
                            setStoreDumps(dumps);
                        });
                    } else if (context.selectedRetailerParentRemsServerId) {
                        axios.get('/api/registers/dumps?retailerId=' + context.selectedRetailerParentRemsServerId + '&tenantId=' + context.selectedRetailer).then(function (res) {
                            const dumps = res.data.map((v, index) => {
                                return { ...v, id: index }
                            });
                            setLoading(false)
                            setStoreDumps(dumps);
                        });
                    }
                }
            }
        }
    }, [store, context]);

    if (loading) {
        return <div>loading...</div>;
    } else {

        const columns = [
            {
                field: 'Timestamp',
                headerName: 'Dump Timestamp',
                flex: 3,
                type: 'date',
                sortable: true,
                valueGetter: (params) => params.value ? new Date(params.value) : null,
                filterable: true
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
                renderCell: (params) => (<a href={'javascript:fetch("' + params.value + '")'}>Request File</a>)
            },
            {
                field: "Download",
                flex: 2,
                sortable: true,
                renderCell: (params) => (params.value ? <a href={params.value}>Download</a> : '')
            }
        ];

        return (
            <Box sx={{ height: '80vh', width: '100%' }}>

                <DataGrid
                    rows={storeDumps}
                    columns={columns}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'Timestamp', sort: 'desc' }]
                        },
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    autoHeight
                />
            </Box>
        );
    }
}
