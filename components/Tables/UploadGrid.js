/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, Snackbar, Switch } from '@mui/material';
import { useContext } from 'react';
import UserContext from '../../pages/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from 'lodash';

const PREFIX = 'UploadGrid';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const SuccessToastDuration = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const FailToastDuration = 10000;

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`,
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

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    },
}));

export default function UploadGrid() {
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [uploadData, setUploadData] = useState([]);
    const context = useContext(UserContext);

    const columns = [
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
        },
        {
            field: 'filename',
            headerName: 'File Name',
            flex: 1,
            sortable: true,
            filterable: true,
        },
        {
            field: 'timestamp',
            headerName: 'Timestamp',
            flex: 1,
            type: 'dateTime',
            sortable: true,
            valueGetter: (params) => new Date(params.row.timestamp),
        },

        {
            field: 'retailer_id',
            headerName: 'File Origin',
            flex: 1,
            renderCell: (params) => (params.value === 'COMMON' ? params.value : 'RETAILER'),
        },

        {
            field: 'archived',
            headerName: 'Archived',
            flex: 1,
            renderCell: (params) => (
                <Switch
                    onChange={(e) => {
                        changeArchiveStatus(e, params.row?.uuid);
                    }}
                    checked={params.value == 'true' ? true : false}
                    disabled={params.row.retailer_id === 'COMMON' && !context?.userRoles?.includes('toshibaAdmin')}
                    color="success"
                />
            ),
        },
    ];

    if (context?.userRoles?.includes('toshibaAdmin')) {
        columns.push({
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            flex: 1,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this file?')) {
                            deleteFile(params.row.retailer_id, params.row?.uploadId);
                        }
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        });
        columns.push({
            field: 'forProd',
            headerName: 'For Production',
            flex: 1,
            renderCell: (params) => {
                return (
                    params.row.retailer_id === 'COMMON' && (
                        <Switch
                            onChange={(e) => {
                                changeForProdStatus(e, params.row?.uuid);
                            }}
                            checked={params.value === 'true' ? true : false}
                            color="success"
                        />
                    )
                );
            },
        });
    } else if (context?.userRoles?.includes('Administrator')) {
        columns.push({
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this file?')) {
                            deleteFile(params.row.retailer_id, params.row?.uploadId);
                        }
                    }}
                    disabled={
                        context.selectedRetailerIsTenant === false
                            ? params.row.retailer_id !== context.selectedRetailer
                            : params.row.tenant_id !== context.selectedRetailer
                    }
                >
                    <DeleteIcon />
                </IconButton>
            ),
        });
    }

    function deleteFile(retailerId, id) {
        var url = `/api/REMS/deletefile`;
        var data = { retailerId, id };
        axios
            .delete(url, { data })
            .then(function (data) {
                setToastSuccess('File deletion was successful');
                setOpenSuccess(true);
                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                setToastFailure('There has been a problem with your fetch operation:');
                setOpenFailure(true);
                FailToastDuration;
                window.location.reload();
            });
    }

    function fetchUploadData() {
        if (context.selectedRetailerParentRemsServerId) {
            axios
                .get(
                    `/api/REMS/uploads?archived=true&retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
                )
                .then((response) => {
                    if (!_.includes(context.userRoles, 'toshibaAdmin')) {
                        const prodList = [];
                        response.data.forEach((element) => {
                            if (element.retailer_id !== 'COMMON' || element.forProd === 'true') {
                                prodList.push(element);
                            }
                        });
                        setUploadData(prodList);
                    } else {
                        setUploadData(response.data);
                    }
                });
        } else {
            axios.get(`/api/REMS/uploads?archived=true&retailerId=${context.selectedRetailer}`).then((response) => {
                if (!_.includes(context.userRoles, 'toshibaAdmin')) {
                    const prodList = [];
                    response.data.forEach((element) => {
                        if (element.retailer_id !== 'COMMON' || element.forProd === 'true') {
                            prodList.push(element);
                        }
                    });
                    setUploadData(prodList);
                } else {
                    setUploadData(response.data);
                }
            });
        }
    }
    useEffect(() => {
        if (context.selectedRetailer) {
            fetchUploadData();
        }
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId]);

    const changeArchiveStatus = (e, id) => {
        axios
            .get('/api/REMS/setArchive?uuid=' + id + '&archived=' + e.target.checked.toString())
            .then((response) => {
                if (response.status !== 200) {
                    setToastFailure('Error changing archive info!');
                    setOpenFailure(true);
                    return;
                }
                fetchUploadData();
                setToastSuccess('Archive Info Successfully Saved.');
                setOpenSuccess(true);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };

    const changeForProdStatus = (e, id) => {
        axios
            .get('/api/REMS/setForProd?uuid=' + id + '&forProd=' + e.target.checked.toString())
            .then((response) => {
                if (response.status !== 200) {
                    setToastFailure('Error changing production enablement!');
                    setOpenFailure(true);
                    return;
                }
                fetchUploadData();
                setToastSuccess('Production Enablement Successfully Saved.');
                setOpenSuccess(true);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };

    if (uploadData.length > 0) {
        return (
            <Box sx={{ height: 550, width: '100%', marginTop: 2 }}>
                <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'timestamp', sort: 'desc' }],
                        },
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    rows={uploadData?.map((item, key) => ({ ...item, id: key, uploadId: item.id }))}
                    columns={columns}
                    pageSizeOptions={[25, 50, 100]}
                    checkboxSelection={false}
                    rowSelection={false}
                />
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSuccess}
                    autoHideDuration={SuccessToastDuration}
                    onClose={(event) => {
                        setOpenSuccess(false);
                    }}
                >
                    <Alert variant="filled" severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        {toastSuccess}
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openFailure}
                    autoHideDuration={FailToastDuration}
                    onClose={(event) => {
                        setOpenFailure(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Error!!!</AlertTitle>
                        {toastFailure}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }
}
