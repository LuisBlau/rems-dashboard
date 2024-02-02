/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Copyright from '../../components/Copyright';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Alert, AlertTitle, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import UserContext from '../UserContext'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';

const PREFIX = 'agentdistributionLists';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
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
}));

const storeInformation = {
    id: '',
    retailer_id: '',
    list_name: '',
    agents: [],
};

export default function AgentDistributionLists() {
    // a top-level list of all retailer's agents, used to filter down and show left side available stuff
    const [availableAgents, setAvailableAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState();
    const [storeId, setStoreId] = useState("");
    const [agentId, setAgentId] = useState("");
    const [existingLists, setExistingLists] = useState([]);
    const [open, setOpen] = useState(false);
    const [openErrorSnack, setOpenErrorSnack] = useState(false);
    const [toast, setToast] = useState('No Agents Selected!');
    const [listName, setListName] = useState('');
    const context = useContext(UserContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [osType, setOsType] = useState('');
    const [registerType, setRegisterType] = useState('');
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [loading, setLoading] = useState(false);

    const osTypeList = [{ value: 'Windows', label: 'Windows' }, { value: 'Linux', label: 'Linux' }, { value: 'Sky', label: 'Sky' }]

    useEffect(() => {
        if (context.selectedRetailer) {
            setOsType('');
            setRegisterType('')
            setSearchText('')
            getAgentApiCall();
            getStoreAgentList();
        }
    }, [context.selectedRetailerIsTenant, context.selectedRetailer, context.selectedRetailerParentRemsServerId])

    function getStoreAgentList() {
        let params = {
            retailer: context?.selectedRetailer,
        };

        if (context.selectedRetailerIsTenant === true && context?.selectedRetailerParentRemsServerId) {
            // gets all agents for the selected retailer
            params = {
                retailer: context?.selectedRetailerParentRemsServerId,
                tenant: context?.selectedRetailer,
            }
        }
        axios.get(`/api/REMS/agent-list`, { params }).then((resp) => setExistingLists(resp.data));
    }

    function getAgentApiCall(pages = 0, limit = 100, osType = '', registerType = '', searchText = '') {
        let params = {
            retailer: context?.selectedRetailer,
            page: pages,
            searchText,
            osType,
            registerType,
            limit: limit
        };

        if (context.selectedRetailerIsTenant === true && context?.selectedRetailerParentRemsServerId) {
            // gets all agents for the selected retailer
            params = {
                retailer: context?.selectedRetailerParentRemsServerId,
                tenant: context?.selectedRetailer,
                page: pages,
                searchText,
                osType,
                registerType,
                limit: limit
            }
        }

        axios.get(`/api/REMS/agents`, { params }).then(function (res) {
            const data = [];
            const osType = [];
            setTotalPage(res.data.pagination.totalPage);
            setTotalItems(res.data.pagination.totalItem);
            res.data.items.forEach((item) => {
                data.push({ agent: item, agentName: item.agentName });
            });
            setAvailableAgents(data);
        });

    }

    function handleSearch() {
        getAgentApiCall(page, pageSize, osType, registerType, searchText);
    }

    function handleReset() {
        setOsType('');
        setRegisterType('');
        setSearchText('');
        setSelectedAgent('');
        setListName('');
        setTimeout(() => {
            getAgentApiCall();
        }, 800);
    }

    const handleSubmit = async () => {
        try {
            if (!listName) {
                throw new Error('Must Create a List Name or Select an Existing to Update')
            }
            storeInformation.list_name = listName;
            storeInformation.filters = {
                osType,
                registerType,
                searchText
            };

            let stringParams = `retailerId=${context.selectedRetailer}`;

            if (context.selectedRetailerIsTenant === true) {
                stringParams = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
            }

            setLoading(true);
            // Create an array of promises for the concurrent requests
            const requests = [
                axios.post(`/api/REMS/save-store-data?${stringParams}`, { ...storeInformation, id: storeId }),
                axios.post(`/api/REMS/save-agent-data?${stringParams}`, { ...storeInformation, id: agentId })
            ];

            // Wait for all the promises to resolve
            const responses = await Promise.all(requests);
            setLoading(false);

            // Handle the responses
            responses.forEach((response, index) => {
                if (response.status !== 200) {
                    setToast(`Error Saving list for request ${index + 1}!!`);
                    setOpenErrorSnack(true);
                }
            });
            setToast('Agents Distribution List Successfully Saved.');
            setOpen(true);
            setTimeout(() => {
                if (!open) {
                    window.location.reload(false);
                }
            }, 5000);
        } catch (Error) {
            setToast(Error.message);
            setOpenErrorSnack(true);
        }
    };

    const handleDelete = async () => {
        try {
            if (!selectedAgent) {
                throw new Error('List name not selected')
            }

            // Create an array of promises for the concurrent requests
            const requests = [
                axios.get(`/api/REMS/deleteExistingList?id=${storeId}`),
                axios.get(`/api/REMS/deleteAgentData?id=${agentId}`)
            ];

            // Wait for all the promises to resolve
            const responses = await Promise.all(requests);

            // Handle the responses
            responses.forEach((response, index) => {
                if (response.status !== 200) {
                    setToast(`Error deleting list for request ${index + 1}!!`);
                    setOpenErrorSnack(true);
                }
            });
            setToast('Deleted Successfully.');
            setOpen(true);
            if (!open) {
                window.location.reload(false);
            }
        } catch (Error) {
            setToast(Error.message);
            setOpenErrorSnack(true);
        }
    };

    const columns = [
        //{ field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'agentName',
            headerName: 'Agent Name',
            width: 150,
            align: 'left',
            headerAlign: 'center',
        },
    ];

    const rows = availableAgents.map((agent, index) => ({
        id: index,
        agentName: agent.agentName,
    }));


    const handleSelect = e => {
        const selectedValue = existingLists?.find(x => x.list_name == e.target.value);
        setOsType(selectedValue.filters.osType);
        setRegisterType(selectedValue.filters.registerType);
        setSearchText(selectedValue.filters.searchText);
        setStoreId(selectedValue.storeId);
        setAgentId(selectedValue._id);
        setSelectedAgent(selectedValue.list_name);
        setListName(selectedValue.list_name);
        getAgentApiCall(0, pageSize, selectedValue.filters.osType, selectedValue.filters.registerType, selectedValue.filters.searchText);
    }

    return (
        <Root className={classes.content}>
            <Typography marginTop={5} align="center" variant="h4">
                Agent Distribution Lists
            </Typography>
            {loading && <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>}
            <Grid container spacing={1} sx={{ margin: 3 }}>
                <Grid item xs={2}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="osType">OS Type</InputLabel>
                        <Select
                            id="osType"
                            value={osType}
                            labelId='osType'
                            label="Os Type"
                            onChange={(e) => setOsType(e?.target?.value)}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value={''}>None</MenuItem>
                            {osTypeList?.map((r, i) => <MenuItem key={i} value={r.value}>{r.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="registerType">Agent Type</InputLabel>
                        <Select
                            id="registerType"
                            value={registerType}
                            labelId='registerType'
                            label="Register Type"
                            onChange={(e) => setRegisterType(e?.target?.value)}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value={''}>None</MenuItem>
                            <MenuItem value={'register'}>Register</MenuItem>
                            <MenuItem value={'sco'} >SCO</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField id="outlined-basic" label="Search" variant="outlined" value={searchText} onChange={(e) => setSearchText(e?.target?.value)} />
                    </FormControl>
                </Grid>
                <Box>
                    <Button sx={{ color: 'primary', size: 'medium', margin: 1 }} onClick={handleSearch} variant="contained">
                        Apply Filter
                    </Button>
                    <Button sx={{ color: 'primary', size: 'medium', margin: 1 }} onClick={handleReset} variant="contained">
                        Reset
                    </Button>
                    {selectedAgent &&
                        <Button sx={{ backgroundColor: 'red', size: 'medium', margin: 1 }}
                            variant="contained"
                            onClick={() => setDialogOpen(true)}>
                            Delete
                        </Button>
                    }
                </Box>
            </Grid>
            <Grid container spacing={2} sx={{ margin: 2 }}>
                <Grid item xs={4}>
                    <div style={{ height: 700 }}>
                        <DataGrid
                            paginationModel={{
                                page: page,
                                pageSize: pageSize
                            }}
                            onPaginationModelChange={({ page, pageSize }) => { setPageSize(pageSize); setPage(page); getAgentApiCall(page, pageSize, osType, registerType, searchText) }}
                            rows={rows ?? []}
                            columns={columns}
                            pageSizeOptions={[10, 50, 100]}
                            checkboxSelection={false}
                            rowSelection={false}
                            paginationMode="server"
                            rowCount={totalItems}
                        />
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel sx={{ width: 200 }} id="list-label">
                            Update Existing List
                        </InputLabel>
                        <Select
                            labelId="list-label"
                            id="existing-list-selector"
                            label="Update Existing List"
                            value={selectedAgent ?? ''}
                            onChange={handleSelect}
                            input={<OutlinedInput label="Update Existing List" />}
                        >
                            {existingLists?.map((i, index) => (
                                <MenuItem key={index} value={i.list_name}>
                                    {i.list_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <FormControl sx={{ width: '100%' }}>
                        <TextField id="outlined-basic" label="List Name" variant="outlined" value={listName} onChange={(e) => setListName(e?.target?.value)} required />
                    </FormControl>
                </Grid>

                <Grid item xs={2}>
                    <Button size="medium" variant="contained" color="primary" type="button" onClick={handleSubmit}>
                        {!selectedAgent ? 'Save' : 'Update'}
                    </Button>
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openErrorSnack}
                autoHideDuration={6000}
                onClose={(event) => {
                    setOpenErrorSnack(false);
                }}
            >
                <Alert variant='filled' severity='error'>
                    <AlertTitle>Error!</AlertTitle>
                    {toast}
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={6000}
                onClose={(event) => {
                    setOpen(false);
                }}
            >
                <Alert variant='filled' severity='success'>
                    <AlertTitle>Success!</AlertTitle>
                    {toast}
                </Alert>
            </Snackbar>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                ariaLabelledBy="alert-dialog-title"
                ariaDescribedBy="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Confirm Deletion'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">This list will be deleted permanently, are you sure?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleDelete} autoFocus>Delete</Button>
                </DialogActions>
            </Dialog>
            <Box pt={4}>
                <Copyright />
            </Box>
        </Root>
    );
}
