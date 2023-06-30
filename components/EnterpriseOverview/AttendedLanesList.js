import React, { useEffect, useState } from 'react';
import { Box, Card, Link, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';
import axios from 'axios';

export default function AttendedLanesList({ selectedRetailer }) {
    const [columns, setColumns] = useState([])
    const [agents, setAgents] = useState([])
    //this is the little comment to link the store in the store overview
    const renderLinkStoreView = (value) => {
        return <Link style={{ color: '#004EE7' }} href={'/storeOverview?storeName=' + value.row.storeName + '&retailer_id=' + selectedRetailer}>{value.row.storeName}</Link>
    }

    useEffect(() => {
        axios.get(`/api/REMS/getAttendedLanes?retailerId=${selectedRetailer}`).then(function (res) {
            setAgents(res.data)
        })

        setColumns([
            {
                field: 'storeName',
                headerName: 'Store',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
                renderCell: renderLinkStoreView
            },
            {
                field: 'agentName',
                headerName: 'Device',
                width: 200,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'type',
                headerName: 'Type',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'statusId',
                headerName: 'Status',
                width: 100,
                sortingOrder: ['asc', 'desc'],
                sortable: true,
                renderCell: (params) => {
                    return <Typography variant='body2' sx={{ marginRight: 4, width: '20%' }}>{params.row?.online ? 'Online' : 'Offline'}</Typography>
                },
            },
            {
                field: 'os',
                headerName: 'OS',
                width: 100,
                sortingOrder: ['asc', 'desc'],
                sortable: true
            },
            {
                field: 'last_updated',
                headerName: 'Last Update',
                width: 250,
                sortable: true,
                type: 'datetime',
                sortingOrder: ['asc', 'desc'],
                valueGetter: (params) => params.value,
                renderCell: (params) => params.row.last_updated ? moment(params.row.last_updated).fromNow() : 'N/A'
            }
        ])
    }, [])


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
                    rowHeight={60}
                    slots={{ toolbar: CustomToolbar }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'last_updated', sort: 'desc' }]
                        },
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    rows={agents}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
            </Box>
        </Card>
    )
}