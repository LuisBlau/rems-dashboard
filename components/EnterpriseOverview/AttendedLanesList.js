import React, { useEffect, useState } from 'react';
import { Box, Card, Link, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';
import axios from 'axios';
import { filter, find, intersectionBy } from 'lodash';

export default function AttendedLanesList({ context, places, selectedRetailer, attendedList }) {
    const [columns, setColumns] = useState([])
    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    //this is the little comment to link the store in the store overview
    const renderLinkStoreView = (value) => {
        if (context.selectedRetailerIsTenant === false) {
            return <Link style={{ color: '#004EE7' }} href={'/storeOverview?storeName=' + value.row.storeName + '&retailer_id=' + selectedRetailer}>{value.row.storeName}</Link>
        } else {
            return <Link style={{ color: '#004EE7' }} href={'/storeOverview?storeName=' + value.row.storeName + '&retailer_id=' + context.selectedRetailerParentRemsServerId + '&tenant_id=' + context.selectedRetailer}>{value.row.storeName}</Link>
        }
    }

    useEffect(() => {
        setLoading(true);
        if (context.selectedRetailerIsTenant === false) {
            const placesData = places.map(p => ({ ...p, id: p._id }));
            const response = attendedList?.filter(store => placesData?.find(x => x?.storeName === store?.storeName)).map(r => ({ ...r, id: r._id }));
            setAgents(response);
            setLoading(false);

        } else {
            const placesData = places.map(p => ({ ...p, id: p._id }));
            const response = attendedList?.filter(store => placesData?.find(x => x?.storeName === store?.storeName)).map(r => ({ ...r, id: r._id }));
            setAgents(response);
            setLoading(false);

        }

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
            // {
            //     field: 'type',
            //     headerName: 'Type',
            //     width: 150,
            //     sortable: true,
            //     sortingOrder: ['asc', 'desc'],
            // },
            {
                field: 'ipaddress',
                headerName: 'IP',
                width: 200,
                sortable: false,
            },
            {
                field: 'statusId',
                headerName: 'Status',
                width: 200,
                sortingOrder: ['asc', 'desc'],
                sortable: true,
                renderCell: (params) => {
                    return <Typography variant='body2' sx={{ marginRight: 4, width: '20%' }}>{moment(params.row.last_updated_sec * 1000).diff(Date.now(), 'hours') < -24 ? 'Disconnected' : params.row?.online ? 'Online' : 'Offline'}</Typography>
                },
                valueGetter: (params) => { return moment(params.row.last_updated_sec * 1000).diff(Date.now(), 'hours') < -24 ? 'Disconnected' : params.row?.online ? 'Online' : 'Offline' }
            },
            {
                field: 'os',
                headerName: 'OS',
                width: 100,
                sortingOrder: ['asc', 'desc'],
                sortable: true
            },
            {
                field: 'last_updated_sec',
                headerName: 'Last Update',
                width: 250,
                sortable: true,
                type: 'datetime',
                sortingOrder: ['asc', 'desc'],
                valueGetter: (params) => params.value,
                renderCell: (params) => params.row.last_updated_sec ? moment(params.row.last_updated_sec * 1000).fromNow() : 'N/A'
            }
        ])
    }, [places, attendedList])


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
                    loading={loading}
                    rowHeight={60}
                    slots={{ toolbar: CustomToolbar }}
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'last_updated', sort: 'desc' }]
                        },
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    rows={agents ?? []}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
            </Box>
        </Card>
    )
}