/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PendingIcon from '@mui/icons-material/Pending';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StartIcon from '@mui/icons-material/Start';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../pages/UserContext.js';
import { useEffect } from 'react';
import { Badge, Box, Chip, CircularProgress, IconButton, Modal } from '@mui/material';
import { useDebounce } from '../../src/hooks/useDebounce';
import { DataGrid } from '@mui/x-data-grid';
import { Check, Delete, HighlightOff, Preview, Remove } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 'calc(100vh - 200px)',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    //boxShadow: 24,
    overflow: 'scroll',
};

function StatusBadge(status) {
    switch (status) {
        case 'cancel':
        case 'Cancel':
            return (
                <Tooltip title="Canceling">
                    <CancelScheduleSendIcon />
                </Tooltip>
            );
        case 'cancelled':
        case 'Cancelled':
            return (
                <Tooltip title="Cancelled">
                    <CancelIcon />
                </Tooltip>
            );
        case 'Failed':
            return (
                <Tooltip title={'Failed'}>
                    <WarningIcon />
                </Tooltip>
            );
        case 'InProgress':
            return (
                <Tooltip title="In Progress">
                    <PendingIcon />
                </Tooltip>
            );
        case 'Pending':
            return (
                <Tooltip title="Pending">
                    <WatchLaterIcon />
                </Tooltip>
            );
        case 'Staged':
            return (
                <Tooltip title="Staged">
                    <WatchLaterIcon />
                </Tooltip>
            );
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return (
                <Tooltip title="Success">
                    <CheckCircleIcon />
                </Tooltip>
            );
        case 'initial':
        case 'Initial':
            return (
                <Tooltip title="Initial">
                    <StartIcon />
                </Tooltip>
            );
        default:
            return <p>{status}</p>;
    }
}

function StatusColor(status) {
    switch (status) {
        case 'cancel':
        case 'Cancel':
            return '#F2FAAB';
        case 'cancelled':
        case 'Cancelled':
            return '#FACAA4';
        case 'Failed':
            return '#FCB3B1';
        case 'InProgress':
            return '#B1E0FC';
        case 'Pending':
        case 'Staged':
            return '#D6EEFD';
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return '#CDFEB6';
        case 'initial':
        case 'Initial':
            return '#FAF9F6';
        default:
            return '#FAF9F6';
    }
}



function StepCommands(step) {
    switch (step.type) {
        case 'shell':
            return step.cmd + '--' + step.args;
        case 'upload':
            return step.filename;
        case 'unzip':
            return step.file;
        case 'apply':
            return step.product;
    }
    return '';
}

