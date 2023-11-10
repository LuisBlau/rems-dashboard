/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Alert, AlertTitle, Button, Paper, Snackbar, SnackbarContent, Tab, Tabs } from '@mui/material';
import UserContext from '../../pages/UserContext'
import _ from 'lodash';
import Copyright from '../../components/Copyright';
import moment from 'moment';

const PREFIX = 'versionOverview';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const SuccessToastDuration = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const FailToastDuration = 10000;

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .super-app-theme--deadContainer': {
        backgroundColor: getBackgroundColor('red'),
        '&:hover': {
            background: "#ff5252"
        }
    },
}));

const getBackgroundColor = (color) =>
    color === 'red' ? '#E7431F' : '#FFFFFF';

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
    },
}));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Container className={classes.container}>
                    {children}
                </Container>
            )}
        </div>
    );
}

export default function versionOverview() {
    const [allAgents, setAllAgents] = useState([])
    const [agents, setAgents] = useState([]);
    const [rem, setRem] = useState([])
    const [open, setOpen] = useState(false);
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)
    const [containers, setContainers] = useState([])
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);

    const handleChangeTab = (event, newValue) => {
        if (newValue === 1) {
            const newAgents = _.filter(allAgents, x => x.CHEC !== undefined)
            setAgents(newAgents)
        } else {
            setAgents(allAgents)
        }
        setSelectedTab(newValue);
    };

    function cleanUpContainers() {
        axios.delete('/api/bus-monitor/cleanUpOldContainers')
            .then(function (response) {
                if (response.status !== 200) {
                    const errorMessage = response?.data?.message ? response.data.message : 'Error deleting dead containers!';
                    setToastFailure(errorMessage);
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Dead Containers Successfully deleted!');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log('Error Details:', error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    }

    const pasVersionRenderer = (value) => {
        const installPas = (e) => {
            axios.get("/api/registers/installPas?store=" + value.row.storeName + "&agent=" + value.row.agentName + "&retailer_id=" + value.row.retailer_id).then((e) => setOpen(true))
        }
        if (!value.value && userIsAdmin && value.row.os === 'Windows') {
            return <Button onClick={installPas} variant="contained">Install PAS</Button>
        }
        return <p>{value.value}</p>
    }
    const remsColumns = [
        { field: 'storeName', headerName: 'Store', sortable: true, flex: 1 },
        { field: 'agentName', headerName: 'Agent', sortable: true, flex: 1 },
        { field: 'rma', headerName: 'RMA version', sortable: true, flex: 1 },
        { field: 'pas', headerName: 'PAS extension', sortable: true, flex: 1, renderCell: pasVersionRenderer }
    ];

    const checColumns = [
        { field: 'storeName', headerName: 'Store', sortable: true, flex: 1 },
        { field: 'agentName', headerName: 'Agent', sortable: true, flex: 1 },
        { field: 'rma', headerName: 'RMA version', sortable: true, flex: 1 },
        { field: 'SIGUI', headerName: 'SI GUI Version', sortable: true, flex: 1 },
        { field: 'CHEC', headerName: 'CHEC Version', sortable: true, flex: 1 },
        { field: 'JavaPOS', headerName: 'Java POS Version', sortable: true, flex: 1 }
    ];

    const dockerColumns = [
        { field: 'hostName', headerName: 'Host Name', sortable: true, flex: 2 },
        { field: 'os', headerName: 'OS', sortable: true, flex: 1 },
        { field: 'host_server', headerName: 'Host Server', sortable: true, flex: 1 },
        { field: 'storeCount', headerName: 'Store Count', sortable: true, flex: 1 },
        { field: 'storeErrorCount', headerName: 'Store Errors', sortable: true, flex: 1 },
        { field: 'agentCount', headerName: 'Agent Count', sortable: true, flex: 1 },
        { field: 'agentErrorCount', headerName: 'Agent Errors', sortable: true, flex: 1 },
        { field: 'version', headerName: 'Version', sortable: true, flex: 1 },
        {
            field: 'LastUpdatedSec',
            headerName: 'Last Update',
            sortable: true,
            flex: 1,
            renderCell: (params) => params.row.LastUpdatedSec ? moment(params.row.LastUpdatedSec).fromNow() : 'N/A',
            valueGetter: (params) => { return params.row.LastUpdatedSec }
        }
    ];

    const headerColumns = [
        { field: 'remsId', headerName: 'REMS Id', sortable: true, flex: 2 },
        { field: 'remsVersion', headerName: 'REMS Version', sortable: true, flex: 1 },
        { field: 'pasKarVersion', headerName: 'PAS Kar Version', sortable: true, flex: 1 },
        { field: 'cfVersion', headerName: 'CF Version', sortable: true, flex: 1 },
        { field: 'lastUpdated', headerName: 'Last Updated', sortable: true, flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return <Button variant='contained' onClick={() => handleDelete(params.row.id)}>Delete</Button>;
            },
        },
    ];

    useEffect(() => {
        if (context) {
            setSelectedRetailer(context.selectedRetailer)
            if (context.userRoles.length > 0) {
                if (_.includes(context.userRoles, 'toshibaAdmin') || _.includes(context.userRoles, 'Administrator')) {
                    setUserIsAdmin(true)
                }
            }
        }
    }, [context])

    useEffect(() => {
        axios.get('/api/bus-monitor/getAll').then((x) => {
            x.data.forEach(container => {
                container.id = container._id
            });
            setContainers(x.data)
        })
    }, [])

    useEffect(() => {
        if (context.selectedRetailerIsTenant !== null) {
            if (context.selectedRetailerIsTenant === false) {
                if (selectedRetailer && selectedRetailer !== '') {
                    let url = `/api/REMS/versionsData?retailer_id=${selectedRetailer}`;
                    axios.get(url).then((x) => {
                        setRem(x.data.rem);
                        setAgents(x.data.agents.map((agent) => ({
                            ...agent,
                            id: agent._id
                        })));
                        setAllAgents(x.data.agents.map((agent) => ({
                            ...agent,
                            id: agent._id
                        })));
                    });
                }
            } else {
                if (context.selectedRetailerParentRemsServerId) {
                    if (selectedRetailer && selectedRetailer !== '') {
                        let url = `/api/REMS/versionsData?retailer_id=${context.selectedRetailerParentRemsServerId}&tenant_id=${selectedRetailer}`;
                        axios.get(url).then((x) => {
                            setRem(
                                x.data.rem.map((rems) => ({
                                    ...rems,
                                    id: rems._id
                                }))
                            );
                            setAgents(
                                x.data.agents.map((agent) => ({
                                    ...agent,
                                    id: agent._id
                                }))
                            );
                            setAllAgents(
                                x.data.agents.map((agent) => ({
                                    ...agent,
                                    id: agent._id
                                }))
                            );
                        });
                    }
                }
            }
        }
    }, [selectedRetailer, context.selectedRetailerParentRemsServerId]);

    const remsRows = rem
        ? rem.map((singleRem) => {
            let lastUpdate = 'Not Available';
            let lastUpdateUnix = null;
            if ('last_heartbeat_sec' in singleRem && singleRem.last_heartbeat_sec != null) {
                lastUpdate = moment.unix(singleRem.last_heartbeat_sec).fromNow();
                lastUpdateUnix = singleRem.last_heartbeat_sec;
            }
            return {
                id: singleRem._id,
                remsId: singleRem.remsId ?? 'Not Available',
                remsVersion: singleRem.rems_version ?? 'Not Available',
                lastUpdated: lastUpdate ?? 'Not Available',
                lastUpdateUnix: lastUpdateUnix,
                pasKarVersion: `${singleRem.pas_version}_${singleRem.build_number}`,
                cfVersion: singleRem.cloudforwarder_version ?? 'Not Available',
            };
        })
        : [];

    remsRows.sort((a, b) => {
        if (b.lastUpdateUnix && a.lastUpdateUnix) {
            return b.lastUpdateUnix - a.lastUpdateUnix;
        } else if (b.lastUpdateUnix) {
            return -1;
        } else {
            return 1;
        }
    });

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
                </Box>
            </GridToolbarContainer>
        );
    }

    function CustomDockerToolbar() {
        return (
            <GridToolbarContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
                    <Button onClick={cleanUpContainers} sx={{ marginLeft: 2 }}>Clean Up</Button>
                </Box>
            </GridToolbarContainer>
        );
    }

    const handleDelete = async (_id) => {
        axios
            .delete(`/api/REMS/deleteRemsDoc?_id=${_id}`)
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure('Error Deleting Rems Info!');
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Rems Info Successfully Deleted.');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };

    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                Versions Overview
            </Typography>
            <Tabs value={selectedTab} onChange={handleChangeTab} centered>
                <Tab label="REMS" {...a11yProps(0)} />
                <Tab label="CHEC" {...a11yProps(1)} />
                <Tab label="AGENTS" {...a11yProps(2)} />
                {context.userRoles.includes('toshibaAdmin') &&
                    <Tab label="Docker" {...a11yProps(3)} />
                }
            </Tabs>
            <TabPanel value={selectedTab} index={2}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 1,
                        height: 600,
                        width: '100%',
                    }}
                >
                    <DataGrid
                        slots={{ toolbar: CustomToolbar }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        rows={agents}
                        columns={remsColumns}
                        pageSizeOptions={[5, 10, 15]}
                    />
                </Box>
                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={() => setOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <SnackbarContent
                        message={"Sent install request"}
                        style={{ backgroundColor: '#5BA52E' }}
                    />
                </Snackbar>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 1,
                        height: 600,
                        width: '100%',
                    }}
                >
                    <DataGrid
                        slots={{ toolbar: CustomToolbar }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        rows={agents}
                        columns={checColumns}
                        pageSizeOptions={[5, 10, 15]}
                    />
                </Box>
                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={() => setOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <SnackbarContent message={'Sent install request'} style={{ backgroundColor: '#5BA52E' }} />
                </Snackbar>
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, height: 600, width: '100%' }}>
                    <StyledDataGrid
                        slots={{ toolbar: CustomDockerToolbar }}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        rows={containers}
                        columns={dockerColumns}
                        pageSizeOptions={[5, 10, 15]}
                        getRowClassName={(row) => {
                            let oldData = false
                            if (moment(row.row.LastUpdatedSec).diff(Date.now(), 'days') < -7 || row.row.LastUpdatedSec === undefined) {
                                oldData = true
                            }
                            return !oldData ? 'super-app-theme--good' : 'super-app-theme--deadContainer';
                        }}
                    />
                </Box>
            </TabPanel>
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
            <TabPanel value={selectedTab} index={0}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 1,
                        height: 600,
                        width: '100%',
                    }}
                >
                    <StyledDataGrid rows={remsRows} columns={headerColumns} pageSizeOptions={[5, 10, 15]} pageSize={10}
                        getRowClassName={(row) => {
                            let oldData = false
                            if (moment(row.row.lastUpdateUnix).diff(Date.now(), 'hours') > -1 || row.row.lastUpdateUnix === null) {
                                oldData = true
                            }
                            return !oldData ? 'super-app-theme--good' : 'super-app-theme--deadContainer';
                        }} />
                </Box>
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
            </TabPanel>
            <Copyright />
        </Root>
    );
}
