/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogTitle,
    Paper,
    Switch,
    Typography,
    Link as MatUILink,
    DialogContent,
    ListItem,
    Divider,
    LinearProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ErrorImage from '../public/images/error.png';
import ProcessingMetricsImage from '../public/images/processing-metrics.png';
import ContainerImage from '../public/images/container.png';
import EleraImage from '../public/images/elera.png';
import TicketsImage from '../public/images/tickets.png';
import Image from 'next/image';
import axios from 'axios';
import 'react-spinner-animated/dist/index.css';
import DumpGrid from '../components/Tables/DumpGrid';
import ExtractGrid from '../components/Tables/ExtractGrid';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Link from 'next/link';
import _ from 'lodash';
import AgentDetailsRegion from '../components/StoreOverview/AgentDetailsRegion';
import Copyright from '../components/Copyright';
import UserContext from './UserContext';

const PREFIX = 'storeOverview';

const classes = {
    content: `${PREFIX}-content`,
};

const Root = styled('main')(() => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
}));

function PerformanceButtonsRegion({ userIsToshibaAdmin, params }) {
    const serviceNowTicketsUrl =
        'https://toshibatagstest.service-now.com/now/nav/ui/classic/params/target/incident_list.do%3Fsysparm_query%3Dactive%253Dtrue%255Eu_store.nameSTARTSWITH' +
        params.get('storeName') +
        '%26sysparm_first_row%3D1%26sysparm_view%3D%2Cembed%3DT';

    if (userIsToshibaAdmin) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    padding: 3,
                }}
            >
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography fontSize={25}>Performance</Typography>
                </Box>
                <Card sx={{ display: 'flex', flexGrow: 1, margin: .5 }} elevation={10}>
                    <Link href="/needsRehoming/serviceTrace">
                        <CardActionArea sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                                sx={{
                                    justifySelf: 'flex-start',
                                    alignSelf: 'center',
                                    marginLeft: 1,
                                    height: 40,
                                    width: 40,
                                }}
                            >
                                <Image style={{ maxWidth: 40, maxHeight: 40 }} src={ErrorImage} alt="Error Image" />
                            </CardMedia>
                            <CardContent >
                                <Typography>
                                    Transaction Tracing
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>
                <Card sx={{ display: 'flex', flexGrow: 1, margin: .5 }} elevation={10}>
                    <Link href="/needsRehoming/systemPerformance">
                        <CardActionArea sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                                sx={{
                                    justifySelf: 'flex-start',
                                    alignSelf: 'center',
                                    marginLeft: 1,
                                    height: 40,
                                    width: 40,
                                }}
                            >
                                <Image style={{ maxWidth: 40, maxHeight: 40 }} src={ProcessingMetricsImage} alt="Processing Metrics Image" />
                            </CardMedia>
                            <CardContent >
                                <Typography>
                                    Store Performance
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>
                <Card sx={{ display: 'flex', flexGrow: 1, margin: .5 }} elevation={10}>
                    <Link href="needsRehoming/dockerStats">
                        <CardActionArea sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                                sx={{
                                    justifySelf: 'flex-start',
                                    alignSelf: 'center',
                                    marginLeft: 1,
                                    height: 40,
                                    width: 40,
                                }}
                            >
                                <Image style={{ maxWidth: 40, maxHeight: 40 }} src={ContainerImage} alt="Container Image" />
                            </CardMedia>
                            <CardContent >
                                <Typography>
                                    Cloud Infrastructure
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>
                <Card sx={{ display: 'flex', flexGrow: 1, margin: .5 }} elevation={10}>
                    <Link href="needsRehoming/eleraStats">
                        <CardActionArea sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                                sx={{
                                    justifySelf: 'flex-start',
                                    alignSelf: 'center',
                                    marginLeft: 1,
                                    height: 40,
                                    width: 40,
                                }}
                            >
                                <Image style={{ maxWidth: 40, maxHeight: 40 }} src={EleraImage} alt="Elera Image" />
                            </CardMedia>
                            <CardContent >
                                <Typography>
                                    ELERA Dashboard
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>
                <Card sx={{ display: 'flex', flexGrow: 1, margin: .5 }} elevation={10}>
                    <MatUILink target={'_blank'} href={serviceNowTicketsUrl}>
                        <CardActionArea sx={{ display: 'flex', height: '100%' }}>
                            <CardMedia
                                sx={{
                                    justifySelf: 'flex-start',
                                    alignSelf: 'center',
                                    marginLeft: 1,
                                    height: 40,
                                    width: 40,
                                }}
                            >
                                <Image style={{ maxWidth: 40, maxHeight: 40 }} src={TicketsImage} alt="Tickets Image" />
                            </CardMedia>
                            <CardContent >
                                <Typography>
                                    ServiceNow Tickets
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </MatUILink>
                </Card>
            </Box>
        )
    } else {
        return null
    }
}