export function DeployTable(props) {
    const [open, setOpen] = useState(false);
    const context = useContext(UserContext)
    const [data, setData] = useState([])
    const [viewModal, setViewModal] = useState(false)
    const [currentData, setCurrentData] = useState([])

    const handleClose = () => {
        setOpen(false);
        setCurrentData(null);
    };

    const handleCancel = () => {
        // If we use these much we can install 'http-status-codes'
        const INTERNAL_SERVER_ERROR = 500;
        const NOT_FOUND = 404;
        const NOT_MODIFIED = 304;
        const OK = 200;

        const deployInfo = currentData._id.split('_');
        const deployUpdate = {
            storeName: deployInfo[0],
            id: deployInfo[1],
        };

        let filters = `retailerId=${context.selectedRetailer}`
        if (context.selectedRetailerIsTenant === true) {
            filters = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
        }
        axios.post(`/api/REMS/deploy-cancel?${filters}`, deployUpdate)
            .then((response) => {
                setOpen(false);
                console.log('cancel response : ', response);
                // This worked so reload the page to show the new status.
                window.location.reload(true);
            })
            .catch((error) => {
                console.log('cancel error message: ', error.response.data.message);
                console.log('cancel error status : ', error.response.request.status);
                console.log('cancel error statusText : ', error.response.request.statusText);
                switch (error.response.request.status) {
                    case NOT_MODIFIED:
                    case NOT_FOUND:
                        alert('Unable to cancel.');
                        break;
                    case INTERNAL_SERVER_ERROR:
                        alert('Internal Server Error');
                        break;
                    default:
                        alert('Cancel Error.');
                        break;
                }
            });
    };

    function renderMessage(item) {
        if (item.status == 'Failed')
            return 'Deployment FAILED.';
        else if (item.status == 'Pending')
            return 'Deployment PENDING';
        else if (item.status == 'Success')
            return 'Deployment SUCCESS';
        return '';
    }

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
        setLoading(true);
        let params = {
            filter,
            sort,
            page,
            limit: pageSize,
            store: props.storeFilter,
            package: props.packageFilter,
            records: props.maxRecords,
            status: props.statusFilter,
        }
        if (context.selectedRetailerIsTenant === false) {
            params.retailerId = context.selectedRetailer;
        } else {
            if (context.selectedRetailerParentRemsServerId) params.retailerId = context.selectedRetailerParentRemsServerId;
            params.tenantId = context.selectedRetailer;
        }

        axios.get(`/api/REMS/deploys`, { params }).then(function (response) {
            setTotalItems(response.data.pagination.totalItem);
            setData(response.data?.items)
            setLoading(false)
        })
    }

    const columns = [
        {
            field: 'id',
            headerName: '',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: StatusColor(params.row.status) }}>{StatusBadge(params.row.status)}</Box>
        },
        {
            field: 'storeName',
            headerName: 'Store',
            flex: 1,
            sortable: true,
            filterable: true
        },
        {
            field: 'package',
            headerName: 'Configuration',
            sortable: false,
            flex: 1,
            filterable: true
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => <Chip label={params.value} sx={{ backgroundColor: StatusColor(params.value), width: "80%" }} variant="outlined" />
        },
        {
            field: 'apply_time',
            headerName: 'Apply Time',
            flex: 1,
            sortable: true,
        },
        {
            field: '_id',
            headerName: 'Action',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            width: 150,
            renderCell: (params) => {
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>

                        <Button
                            disabled={
                                params.row.status.toUpperCase() !== 'INITIAL' && params.row.status.toUpperCase() !== 'PENDING'
                            }
                            onClick={() => {
                                setOpen(true);
                                setCurrentData(params.row);
                            }}
                            variant="outlined"
                            sx={{ background : '#e57373'}}
                            startIcon={<HighlightOff />}
                        />
                        <Button
                            onClick={() => {
                                setViewModal(true);
                                setCurrentData(params.row);
                            }}
                            variant="outlined"
                            sx={{ background : '#81c784'}}
                            startIcon={<Preview />}
                        />
                    </Box>
                )
            },
        },
    ];


    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Are you sure, you want to cancel this deployment?'}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCancel} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <DataGrid
                loading={loading}
                rows={data}
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
                rowSelection={false}
                sortMode="server"
                filterMode="server"
                onFilterModelChange={onFilterChange}
                onSortModelChange={onSortChange}
                disableSelectionOnClick
            />
            {viewModal &&
                <Modal
                    open={viewModal}
                    onClose={() => {
                        setViewModal(false);
                        setCurrentData(null)
                    }}
                >
                    <Box sx={style}>
                        <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between', borderBottom: 1, backgroundColor: '#bbdefb', alignItems: 'center' }}>
                            <Typography>{currentData.package}</Typography>
                            <IconButton onClick={() => {
                                setViewModal(false);
                                setCurrentData(null)
                            }}> <HighlightOff /></IconButton>

                        </Box>
                        {currentData?.steps.map((step, index) => (
                            <Accordion
                                key={index}
                                style={{ margin: '15px', backgroundColor: StatusColor(step.status) }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={'panel' + currentData.id + ':' + index + 'bh-content'}
                                    id={'panel' + currentData.id + ':' + index + 'bh-header'}
                                >
                                    <Grid container spacing={3}>
                                        <Grid item xs={1}>
                                            {StatusBadge(step.status)}
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography sx={{ flexShrink: 0 }}>
                                                {step.type === 'apply' ? step.command : step.type} --{' '}
                                                {StepCommands(step)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </AccordionSummary>
                                <AccordionDetails sx={{ bgcolor: '#FFEBE0' }}>
                                    {(step.output?.filter(x => x)?.length > 0) ? step.output.map((line, idx) => (
                                        <p key={'l-' + index + '-' + idx}>{line}</p>
                                    )) : <p>{renderMessage(step)}</p>}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </Modal>
            }
        </div>
    );
}
