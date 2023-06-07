/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper, Snackbar, SnackbarContent, Tab, Tabs } from '@mui/material';
import UserContext from '../../pages/UserContext'
import _ from 'lodash';

const PREFIX = 'versionOverview';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

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
    const [rem, setRem] = useState({});
    const [open, setOpen] = useState(false);
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [userIsAdmin, setUserIsAdmin] = useState(false)
    const [selectedTab, setSelectedTab] = useState(0)

    const handleChangeTab = (event, newValue) => {
        if (newValue === 1) {
            const newAgents = _.filter(allAgents, x => x.CHEC !== undefined)
            setAgents(newAgents)
        } else {
            setAgents(allAgents)
        }
        setSelectedTab(newValue);
    };

    const pasVersionRenderer = (value) => {
        const installPas = (e) => {
            axios.get("/api/registers/installPas?store=" + value.row.storeName + "&agent=" + value.row.agentName + "&retailer_id=" + value.row.retailer_id).then((e) => setOpen(true))
        }
        if (!value.value && userIsAdmin) {
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

    useEffect(() => {
        if (context) {
            setSelectedRetailer(context.selectedRetailer)
            if (context.userRoles.length > 0) {
                if (_.includes(context.userRoles, 'toshibaAdmin')) {
                    setUserIsAdmin(true)
                }
            }
        }
    }, [context])

    useEffect(() => {
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
    }, [selectedRetailer]);

    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                Versions Overview
            </Typography>
            <Tabs value={selectedTab} onChange={handleChangeTab} centered>
                <Tab label="REMS" {...a11yProps(0)} />
                <Tab label="CHEC" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={selectedTab} index={0}>
                <Paper elevation={5} sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Typography variant="h5" sx={{ padding: 1 }}>
                        REMS version: {rem?.rems_version}
                    </Typography>
                    <Typography variant="h5" sx={{ padding: 1 }}>
                        PAS kar version: {rem?.pas_version}_{rem?.build_number}
                    </Typography>
                    <Typography variant="h5" sx={{ padding: 1 }}>
                        CF version: {rem?.cloudforwarder_version}
                    </Typography>
                </Paper>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, height: 600, width: '100%' }}>
                    <DataGrid
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
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, height: 600, width: '100%' }}>
                    <DataGrid
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
                    <SnackbarContent
                        message={"Sent install request"}
                        style={{ backgroundColor: '#5BA52E' }}
                    />
                </Snackbar>
            </TabPanel>
        </Root>
    );
}
