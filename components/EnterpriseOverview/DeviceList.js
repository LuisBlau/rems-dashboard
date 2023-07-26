import React, { useEffect, useState } from 'react';
import { Box, Card } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';

export default function DeviceList({ devices }) {
    const [columns, setColumns] = useState([])

    useEffect(() => {

        setColumns([
            {
                field: 'storeName',
                headerName: 'Store',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'agentName',
                headerName: 'Agent',
                width: 200,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'deviceType',
                headerName: 'Device Type',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'ip',
                headerName: 'IP Address',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'online',
                headerName: 'Status',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
                renderCell: (params) => params.row.online === 'true' ? 'Online' : 'Offline'
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
                    rows={devices}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
            </Box>
        </Card>
    )
}