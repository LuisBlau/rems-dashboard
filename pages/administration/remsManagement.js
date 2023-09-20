import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import _ from 'lodash';
import axios from 'axios';
import UserContext from '../UserContext';
import { Alert, AlertTitle, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Input, MenuItem, Select, Snackbar, Switch, TextField, Typography, styled } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse';

export default function RemsManagement() {

    /// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
    const SuccessToastDuration = 4000;
    /// Number of millisec to show Failure toast. Page does not reload after.
    const FailToastDuration = 10000;
    const context = useContext(UserContext);
    const [remsInfo, setRemsInfo] = useState({})
    const [remsStoreInfo, setRemsStoreInfo] = useState([])
    const [loadingTenants, setLoadingTenants] = useState(true)
    const [loadingStores, setLoadingStores] = useState(true)
    const [newTenantId, setNewTenantId] = useState('')
    const [newTenantDescription, setNewTenantDescription] = useState('')
    const [newTenantDialogOpen, setNewTenantDialogOpen] = useState(false)
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [doingActions, setDoingActions] = useState(false)
    const [bulkUpload, setBulkUpload] = useState(false)
    const [fileName, setFileName] = useState('');
    const [fileToUpload, setFileToUpload] = useState(null);
    const [uploadedRows, setUploadedRows] = useState([])
    const allowedExtensions = ['csv'];
    const uploadColumns = [
        { field: 'store', headerName: 'Store Name', width: 150 },
        { field: 'tenant', headerName: 'Tenant ID', width: 150 }
    ];

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        '& .super-app-theme--noTenant': {
            backgroundColor: getBackgroundColor('red'),
            '&:hover': {
                background: "#ff5252"
            }
        },
    }));

    const Input = styled('input')({
        display: 'none',
    });

    const getBackgroundColor = (color) =>
        color === 'red' ? '#E7431F' : '#FFFFFF';

    const tenantColumns = [
        {
            field: 'description',
            headerName: 'Name',
            width: 400,
            sortable: true,
            sortingOrder: ['asc', 'desc'],
        },
        {
            field: 'retailer_id',
            headerName: 'ID',
            width: 400,
            sortable: true,
            sortingOrder: ['asc', 'desc'],
        },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <IconButton
                    disabled={doingActions}
                    onClick={() => {
                        if (window.confirm(`Are you sure you want to delete this tenant: ${params.row.description}?`)) {
                            deleteTenant(params.row.retailer_id);
                        }
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        }
    ]

    const storeColumns = [
        {
            field: 'storeName',
            headerName: 'Name',
            width: 200,
            sortable: true,
            sortingOrder: ['asc', 'desc'],
        },
        {
            field: 'last_updated_sec',
            headerName: 'Last Update',
            width: 200,
            sortable: true,
            sortingOrder: ['asc', 'desc'],
            valueGetter: (params) => params.row.last_updated_sec ? moment(params.row.last_updated_sec * 1000).fromNow() : 'N/A',
        },
        {
            field: 'online',
            headerName: 'Status',
            width: 200,
            sortable: true,
            sortingOrder: ['asc', 'desc'],
            valueGetter: (params) => params.row.online === true ? 'Online' : 'Offline'
        },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 100,
            renderCell: (params) => (
                <IconButton
                    disabled={doingActions}
                    onClick={() => {
                        if (window.confirm(`Are you sure you want to delete store: ${params.row.storeName}?`)) {
                            deleteStore(params.row.storeName);
                        }
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            ),
        }
    ]

    if (remsInfo?.tenants?.length > 0) {
        storeColumns.push(
            {
                field: 'tenant_id',
                headerName: 'Tenant',
                width: 400,
                sortable: true,
                sortingOrder: ['asc', 'desc'],
                renderCell: (params) => {
                    return (<Select
                        disabled={doingActions}
                        labelId="tenant-select-label"
                        id="tenant-select"
                        value={params.row.tenant_id ?? ''}
                        onChange={(e) => handleTenantChanged(params.row, e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        {remsInfo.tenants.map((tenant, index) => (
                            <MenuItem key={index} sx={{
                                mt: 1
                            }} value={tenant.retailer_id}>
                                {tenant.description}
                            </MenuItem>
                        ))}
                    </Select>)
                },
                valueGetter: (params) => { return params.row.tenant_id }
            }
        )
    }

    useEffect(() => {
        if (context.selectedRetailerIsTenant !== null)
            axios.get(`/api/retailers/getRemsStoreInfo?retailerId=${context.selectedRetailer}`).then(function (response) {
                response.data.remsInfo?.tenants?.forEach((tenant, index) => {
                    tenant.id = index
                });
                setRemsInfo(response.data.remsInfo)
                setLoadingTenants(false)
                setRemsStoreInfo(response.data.stores)
                setLoadingStores(false)
            })
    }, [context])

    function handleTenantChanged(row, val) {
        setDoingActions(true)
        axios.post('/api/stores/updateTenantAssignment', { retailer: row.retailer_id, store: row.storeName, newTenant: val })
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure('Error Saving Store Tenant Info!');
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Store Tenant Info Successfully Saved.');
                setOpenSuccess(true);
                setDoingActions(false)

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    }

    function handleNewTenantDialogClosed() {
        setNewTenantDialogOpen(false)
    }

    function deleteStore(store) {
        setDoingActions(true)
        let retailer = context.selectedRetailer
        if (context?.selectedRetailerParentRemsServerId !== null) {
            retailer = context.selectedRetailerParentRemsServerId
        }
        axios.delete('/api/stores/delete', { params: { store: store, retailer_id: retailer } })
            .then(function (response) {
                if (response.status !== 200) {
                    const errorMessage = response?.data?.message ? response.data.message : 'Error deleting store!';
                    setToastFailure(errorMessage);
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Store Successfully deleted!');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log('Error Details:', error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
                setDoingActions(false)
            });
    }

    function saveNewTenant() {
        if (context.selectedRetailerIsTenant) {
            axios.post(`/api/retailers/insertTenant`, { retailer_id: newTenantId, description: newTenantDescription, parentRemsServerId: context.selectedRetailerParentRemsServerId })
                .then(function (response) {
                    if (response.status !== 200) {
                        setToastFailure('Error Saving New Tenant!!');
                        setOpenFailure(true);
                    } else {
                        setToastSuccess('Tenant created!')
                        setOpenSuccess(true)
                        handleNewTenantDialogClosed()
                        setTimeout(function () {
                            window.location.reload(true);
                        }, SuccessToastDuration);
                    }
                })
                .catch(function (error) {
                    if (error.response.status === 409) {
                        setToastFailure('Tenant with this info already exists!')
                        setOpenFailure(true)
                    } else {
                        setToastFailure('Error connecting to server!!' + error);
                        setOpenFailure(true);
                    }
                });
        } else {
            axios.post(`/api/retailers/insertTenant`, { retailer_id: newTenantId, description: newTenantDescription, parentRemsServerId: context.selectedRetailer })
                .then(function (response) {
                    if (response.status !== 200) {
                        setToastFailure('Error Saving New Tenant!!');
                        setOpenFailure(true);
                    } else {
                        setToastSuccess('Tenant created!')
                        setOpenSuccess(true)
                        handleNewTenantDialogClosed()
                        setTimeout(function () {
                            window.location.reload(true);
                        }, SuccessToastDuration);
                    }
                })
                .catch(function (error) {
                    if (error.response.status === 409) {
                        setToastFailure('Tenant with this info already exists!')
                        setOpenFailure(true)
                    } else {
                        setToastFailure('Error connecting to server!!' + error);
                        setOpenFailure(true);
                    }
                });
        }
    }

    function deleteTenant(tenant) {
        setDoingActions(true)
        axios.delete(`/api/retailers/deleteTenant?tenantRetailerId=${tenant}`).then(function (response) {
            if (response.status === 202) {
                setToastSuccess('Tenant deletion was successful');
                setOpenSuccess(true);
                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            } else {
                let errorMessage = 'Tenant deletion error: ' + response.statusText
                setToastFailure(errorMessage)
                setOpenFailure(true)
                setDoingActions(false)
            }

        })
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
                </Box>
            </GridToolbarContainer>
        );
    }

    const onFileChange = (event) => {
        const inputFile = event.target.files[0];
        if (inputFile) {
            const fileExtension = inputFile?.type.split('/')[1];

            if (!allowedExtensions.includes(fileExtension)) {
                alert('Bulk upload only accepts a CSV file');
                return;
            }

            setFileToUpload(inputFile);
            setFileName(inputFile.name);
        }
    };
    const handleDownload = () => {
        const csvContent = `store,tenant
    store1,tenant1
    store2,tenant1
    store3,tenant2`;

        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a temporary download link
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'sample-tenant-import.csv');
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up the temporary link
        link.parentNode.removeChild(link);
    };

    const handleBulkSubmission = (event) => {
        event.preventDefault();
        let validTenants = _.map(remsInfo.tenants, x => x.retailer_id)
        let validStores = _.map(remsStoreInfo, x => x.storeName)

        // check validity of all rows against tenants/stores for REMS server
        let invalidData = []
        let isValid = true
        uploadedRows.forEach(row => {
            if (!_.includes(validTenants, row.tenant.trim())) {
                isValid = false
                invalidData.push(row)
            }

            if (!_.includes(validStores, row.store.trim())) {
                isValid = false
                invalidData.push(row)
            }
        });

        if (!isValid) {
            setToastFailure('An error occured, please check your CSV file for incorrect Tenant ID or store names.')
            setOpenFailure(true);
        } else {
            axios.post('/api/stores/bulkUpdateTenantAssignments', { updates: uploadedRows, rems: context.selectedRetailerParentRemsServerId })
                .then(function (response) {
                    if (response.status !== 200) {
                        setToastFailure('Error Saving Bulk Tenant Assignments!');
                        setOpenFailure(true);
                        return;
                    }

                    setToastSuccess('Bulk Store Tenant Info Successfully Saved.');
                    setOpenSuccess(true);
                    setDoingActions(false)

                    setTimeout(function () {
                        window.location.reload(true);
                    }, SuccessToastDuration + 500);
                })
                .catch(function (error) {
                    console.log(error);
                    setToastFailure('Error connecting to server!!');
                    setOpenFailure(true);
                })
        }
    }

    const onFileUpload = () => {
        // If user clicks the 'upload file' button without a file we show a error
        if (!fileToUpload) return alert('Enter a valid file')

        const fileExtension = fileToUpload?.type.split('/')[1];

        // Initialize a reader which allows user to read any file or blob.
        const reader = new FileReader();

        // Event listener on reader when the file loads, we parse it and set the data.
        let storeList = [];
        let id = 0
        if (fileExtension === 'csv') {
            reader.onload = async ({ target }) => {
                Papa.parse(target.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) {
                        results.data.forEach(x => {
                            let key, keys = Object.keys(x)
                            let n = keys.length
                            let newObj = {}
                            while (n--) {
                                key = keys[n];
                                newObj[key.toLowerCase()] = x[key].trim()
                            }
                            storeList.push(newObj)
                        });
                        let finalAlert = ''
                        if (finalAlert !== '') {
                            alert(finalAlert)
                        }
                    },
                });
                if (storeList.length > 0) {
                    storeList.forEach(listItem => {
                        listItem.id = id
                        id += 1
                    });
                    setUploadedRows(storeList)
                }
            };
        } else {
            alert('Invalid file type!')
            return
        }

        reader.readAsText(fileToUpload);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
                <Typography variant='h3' sx={{ padding: 2 }}>
                    {remsInfo?.description} - {remsInfo?.retailer_id}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6">
                        Bulk Association
                    </Typography>
                    <Switch checked={bulkUpload} onChange={() => { setBulkUpload(!bulkUpload) }} color="success" />
                </Box>
                {!bulkUpload &&
                    <Button variant='contained' disabled={doingActions} onClick={() => { setNewTenantDialogOpen(!newTenantDialogOpen) }}>Add Tenant +</Button>
                }
            </Box>
            {bulkUpload &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <label htmlFor="contained-button-file">
                            <Input
                                accept="*"
                                id="contained-button-file"
                                multiple
                                type="file"
                                onChange={onFileChange}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                component="span"
                                endIcon={<FindInPageIcon />}
                                sx={{ width: 250, height: '100%', marginRight: 1 }}
                            >
                                Choose CSV To Upload
                            </Button>
                        </label>
                        <TextField sx={{ height: '100%' }} disabled label="File Name" value={fileName} />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={fileToUpload == null}
                            onClick={onFileUpload}
                            endIcon={<CloudUploadIcon />}
                            sx={{ width: 175, marginLeft: 1 }}
                        >
                            Upload File
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginLeft: 1 }}
                            onClick={handleDownload}>
                            Download sample csv file
                        </Button>
                    </Box>
                    {uploadedRows.length > 0 &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, height: '73vh' }}>
                            <DataGrid
                                columns={uploadColumns}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                rows={uploadedRows}
                                pageSizeOptions={[5, 10, 15]} />
                            <Button sx={{ maxWidth: 200, justifySelf: 'center', alignSelf: 'center', margin: 1 }} variant="contained" onClick={handleBulkSubmission}>Submit</Button>
                        </Box>
                    }
                </Box>
            }
            {!bulkUpload &&
                remsInfo?.tenants?.length > 0 &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                    <Typography variant='h5'>Tenants</Typography>
                    <DataGrid
                        slots={{ toolbar: CustomToolbar }}
                        loading={loadingTenants}
                        rowHeight={40}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        rows={remsInfo.tenants ?? []}
                        columns={tenantColumns}
                        pageSizeOptions={[5, 10, 15]}
                        checkboxSelection={false}
                        rowSelection={false}
                        sx={{ width: '100%', margin: 1 }}
                    />
                </Box>
            }
            {!bulkUpload &&
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
                    <Typography variant='h5'>REMS Server Stores</Typography>
                    <StyledDataGrid
                        slots={{ toolbar: CustomToolbar }}
                        loading={loadingStores}
                        rowHeight={60}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                            sorting: {
                                sortModel: [{ field: 'tenant_id', sort: 'asc' }]
                            }
                        }}
                        rows={remsStoreInfo ?? []}
                        columns={storeColumns}
                        pageSizeOptions={[5, 10, 15]}
                        checkboxSelection={false}
                        rowSelection={false}
                        sx={{ width: '100%', margin: 1, minHeight: 200 }}
                        getRowClassName={(row) => {
                            let hasTenant = true
                            if (context.selectedRetailerIsTenant === true) {
                                hasTenant = row.row.tenant_id !== null && row.row.tenant_id !== '' && row.row.tenant_id !== undefined
                            }
                            return !hasTenant ? 'super-app-theme--noTenant' : 'super-app-theme--tenant';
                        }}
                    />
                </Box>
            }
            <Dialog open={newTenantDialogOpen} onClose={handleNewTenantDialogClosed}>
                <DialogTitle>Create New Tenant</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 400 }}>
                        <Grid >
                            <TextField
                                required
                                type='text'
                                margin="dense"
                                label='Tenant ID'
                                fullWidth
                                variant='standard'
                                value={newTenantId}
                                onChange={(event) => {
                                    setNewTenantId(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid >
                            <TextField
                                required
                                margin="dense"
                                label='Tenant Description'
                                fullWidth
                                variant='standard'
                                value={newTenantDescription}
                                onChange={(event) => {
                                    setNewTenantDescription(event.target.value);
                                }}
                            />
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewTenantDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveNewTenant} variant='contained'>Add</Button>
                </DialogActions>
            </Dialog>
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
        </Box >
    )
}
