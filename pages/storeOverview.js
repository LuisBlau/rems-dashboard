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
    Switch,
    Typography,
    Grid,
    Container,
    IconButton,
    MenuItem,
    Menu,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import 'react-spinner-animated/dist/index.css';
import _ from 'lodash';
import AgentDetailsRegion from '../components/StoreOverview/AgentDetailsRegion';
import UserContext from './UserContext';
import Alerts from '../components/EnterpriseOverview/StoreAlerts';
import { CustomLinearProgress } from '../components/LinearProgress';
import Image from 'next/image';
import EleraIcon from '../public/icons/elera-icon-red.png';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useRouter } from 'next/router';

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
    const [cameraDevices, setCameraDevices] = useState([])
    const [storeAlertDescriptions, setStoreAlertDescriptions] = useState([]);
    const [storeAgents, setStoreAgents] = useState([]);
    const [storeHasNoAgents, setStoreHasNoAgents] = useState(null)
    const [agentCount, setAgentCount] = useState([]);
    const [alertsConfirmationOpen, setAlertsConfirmationOpen] = useState(false);
    const [scoCount, setScoCount] = useState(0);
    const [downAgentCount, setDownAgentCount] = useState(0);
    const [screenShotEnable, setScreenShotEnable] = useState(false);
    const [userHasAccess, setUserHasAccess] = useState(true)
    const [elera, setElera] = useState({});
    const handleAlertsConfirmationOpen = () => setAlertsConfirmationOpen(true);
    const context = useContext(UserContext)
    const [masterAgent, setMasterAgent] = useState(null);
    const [retailerConfig, setRetailerConfig] = useState([]);

    const router = useRouter();

    const eleraContainers = ["elera-pay-iss-platform", "elera-nginx", "elera-admin-ui", "elera-client", "elera-platform", "elera-data-loader", "tgcp_platform_nginx", "tgcp_platform", "tgcp_mongo", "tgcp_admin-ui", "tgcp_tcui", "tgcp_rabbitmq"]

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
    const commonTypographyStyles = {
        fontFamily: 'Roboto',
        fontSize: '18px',
        fontWeight: 500,
        lineHeight: '21px',
        letterSpacing: '0em',
        textAlign: 'left'
    };


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
                setRetailerConfig(configurationInfo);
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
                                        let lanesCounter = 0;
                                        const controllers = [];
                                        const agents = [];
                                        let newElera = {}
                                        if (resp.data) {
                                            const response = resp.data;
                                            getMasterAgent(response);
                                            response.forEach((agent) => {
                                                if (_.includes(agent.agentName, 'ars') || _.includes(agent.agentName, 'CP') || _.includes(agent.agentName, 'PC') || agent.status?.Controller?.configured === 'true' || agent.status?.Controller?.configured === true) {
                                                    controllers.push(agent);
                                                } else {
                                                    agent.agentName.replace(agent.storeName + '-', '')
                                                    agents.push(agent);
                                                }
                                                if (agent.isSco === true) {
                                                    scoCounter++;
                                                } else if (agent.os !== 'Android' && !_.includes(agent.agentName, 'ars') && !_.includes(agent.agentName, 'CP') && !_.includes(agent.agentName, 'PC') && agent.status?.Controller?.configured !== 'true' && agent.status?.Controller?.configured !== true) {
                                                    lanesCounter++;
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
                                                setStoreAgents(_.concat(_.sortBy(controllers, ['agentName']), (agents.sort(function (a, b) {
                                                    return a.agentName.localeCompare(b.agentName, undefined, {
                                                        numeric: true,
                                                        sensitivity: 'base'
                                                    })
                                                }))));
                                                setStoreHasNoAgents(false)
                                            } else {
                                                setStoreHasNoAgents(true)
                                            }
                                            setAgentCount(lanesCounter);
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
                                            getMasterAgent(response);
                                            response.forEach((agent) => {
                                                if (_.includes(agent.agentName, 'CP') || _.includes(agent.agentName, 'PC') || agent.status?.Controller?.configured === 'true' || agent.status?.Controller?.configured === true) {
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
                                            setStoreAgents(_.concat(_.sortBy(controllers, ['agentName']), (agents.sort(function (a, b) {
                                                return a.agentName.localeCompare(b.agentName, undefined, {
                                                    numeric: true,
                                                    sensitivity: 'base'
                                                })
                                            }))));
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
                                    axios.get(`/api/REMS/cameraDevicesForStore?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}`).then((resp) => {
                                        if (resp.data.length > 0) {
                                            setCameraDevices(resp.data)
                                        } else {
                                            console.log('no cameras')
                                        }
                                    })
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

    const getMasterAgent = (agentList) => {
        const masterAgent = agentList.find(agent => agent.is_master_agent === true);
        setMasterAgent(masterAgent);
    }

    const updateAlerts = (updatedAlerts) => {
        setStoreAlerts(updatedAlerts);
    };

    if (userHasAccess) {
        const storeHealthPerc = ((storeAgents.length - downAgentCount) / storeAgents.length) * 100;
        let color = '';
        let storeHealthText = '';

        if (storeHealthPerc > 90) {
            color = '#5BA52E';
            storeHealthText = 'Good';
        } else if (storeHealthPerc > 60 && storeHealthPerc < 90) {
            color = '#F8C45d';
            storeHealthText = 'Fair';
        } else if (storeHealthPerc < 90) {
            color = '#FA8128';
            storeHealthText = 'Poor';
        } else {
            color = '#E7431F';
            storeHealthText = 'Disconnected';
        }

        return (
            <Container maxWidth="100%" sx={{ overflow: "hidden", height: '100vh' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Roboto',
                                fontSize: '36px',
                                fontWeight: 700,
                                lineHeight: '42px',
                                letterSpacing: '0em',
                                textAlign: 'left',
                                marginBottom: 'px'
                            }}     >
                            Store Overview
                        </Typography>

                        <Grid container>
                            <Grid item xs={6}>
                                <CustomLinearProgress
                                    title={params.get('storeName')}
                                    value={storeHealthPerc}

                                    sx={{ color: color, width: 200, height: 10, borderRadius: 2, marginBottom: '20px' }}
                                />
                                <Box sx={{
                                    display: 'flex',
                                    gap: 7,
                                }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ ...commonTypographyStyles }}
                                    >Health: <Box component='span' sx={{ color: color, fontWeight: 'fontWeightMedium' }}>{storeHealthText}</Box>
                                    </Typography>
                                    <Typography variant="body1"
                                        sx={{ ...commonTypographyStyles }}
                                    > Lanes: <Box component='span' fontWeight='fontWeightMedium'>
                                            {/* {storeAgents?.filter(x=> x.online === true)?.length} of */}
                                            {agentCount}</Box> </Typography>
                                    <Typography variant="body1"
                                        sx={{ ...commonTypographyStyles }}
                                    > SCOs: <Box component='span' fontWeight='fontWeightMedium'>{scoCount}</Box> </Typography>

                                </Box>
                            </Grid>
                            <Grid item xs={6} textAlign="end">
                                <Typography variant="body1" sx={{
                                    display: 'flex',
                                    alignContent: 'center',
                                    justifyContent: 'end',
                                    margin: 2,
                                    ...commonTypographyStyles,
                                    textAlign: 'right'
                                }}>
                                    Alerts :
                                    <NotificationsIcon onClick={handleAlertsConfirmationOpen} fontSize="medium" />
                                    <Box component='span' fontWeight='fontWeightMedium'>
                                        {storeAlerts.filter((alert) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            const alertDate = new Date(alert.dateTimeReceived);
                                            alertDate.setHours(0, 0, 0, 0);

                                            return alertDate.getTime() === today.getTime();
                                        }).length} {' '}
                                    </Box>
                                </Typography>
                                {screenShotEnable && (
                                    <Box>
                                        <Typography sx={{
                                            ...commonTypographyStyles,
                                            textAlign: 'right'
                                        }}>
                                            Screenshot View
                                            <Box component='span'>
                                                <Switch checked={screenshotView} onChange={handleScreenshotViewChange} disabled={!screenShotEnable} color="success" />
                                            </Box>
                                        </Typography>
                                    </Box>
                                )
                                }
                                {Object.keys(elera).length > 0 &&
                                    <Box>
                                        <PopupState variant="popover" popupId="demo-popup-menu">
                                            {(popupState) => (
                                                <Box>
                                                    <IconButton   {...bindTrigger(popupState)}>
                                                        <Image alt="Elera Services" src={EleraIcon} height={40} width={40} />
                                                    </IconButton>
                                                    <Menu sx={{ "& .MuiMenu-paper": { backgroundColor: '#383838' } }} {...bindMenu(popupState)}>
                                                        <MenuItem
                                                            onClick={() => router.push(`/store/eleraHealth?storeName=${params.get('storeName')}&retailer_id=${context.selectedRetailer}&agentName=${masterAgent}`)}
                                                            sx={{ display: 'flex', justifyContent: 'start' }}
                                                        >
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                <IconButton >
                                                                    <ShowChartRoundedIcon sx={{ color: '#FFFFFF' }} />
                                                                </IconButton>
                                                                <Typography sx={{ color: '#FFFFFF' }}>
                                                                    Elera Health
                                                                </Typography>
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => router.push(`/store/eleraStats?storeName=${params.get('storeName')}`)}
                                                            sx={{ display: 'flex', justifyContent: 'start' }}
                                                        >
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                <IconButton >
                                                                    <AssessmentIcon sx={{ color: '#FFFFFF' }} />
                                                                </IconButton>
                                                                <Typography sx={{ color: '#FFFFFF' }}>
                                                                    Elera Stats
                                                                </Typography>
                                                            </Box>
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            )}
                                        </PopupState>
                                    </Box>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{ overflow: 'auto', width: '100%', height: '80%' }}>
                    <AgentDetailsRegion cameraDevices={cameraDevices} storeAgents={storeAgents} screenshotView={screenshotView} storeHasNoAgents={storeHasNoAgents} />
                </Grid>
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
                    <Alerts alerts={storeAlerts} updateAlerts={updateAlerts} ma={masterAgent} retailerConfig={retailerConfig}></Alerts>
                    <DialogActions>
                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleAlertsConfirmationClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container >
        );
    } else {
        return (
            <Box sx={{ display: 'flex', height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h2'>You don't have access to this retailer's information.</Typography>
            </Box>
        )
    }

}