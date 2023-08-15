import React, { useEffect, useState } from 'react';
import { Box, Card } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

export default function PeripheralsList({ peripherals }) {
    const [columns, setColumns] = useState([])

    useEffect(() => {

        setColumns([
            {
                field: 'storeName',
                headerName: 'Store',
                width: 100,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'model',
                headerName: 'Model',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'firmware',
                headerName: 'Firmware',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'osVersion',
                headerName: 'OS Version',
                width: 100,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'bluetoothId',
                headerName: 'Bluetooth Id',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'bluetoothAddress',
                headerName: 'Bluetooth Address',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc']
            },
            {
                field: 'bluetoothLibraryVersion',
                headerName: 'Bluetooth Library',
                width: 125,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'bluetoothRadioVersion',
                headerName: 'Bluetooth Radio',
                width: 125,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'freeFlash',
                headerName: 'Free Flash',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'totalFlash',
                headerName: 'Total Flash',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'freeRam',
                headerName: 'Free RAM',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'totalRam',
                headerName: 'Total RAM',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'deviceUptime',
                headerName: 'Uptime',
                width: 250,
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
                    rows={peripherals}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
            </Box>
        </Card>
    )
}