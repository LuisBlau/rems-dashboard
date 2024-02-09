/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    CancelScheduleSend,
    Cancel,
    Warning,
    Pending,
    WatchLater,
    CheckCircle,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Search,
    Start,
    HighlightOff,
    ExpandMore,
} from '@mui/icons-material';
import {
    Box,
    IconButton,
    Chip,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputBase,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Tooltip,
    Collapse,
    TablePagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { debounce } from '@mui/material/utils';
import UserContext from '../../pages/UserContext.js';

function StatusBadge(status) {
    switch (status) {
        case 'cancel':
        case 'Cancel':
            return (
                <Tooltip title="Canceling">
                    <CancelScheduleSend />
                </Tooltip>
            );
        case 'cancelled':
        case 'Cancelled':
            return (
                <Tooltip title="Cancelled">
                    <Cancel />
                </Tooltip>
            );
        case 'Failed':
            return (
                <Tooltip title={'Failed'}>
                    <Warning />
                </Tooltip>
            );
        case 'InProgress':
            return (
                <Tooltip title="In Progress">
                    <Pending />
                </Tooltip>
            );
        case 'Pending':
            return (
                <Tooltip title="Pending">
                    <WatchLater />
                </Tooltip>
            );
        case 'Staged':
            return (
                <Tooltip title="Staged">
                    <WatchLater />
                </Tooltip>
            );
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return (
                <Tooltip title="Success">
                    <CheckCircle />
                </Tooltip>
            );
        case 'initial':
        case 'Initial':
            return (
                <Tooltip title="Initial">
                    <Start />
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
            // return '#F2FAAB';
        case 'cancelled':
        case 'Cancelled':
            return '#E6E6E7';
        case 'Failed':
            return '#F57C62';
        case 'InProgress':
            return '#B1E0FC';
        case 'Pending':
        case 'Staged':
            return '#B7DBFF';
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return '#9DC982';
        case 'initial':
        case 'Initial':
            return '#FAF9F6';
        default:
            return '#FAF9F6';
    }
}

function StatusSummaryColor(status) {
    switch (status) {
        case 'cancel':
        case 'Cancel':
            return '#F2FAAB';
        case 'cancelled':
        case 'Cancelled':
            return '#E6E6E7';
        case 'Failed':
            return '#ffaf9e';
        case 'InProgress':
            return '#B1E0FC';
        case 'Pending':
        case 'Staged':
            return '#d5eaff';
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return '#DEEDD5';
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

const headCells = [
    {
        id: 'id',
        disablePadding: true,
        sortable: false,
        filterable: false,
        label: '',
    },
    {
        id: 'storeName',
        disablePadding: false,
        sortable: true,
        filterable: true,
        label: 'Store',
    },
    {
        id: 'package',
        disablePadding: false,
        sortable: false,
        filterable: true,
        label: 'Configuration',
    },
    {
        id: 'status',
        disablePadding: false,
        sortable: false,
        filterable: false,
        label: 'Status',
    },
    {
        id: 'apply_time',
        disablePadding: false,
        sortable: true,
        filterable: false,
        label: 'Apply Time',
    },
    {
        id: 'action',
        headerAlign: 'center',
        disablePadding: true,
        sortable: false,
        filterable: false,
        label: '',
    },
    {
        id: 'expand',
        headerAlign: 'center',
        disablePadding: true,
        sortable: false,
        filterable: false,
        label: '',
    },
];
const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead sx={{ backgroundColor: '#EDEDF0' }}>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.headerAlign ?? 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const ExpandableTableRow = ({ children, status, /* detailMode,  showModal,*/ expandComponent, ...otherProps }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    return (
        <>
            <TableRow {...otherProps} sx={{backgroundColor: ['cancel', 'Cancel', 'cancelled', 'Cancelled'].includes(status) ? '#F3F3F3' : null}}>
                {children}
                <TableCell padding="checkbox">
                    <IconButton onClick={() => { setIsExpanded(!isExpanded); /* detailMode && showModal() */ }}>
                        {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell padding="none" sx={{ backgroundColor: StatusColor(status), height: 0 }} />
                <TableCell colSpan="6" sx={{ padding: 0, backgroundColor: StatusColor(status) }}>
                    <Collapse in={isExpanded/*  && !detailMode */} timeout="auto" unmountOnExit>
                        {expandComponent}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

export function DeployTable(props) {
    const [open, setOpen] = useState(false);
    const context = useContext(UserContext);
    const [data, setData] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [searchText, setSearchText] = React.useState('');

    const functionApiCall = (page, perPage, searchText, orderBy, order, callback) => {
        let params = {
            orderBy,
            order,
            page,
            limit: perPage,
            search: searchText,
        };
        if (context.selectedRetailerIsTenant === false) {
            params.retailerId = context.selectedRetailer;
        } else {
            if (context.selectedRetailerParentRemsServerId) params.retailerId = context.selectedRetailerParentRemsServerId;
            params.tenantId = context.selectedRetailer;
        }
        axios.get(`api/REMS/deploys`, { params }).then(function (response) {
            callback(response.data);
        })
    };

    useEffect(() => {
        setLoading(true);
        functionApiCall(page, rowsPerPage, searchText, orderBy, order, (res) => {
            setTotalItems(res?.counts[0]?.totalItem);
            setData(res?.items);
            setLoading(false);
        });
    }, [page, rowsPerPage, orderBy, order]);

    useEffect(() => {
        if (context.selectedRetailerIsTenant !== null) {
            setLoading(true);
            functionApiCall(page, rowsPerPage, searchText, orderBy, order, (res) => {
                setTotalItems(res?.counts[0]?.totalItem);
                setData(res?.items);
                setLoading(false);
            });
        }
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId, context.selectedRetailerIsTenant]);

    const fetch = React.useMemo(
        () =>
            debounce((searchText, callback) => {
                setLoading(true);
                functionApiCall(page, rowsPerPage, searchText, orderBy, order, callback);
            }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;
        fetch(searchText, (res) => {
            if (active) {
                setTotalItems(res?.counts[0]?.totalItem);
                setData(res?.items);
                setLoading(false);
                setPage(0);
            }
        });
        return () => {
            active = false;
        };
    }, [searchText, fetch]);

    const handleChangeSearchText = (text) => {
        setSearchText(text);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

        const deployUpdate = {
            storeName: currentData.storeName,
            id: currentData.id,
        };

        let filters = `retailerId=${context.selectedRetailer}`
        if (context.selectedRetailerIsTenant === true) {
            filters = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
        }
        axios.post(`/api/REMS/deploy-cancel?${filters}`, deployUpdate)
            .then((response) => {
                setOpen(false);
                console.log('cancel response : ', response);
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

    return (
        <div>
            <Box pt={5} pl={3} pb={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', maxWidth: 600, width: '100%', minWidth: 300, mr: 3 }}>
                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <Search />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search in Distribution"
                        inputProps={{ 'aria-label': 'search in distribution' }}
                        onChange={(event) => handleChangeSearchText(event.target.value)}
                    />
                </Paper>
            </Box>
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
            <Paper>
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {data.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <ExpandableTableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.data._id}
                                        status={row.data.status}
                                        expandComponent={
                                            <>
                                                {row?.steps?.map((step, index) => (
                                                    <Accordion
                                                        key={index}
                                                        sx={{ backgroundColor: StatusSummaryColor(step.status) }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMore />}
                                                            aria-controls={'panel' + row.data.id + ':' + index + 'bh-content'}
                                                            id={'panel' + row.data.id + ':' + index + 'bh-header'}
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
                                                        <AccordionDetails sx={{ bgcolor: '#FFFFFF', maxHeight: '250px', overflow: 'auto' }}>
                                                            {(step.output?.filter(x => x)?.length > 0) ? step.output.map((line, idx) => (
                                                                <p style={{ wordBreak: 'break-word' }} key={'l-' + index + '-' + idx}>{line}</p>
                                                            )) : <p>{renderMessage(step)}</p>}
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))}
                                            </>
                                        }
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            sx={{ width: '100px' }}
                                            scope="row"
                                            padding='none'
                                        >
                                            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: StatusColor(row.data.status) }}>{StatusBadge(row.data.status)}</Box>
                                        </TableCell>
                                        <TableCell align="left" sx={{ paddingY: 0 }}>{row.data.storeName}</TableCell>
                                        <TableCell align="left" sx={{ paddingY: 0 }}>{row.data.package}</TableCell>
                                        <TableCell align="left" sx={{ paddingY: 0 }}>
                                            {
                                                <Chip label={row.data.status === 'cancel' || row.data.status === 'Cancel' ? 'Cancelled' : row.data.status} sx={{ backgroundColor: StatusColor(row.data.status), width: "80%" }} variant="outlined" />
                                            }
                                        </TableCell>
                                        <TableCell align="left" sx={{ paddingY: 0 }}>{row.data.apply_time}</TableCell>
                                        <TableCell align="center" padding='none'>
                                            <IconButton
                                                disabled={row.data.status.toUpperCase() !== 'INITIAL' && row.data.status.toUpperCase() !== 'PENDING'}
                                                onClick={() => {
                                                    setOpen(true);
                                                    setCurrentData(row);
                                                }}
                                            >
                                                <HighlightOff />
                                            </IconButton>
                                        </TableCell>
                                    </ExpandableTableRow>
                                );
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[25, 50, 100]}
                                    count={totalItems}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    showFirstButton
                                    showLastButton
                                    labelRowsPerPage={'Per Page'}
                                    labelDisplayedRows={({ from, to, count }) => {
                                        return `${from}-${to} of ${count !== -1 ? `${count} Results` : `more than ${to}`}`;
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}
