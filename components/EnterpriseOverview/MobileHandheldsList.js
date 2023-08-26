import React, { useEffect, useState } from 'react';
import { Box, Card } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import moment from 'moment';

export default function MobileHandheldsList({ handhelds }) {
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
                field: 'assetId',
                headerName: 'Asset Name',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'model',
                headerName: 'Model',
                width: 100,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'ipAddress',
                headerName: 'IP Address',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'macAddress',
                headerName: 'Mac Address',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'online',
                headerName: 'Status',
                width: 100,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
                renderCell: (params) => params.row.online === 'Operational' ? 'Online' : 'Offline',
                valueGetter: (params) => { return params.row.online === 'Operational' ? 'Online' : 'Offline' }
            },
            {
                field: 'os',
                headerName: 'OS',
                width: 150,
                sortable: true,
                sortingOrder: ['asc', 'desc']
            },
            {
                field: 'Manufacturer',
                headerName: 'Manufacturer',
                width: 200,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
            },
            {
                field: 'updatedTime',
                headerName: 'Last Update',
                width: 250,
                sortable: true,
                type: 'datetime',
                sortingOrder: ['asc', 'desc'],
                valueGetter: (params) => params.value,
                renderCell: (params) => params.row.updatedTime ? moment(params.row.last_updated).fromNow() : 'N/A'
            },
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
                    rows={handhelds}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
            </Box>
        </Card>
    )
}