export default function StoreOverview() {
    const userContext = useContext(UserContext);
    const [screenshotView, setScreenshotView] = useState(false);
    const [storeAlerts, setStoreAlerts] = useState([]);
    const [storeAlertDescriptions, setStoreAlertDescriptions] = useState([]);
    const [storeAgents, setStoreAgents] = useState([]);
    const [agentCount, setAgentCount] = useState([]);
    const [alertsConfirmationOpen, setAlertsConfirmationOpen] = useState(false);
    const [scoCount, setScoCount] = useState(0);
    const [downAgentCount, setDownAgentCount] = useState(0);
    const [selectedTab, setSelectedTab] = useState('dumps');
    const [userIsToshibaAdmin, setUserIsToshibaAdmin] = useState(false);
    const [screenShotEnable, setScreenShotEnable] = useState(false);
    const [userHasAccess, setUserHasAccess] = useState(true)

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    let par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const params = new URLSearchParams(par);
    const handleAlertsConfirmationClose = () => {
        setAlertsConfirmationOpen(false);
    };
    const handleAlertsConfirmationOpen = () => setAlertsConfirmationOpen(true);

    const context = useContext(UserContext)

    function handleScreenshotViewChange() {
        setScreenshotView(!screenshotView);
    }
    useEffect(() => {
        if (context) {
            if (context.userRoles.includes('toshibaAdmin')) {
                setUserIsToshibaAdmin(true)
            }
        }

        const fetchStoreInfo = async () => {
            async function getStoreAgents() {
                // TODO: We should probably do some authentication in the back-end and not let people through here without proper assignments...
                // for now, I'll do this: 
                let userHasRetailer = true
                if (context.userRetailers !== 'All') {
                    context.userRetailers.forEach(retailer => {
                        if (params.get('retailer_id') !== context.selectedRetailer) {
                            userHasRetailer = false
                            setUserHasAccess(false)
                        }
                    });
                }
                if (userHasRetailer) {
                    await axios.get(`/api/REMS/agentsForStore?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}`).then((resp) => {
                        let scoCounter = 0;
                        let downCounter = 0;
                        const controllers = [];
                        const agents = [];
                        if (resp.data) {
                            const response = resp.data;
                            response.forEach((agent) => {
                                if (_.includes(agent.agentName, 'CP') || _.includes(agent.agentName, 'PC')) {
                                    controllers.push(agent);
                                } else {
                                    agents.push(agent);
                                }
                                if (agent.isSCO === true) {
                                    scoCounter++;
                                }
                                if (agent.online === false) {
                                    downCounter++;
                                }
                            });
                            setStoreAgents(_.concat(controllers, agents));
                            setAgentCount(agents.length);
                            setScoCount(scoCounter);
                            setDownAgentCount(downCounter);
                        }
                    });
                }
            }

            if (storeAlerts.length === 0) {
                await getStoreAgents();
            }
        };
        fetchStoreInfo();

        const fetchAlerts = async () => {
            async function getStoreAlerts() {
                await axios.get(`/api/REMS/stores/alerts?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}`).then((resp) => {
                    if (resp.data) {
                        const alerts = [];
                        const response = resp.data;
                        response.forEach((alert) => {
                            alerts.push(alert);
                        });
                        const descriptions = [];
                        alerts.forEach((alert) => {
                            descriptions.push(alert.description);
                        });
                        setStoreAlertDescriptions(descriptions);
                        setStoreAlerts(alerts);
                    }
                });
            }
            if (storeAlerts.length === 0) {
                await getStoreAlerts();
            }
        };
        fetchAlerts();
        setSelectedTab('dumps');
    }, []);

    useEffect(() => {
        if (storeAgents?.length > 0) {
            storeAgents.forEach(element => {
                _.entries(element.status).forEach(entry => {
                    if (_.includes(entry, 'AgentActions')) {
                        if (entry[1].screenshotsEnabled === 'true') {
                            setScreenShotEnable(true)
                        }
                    }
                });
            });
        }

    }, [storeAgents])

    if (userHasAccess) {
        return (
            <Root className={classes.content}>
                <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', background: '#f6f6f6' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            height: '15%',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            mb: 3,
                            background: '#f6f6f6',
                        }}
                    >
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                height: '90%',
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                Store
                            </Typography>
                            <Typography fontSize={'125%'}>{params.get('storeName')}</Typography>
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                height: '90%',
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                Lane View
                            </Typography>
                            <Switch checked={screenshotView} onChange={handleScreenshotViewChange} disabled={!screenShotEnable} color="success" />
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                height: '90%',
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                Lanes
                            </Typography>
                            <Typography fontSize={'125%'}>{agentCount}</Typography>
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                height: '90%',
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                SCO&apos;s
                            </Typography>
                            <Typography fontSize={'125%'}>{scoCount}</Typography>
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                height: '90%',
                                width: '12%',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography variant='h6' sx={{ marginBottom: 1, alignSelf: 'center' }}>{'Store Health'}</Typography>
                            <LinearProgress title="Store Health" color='info' sx={{ marginLeft: 2, marginRight: 2, borderRadius: 1, height: 10 }} variant="determinate" value={((storeAgents.length - downAgentCount) / storeAgents.length) * 100} />
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                margin: 5,
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                Alerts
                            </Typography>
                            <div onClick={handleAlertsConfirmationOpen} style={{ display: 'flex', flexDirection: 'row' }}>
                                <NotificationsIcon fontSize="large" />
                                <Typography fontSize={'150%'} fontWeight={'bold'}>
                                    {storeAlerts.length}
                                </Typography>
                            </div>
                        </Paper>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', height: '50%' }}>
                        <AgentDetailsRegion storeAgents={storeAgents} screenshotView={screenshotView} />
                        <PerformanceButtonsRegion userIsToshibaAdmin={userIsToshibaAdmin} params={params} />
                    </Box>
                    <Box sx={{ height: '23%', width: '100%' }}>
                        <TabContext value={selectedTab} sx={{ background: '#f6f6f6' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', background: '#f6f6f6' }}>
                                <TabList onChange={handleTabChange}>
                                    <Tab label="dumps" value="dumps" />
                                    <Tab label="extracts" value="extracts" />
                                </TabList>
                            </Box>
                            <TabPanel sx={{ height: '100%' }} value="dumps" style={{ background: '#f6f6f6' }}>
                                <DumpGrid store={{ storeName: params.get('storeName'), retailerId: params.get('retailer_id') }} height={'100%'} />
                            </TabPanel>
                            <TabPanel sx={{ height: '100%' }} value="extracts" style={{ background: '#f6f6f6' }}>
                                <ExtractGrid store={{ store: params.get('storeName'), retailer: params.get('retailer_id') }} height={'100%'} />
                            </TabPanel>
                        </TabContext>
                        <Box pt={1} pb={1}>
                            <Copyright />
                        </Box>
                    </Box>
                </Box>
                <Dialog
                    open={alertsConfirmationOpen}
                    onClose={handleAlertsConfirmationClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle fontSize={24} fontWeight={'bold'} id="alert-dialog-title">
                        Alerts
                    </DialogTitle>
                    <DialogContent sx={{ padding: 3 }}>
                        {storeAlertDescriptions.map((alert, index) => {
                            return (
                                <div key={index}>
                                    <ListItem dense>
                                        <NotificationsIcon sx={{ marginRight: 2 }} />
                                        <Typography fontWeight={400} sx={{ color: '#000000' }}>
                                            {alert}
                                        </Typography>
                                    </ListItem>
                                    <Divider />
                                </div>
                            );
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleAlertsConfirmationClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Root>
        );
    } else {
        return (
            <Box sx={{ display: 'flex', height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h2'>You don't have access to this retailer's information.</Typography>
            </Box>
        )
    }

}

function customizeText({ valueText }) {
    return `${valueText}%`;
}
