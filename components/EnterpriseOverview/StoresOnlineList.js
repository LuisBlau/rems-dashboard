import React, { useEffect, useState } from 'react';
import { Box, Card, LinearProgress, Link, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';

export default function StoresOnlineList({ places, poorStoreStatusPercentage, goodStoreStatusPercentage, selectedRetailer }) {
    const [columns, setColumns] = useState([])

    //this is the little comment to link the store in the store overview
    const renderLinkStoreView = (value) => {
        return <Link style={{ color: '#004EE7' }} href={'/storeOverview?storeName=' + value.row.storeName + '&retailer_id=' + selectedRetailer}>{value.row.storeName}</Link>
    }

    useEffect(() => {
        setColumns([
            {
                field: 'storeName',
                headerName: 'Store',
                width: 300,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
                renderCell: renderLinkStoreView
            },
            {
                field: 'last_updated',
                headerName: 'Last Update',
                width: 300,
                sortable: true,
                type: 'datetime',
                sortingOrder: ['asc', 'desc'],
                valueGetter: (params) => params.value,
                renderCell: (params) => params.row.last_updated ? moment(params.row.last_updated).fromNow() : 'N/A'
            },
            {
                field: 'statusId',
                headerName: 'Status',
                width: 400,
                sortingOrder: ['asc', 'desc'],
                sortable: true,
                renderCell: (params) => {
                    return <Box sx={{ display: 'flex', width: '80%', height: '100%', padding: 2 }}>
                        <Typography variant='body2' sx={{ color: params.row.status.color, marginRight: 4, width: '20%' }}>{params.row.status.label}</Typography>
                        <Typography variant='body2' sx={{ marginRight: 4, width: '20%' }}>{params.row?.online ? 'Online' : 'Offline'}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                            <LinearProgress sx={{
                                borderRadius: 2, height: 10,
                                backgroundColor: '#ddd'
                            }} color={params.row.status.variant}
                                variant="determinate" value={params.row?.signal} />
                            <Typography variant='body2'>{`${params.row?.onlineAgents !== undefined ? params.row?.onlineAgents : 0}/${params.row?.totalAgents !== undefined ? params.row?.totalAgents : 0}`}</Typography>
                        </Box>
                    </Box>
                },
            }
        ])
    }, [poorStoreStatusPercentage, goodStoreStatusPercentage])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
                </Box>
            </GridToolbarContainer>
        );
    }

    return (
        <Card elevation={10} sx={{ margin: 1, display: 'flex', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', width: '80%', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <DataGrid
                    slots={{ toolbar: CustomToolbar }}
                    rowHeight={60}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'last_updated', sort: 'desc' }]
                        },
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    rows={places.length > 0 ? places?.map((item, key) => {
                        const signal = item?.onlineAgents / item?.totalAgents * 100;
                        let status = {
                            id: 2,
                            label: 'Poor',
                            color: '#E7431F',
                            variant: 'error'
                        }
                        if (signal > poorStoreStatusPercentage && signal <= goodStoreStatusPercentage && item?.online) {
                            status = {
                                id: 1,
                                label: 'Fair',
                                color: '#F8C45d',
                                variant: 'warning'

                            };
                        } else if (signal > goodStoreStatusPercentage && item?.online) {
                            status = {
                                id: 0,
                                label: 'Good',
                                color: '#5BA52E',
                                variant: 'success'

                            }
                        }
                        return { ...item, id: key, statusId: status.id, status, signal }
                    }) : []}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
            </Box>
        </Card>
    )
}