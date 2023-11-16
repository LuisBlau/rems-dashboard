/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Paper,
    Switch,
    Typography,
    LinearProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import 'react-spinner-animated/dist/index.css';
import DumpGrid from '../components/Tables/DumpGrid';
import ExtractGrid from '../components/Tables/ExtractGrid';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import _ from 'lodash';
import AgentDetailsRegion from '../components/StoreOverview/AgentDetailsRegion';
import Copyright from '../components/Copyright';
import UserContext from './UserContext';
import EleraInfoRegion from '../components/StoreOverview/EleraInfoRegion';
import moment from 'moment';
import Alerts from '../components/EnterpriseOverview/StoreAlerts';

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

export default function StoreOverview() {
    const [screenshotView, setScreenshotView] = useState(false);
    const [storeAlerts, setStoreAlerts] = useState([]);
    const [storeAlertDescriptions, setStoreAlertDescriptions] = useState([]);
    const [storeAgents, setStoreAgents] = useState([]);
    const [storeHasNoAgents, setStoreHasNoAgents] = useState(null)
    const [agentCount, setAgentCount] = useState([]);
    const [alertsConfirmationOpen, setAlertsConfirmationOpen] = useState(false);
    const [scoCount, setScoCount] = useState(0);
    const [downAgentCount, setDownAgentCount] = useState(0);
    const [selectedTab, setSelectedTab] = useState('dumps');
    const [screenShotEnable, setScreenShotEnable] = useState(false);
    const [userHasAccess, setUserHasAccess] = useState(true)
    const [elera, setElera] = useState({});
    const [headerPaperColor, setHeaderPaperColor] = useState('#FFFFFF')
    const handleAlertsConfirmationOpen = () => setAlertsConfirmationOpen(true);
    const context = useContext(UserContext)

    const eleraContainers = ["elera-pay-iss-platform", "elera-nginx", "elera-admin-ui", "elera-client", "elera-platform", "elera-data-loader", "tgcp_platform_nginx", "tgcp_platform", "tgcp_mongo", "tgcp_admin-ui", "tgcp_tcui", "tgcp_rabbitmq"]

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


    function handleScreenshotViewChange() {
        setScreenshotView(!screenshotView);
    }

    useEffect(() => {
        if (context?.selectedRetailer) {
            let time = 24
            axios.get(`/api/retailers/getConfiguration?isAdmin=true&retailerId=${context.selectedRetailer}`).then(function (res) {
                const configurationArray = res.data.configuration;
                const configurationInfo = [];
                configurationArray.forEach(configObject => {
                    const innerArray = Object.values(configObject)[0];
                    configurationInfo.push(innerArray);
                });

                time = configurationInfo.find(item => item.configName === 'storeDisconnectTimeLimit').configValue;
            }).then(() => {
                axios.get('/api/stores/info?retailerId=' + params.get('retailer_id') + '&storeName=' + params.get('storeName')).then((result) => {
                    if (moment(result.data[0].last_updated_sec * 1000).diff(Date.now(), 'hours') < - time) {
                        setHeaderPaperColor('#E7431F')
                    }
                })
            })
        }
    }, [context?.selectedRetailer])

    useEffect(() => {
        if (context) {
            if (context.userRetailers) {
                if (context.userRetailers.length > 0) {
                    const fetchStoreInfo = () => {
                        function getStoreAgents() {
                            // TODO: We should probably do some authentication in the back-end and not let people through here without proper assignments...
                            // for now, I'll do this: 
                            let userHasRetailer = true
                            if (params.get('tenant_id') !== null) {
                                userHasRetailer = false
                                context.userRetailers.forEach(retailer => {
                                    if (params.get('tenant_id') === retailer.retailer_id) {
                                        userHasRetailer = true
                                    }
                                });
                                setUserHasAccess(userHasRetailer)
                                if (userHasRetailer) {
                                    axios.get(`/api/REMS/agentsForStore?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}&tenantId=${params.get('tenant_id')}`).then((resp) => {
                                        let scoCounter = 0;
                                        let downCounter = 0;
                                        const controllers = [];
                                        const agents = [];
                                        let newElera = {}
                                        if (resp.data) {
                                            const response = resp.data;
                                            response.forEach((agent) => {
                                                if (_.includes(agent.agentName, 'CP') || _.includes(agent.agentName, 'PC')) {
                                                    controllers.push(agent);
                                                } else {
                                                    agents.push(agent);
                                                }
                                                if (agent.isSco === true) {
                                                    scoCounter++;
                                                }
                                                if (agent.online === false) {
                                                    downCounter++;
                                                }
                                                if ("status" in agent && "docker" in agent["status"]) {
                                                    let container_status = {}
                                                    let workingContainers = 0
                                                    for (var containerName of eleraContainers) {
                                                        if ("Container-[/" + containerName + "]" in agent["status"]["docker"]) {
                                                            let statStr = agent["status"]["docker"]["Container-[/" + containerName + "]"]
                                                            let stat = JSON.parse(statStr)["State"]
                                                            container_status[containerName] = stat
                                                            if (stat === "running") workingContainers++
                                                        }

                                                        if (Object.keys(container_status).length > 0) {
                                                            container_status["workingContainers"] = workingContainers;
                                                            newElera[agent.agentName] = container_status
                                                        }

                                                    }
                                                }
                                            });

                                            if (controllers.length > 0 || agents.length > 0) {
                                                setStoreAgents(_.concat(controllers, agents));
                                                setStoreHasNoAgents(false)
                                            } else {
                                                setStoreHasNoAgents(true)
                                            }
                                            setAgentCount(agents.length);
                                            setScoCount(scoCounter);
                                            setDownAgentCount(downCounter);
                                            setElera(newElera);
                                        } else {
                                            console.log('no data')
                                        }
                                    });
                                }
                            } else {
                                let userHasRetailer = false
                                context.userRetailers.forEach(retailer => {
                                    if (params.get('retailer_id') === retailer.retailer_id) {
                                        userHasRetailer = true
                                    }
                                });
                                setUserHasAccess(userHasRetailer)

                                if (userHasRetailer) {
                                    axios.get(`/api/REMS/agentsForStore?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}`).then((resp) => {
                                        let scoCounter = 0;
                                        let downCounter = 0;
                                        const controllers = [];
                                        const agents = [];
                                        let newElera = {}
                                        if (resp.data.length > 0) {
                                            const response = resp.data;
                                            response.forEach((agent) => {
                                                if (_.includes(agent.agentName, 'CP') || _.includes(agent.agentName, 'PC')) {
                                                    controllers.push(agent);
                                                } else {
                                                    agents.push(agent);
                                                }
                                                if (agent.isSco === true) {
                                                    scoCounter++;
                                                }
                                                if (agent.online === false) {
                                                    downCounter++;
                                                }
                                                if ("status" in agent && "docker" in agent["status"]) {
                                                    let container_status = {}
                                                    let workingContainers = 0
                                                    for (var containerName of eleraContainers) {
                                                        if ("Container-[/" + containerName + "]" in agent["status"]["docker"]) {
                                                            let statStr = agent["status"]["docker"]["Container-[/" + containerName + "]"]
                                                            let stat = JSON.parse(statStr)["State"]
                                                            container_status[containerName] = stat
                                                            if (stat === "running") workingContainers++
                                                        }

                                                        if (Object.keys(container_status).length > 0) {
                                                            container_status["workingContainers"] = workingContainers;
                                                            newElera[agent.agentName] = container_status
                                                        }

                                                    }
                                                }
                                            });
                                            setStoreAgents(_.concat(controllers, agents));
                                            setAgentCount(agents.length);
                                            setScoCount(scoCounter);
                                            setElera(newElera);
                                            setDownAgentCount(downCounter);
                                        } else {
                                            setStoreHasNoAgents(true)
                                            setAgentCount(0)
                                            setScoCount(0)
                                            setDownAgentCount(0)
                                        }
                                    });
                                }
                            }
                        }

                        if (storeAlerts.length === 0) {
                            getStoreAgents();
                        }
                    };
                    fetchStoreInfo();

                    const fetchAlerts = async () => {
                        async function getStoreAlerts() {
                            let alertsUrl = `/api/alerts/getForStore?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}`
                            if (context.selectedRetailerIsTenant === true) {
                                alertsUrl = `/api/alerts/getForStore?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}&tenantId=${params.get('tenant_id')}`
                            }
                            await axios.get(alertsUrl).then((resp) => {
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
                }
            }
        }
    }, [context]);

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

    const updateAlerts = (updatedAlerts) => {
        setStoreAlerts(updatedAlerts);
    };

    if (userHasAccess) {
        return (
            <Root className={classes.content}>
                <Box sx={{ display: 'flex', overflow: 'auto', height: '100%', flexDirection: 'column', background: '#f6f6f6' }}>
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
                                backgroundColor: headerPaperColor
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'} >
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
                                backgroundColor: headerPaperColor
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
                                backgroundColor: headerPaperColor
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
                                backgroundColor: headerPaperColor
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
                                backgroundColor: headerPaperColor
                            }}
                            elevation={10}
                        >
                            <Typography variant='h6' sx={{ marginBottom: 1, alignSelf: 'center' }}>{'Store Health'}</Typography>
                            <LinearProgress title="Store Health" color='info' sx={{ marginLeft: 2, marginRight: 2, borderRadius: 1, height: 10 }} variant="determinate" value={headerPaperColor === '#FFFFFF' ? ((storeAgents.length - downAgentCount) / storeAgents.length) * 100 : 0} />
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                margin: 5,
                                width: '12%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: headerPaperColor
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                Alerts
                            </Typography>
                            <div onClick={handleAlertsConfirmationOpen} style={{ display: 'flex', flexDirection: 'row' }}>
                                <NotificationsIcon fontSize="large" />
                                <Typography fontSize={'150%'} fontWeight={'bold'}>
                                    {storeAlerts.filter((alert) => alert.alertAcknowledged === false).length}
                                </Typography>
                            </div>
                        </Paper>
                    </Box>
                    {Object.keys(elera).length > 0 ?
                        <Box sx={{ display: 'flex', flexDirection: 'row', height: '50%' }}>
                            <AgentDetailsRegion boxWidth={70} paperWidth={30} storeAgents={storeAgents} screenshotView={screenshotView} storeHasNoAgents={storeHasNoAgents} />
                            <EleraInfoRegion elera={elera} />
                        </Box>
                        :
                        <Box sx={{ display: 'flex', flexDirection: 'row', height: '50%' }}>
                            <AgentDetailsRegion boxWidth={100} paperWidth={20} storeAgents={storeAgents} screenshotView={screenshotView} storeHasNoAgents={storeHasNoAgents} />
                        </Box>
                    }
                    <TabContext value={selectedTab} sx={{ background: '#f6f6f6' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', background: '#f6f6f6' }}>
                            <TabList onChange={handleTabChange}>
                                <Tab label="dumps" value="dumps" />
                                <Tab label="extracts" value="extracts" />
                            </TabList>
                        </Box>
                        <TabPanel sx={{ height: '100%' }} value="dumps" style={{ background: '#f6f6f6' }}>
                            <DumpGrid store={{ storeName: params.get('storeName'), retailerId: params.get('retailer_id'), tenantId: params.get('tenant_id') }} height={'100%'} />
                        </TabPanel>
                        <TabPanel sx={{ height: '100%' }} value="extracts" style={{ background: '#f6f6f6' }}>
                            <ExtractGrid store={{ store: params.get('storeName'), retailer: params.get('retailer_id'), tenantId: params.get('tenant_id') }} height={'100%'} />
                        </TabPanel>
                    </TabContext>
                    <Box sx={{ padding: 1 }}>
                        <Copyright />
                    </Box>
                </Box>
                <Dialog
                    open={alertsConfirmationOpen}
                    onClose={handleAlertsConfirmationClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    PaperProps={{
                        style: {
                            maxWidth: '100%'
                        }
                    }}
                >
                    <DialogTitle fontSize={36} fontWeight={'bold'} id="alert-dialog-title" style={{ textAlign: 'center' }} >
                        Alerts
                    </DialogTitle>
                    <Alerts alerts={storeAlerts} updateAlerts={updateAlerts}></Alerts>
                    <DialogActions>
                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleAlertsConfirmationClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Root >
        );
    } else {
        return (
            <Box sx={{ display: 'flex', height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h2'>You don't have access to this retailer's information.</Typography>
            </Box>
        )
    }

}