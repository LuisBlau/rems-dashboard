
/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../pages/UserContext';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import RequestLinkButton from '../Buttons/RequestLinkButton';
import DownloadAzureFileButton from '../Buttons/DownloadAzureFileButton';
import _ from 'lodash';
import { useDebounce } from '../../src/hooks/useDebounce';
import { useCallback } from 'react';
const PREFIX = 'CaptureGrid';

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


export default function CaptureGrid() {
    const context = useContext(UserContext)
    const [captures, setCaptures] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [filter, setFilter] = useState(null);
    const [sort, setSort] = useState({ Timestamp: -1 })
    const filterQuery = useDebounce(filter, 3000)

    const onFilterChange = useCallback((filterModel) => {
        const filter = filterModel.items?.[0];
        if (filter) {
            const f = { [filter.field]: filter.value };
            setFilter(f);
        }
    }, []);

    const onSortChange = useCallback((model) => {
        if (model.length > 0) {
            let localSort = { [model[0].field]: model[0].sort === 'asc' ? 1 : -1 }
            setSort(localSort)
        }
    }, []);

    useEffect(() => {
        if (filterQuery || sort) {
            functionApiCall(page, pageSize, filterQuery, sort)
        }
    }, [filterQuery, sort])

    useEffect(() => {

        if (context.selectedRetailerIsTenant !== null) {
            functionApiCall(page, pageSize, filter, sort);
        }
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId, context.selectedRetailerIsTenant])

    const functionApiCall = (page, pageSize, filter, sort = {}) => {
        setLoading(true)
        if (context.selectedRetailerIsTenant === false) {
            axios.get(`/api/registers/captures?retailerId=${context.selectedRetailer}&page=${page}&limit=${pageSize}`, { params: { filter, sort }, timeout: 10000 }).then(function (response) {
                setTotalItems(response.data.pagination.totalItem);
                const captures = []
                response.data.items.forEach(element => {
                    captures.push({
                        ...element,
                        id: element._id
                    })
                });
                setLoading(false)
                setCaptures(captures)
            })
        } else {
            if (context.selectedRetailerParentRemsServerId)
                axios.get(`/api/registers/captures?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}&page=${page}&limit=${pageSize}&isAdmin=${_.includes(context.userRoles, 'toshibaAdmin')}`, { params: { filter, sort } }).then(function (response) {
                    const captures = []
                    setTotalItems(response.data.pagination.totalItem);
                    response.data.items.forEach(element => {
                        captures.push({
                            ...element,
                            id: element._id
                        })
                    });
                    setLoading(false)
                    setCaptures(captures)
                })
        }
    }
    const columns = [
        {
            field: 'Store',
            headerName: 'Store',
            flex: 1,
            sortable: true,
            filterable: true
        },
        {
            field: 'CaptureType',
            headerName: 'Capture Type',
            sortable: false,
            flex: 1,
            filterable: true
        },
        {
            field: 'Agent',
            headerName: 'Agent',
            flex: 1,
            sortable: false,
            filterable: true
        },
        {
            field: 'CaptureSource',
            headerName: 'Capture Source',
            sortable: false,
            flex: 1,
            filterable: true
        },
        {
            field: 'Timestamp',
            headerName: 'Timestamp',
            flex: 1,
            type: 'dateTime',
            sortable: true,
            valueGetter: (params) => {
                var dateString = _.replace(params.value, /-/g, '/') // firefox doesn't like '-' in date strings
                return new Date(dateString)
            }
        },
        {
            field: 'SBreqLink',
            headerName: 'Request from Store',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            flex: 1,
            renderCell: (params) => {
                return (
                    <RequestLinkButton link={params.value} />
                )
            },
        },
        {
            field: 'Download',
            headerName: 'Pushed to Cloud',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            flex: 1,
            renderCell: (params) => {
                return (
                    params.value !== undefined && <DownloadAzureFileButton link={params.value} />
                )
            }
        }
    ];

    return (
        <Box sx={{ height: '70vh', width: '100%' }}>
            <DataGrid
                loading={loading}
                rows={captures}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'Timestamp', sort: 'desc' }]
                    },
                    pagination: { paginationModel: { pageSize: pageSize } },
                }}
                rowCount={totalItems}
                onPaginationModelChange={({ page, pageSize }) => { setPage(page); setPageSize(pageSize); functionApiCall(page, pageSize, filter, sort) }}
                pageSizeOptions={[25, 50, 100]}
                paginationMode="server"
                checkboxSelection={false}
                sortMode="server"
                filterMode="server"
                onFilterModelChange={onFilterChange}
                onSortModelChange={onSortChange}
                disableSelectionOnClick
            />
        </Box>
    );
}
