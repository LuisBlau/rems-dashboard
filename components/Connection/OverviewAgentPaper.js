/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-self-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import useSWR from 'swr';
import fetcher from '../../lib/lib';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useContext, useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import UserContext from '../../pages/UserContext';
import { PhotoCamera, Policy, PowerSettingsNew, ShoppingBasketRounded, SyncProblem } from '@mui/icons-material';
import Image from 'next/image';
import OfflineImage from '../../public/images/offline.png';
import _ from 'lodash';
import moment from 'moment';

const PREFIX = 'OverviewAgentPaper';

const classes = {
    barHeight: `${PREFIX}-barHeight`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('main')(() => ({
    [`& .${classes.barHeight}`]: {
        height: 50,
    },
}));

function DisplaySystemType(props) {
    if (props.data.status) {
        if (props.data.status.EleraClient) {
            if (props.data.status.EleraClient.configured === 'true') {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight={"bold"} variant="h7">ELERA Register</Typography>
                    </Grid>
                );
            }
        }
        if (props.data.status.Controller) {
            if (props.data.status.Controller.configured === 'true') {
                if (props.data.is_master_agent) {
                    return (
                        <Grid item xs={12}>
                            <Typography fontWeight={"bold"} variant="h7">Controller - Master</Typography>
                        </Grid>
                    );
                }
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight={"bold"} variant="h7">Controller</Typography>
                    </Grid>
                );
            }
        } else if (props.data.status.SIGui) {
            if (props.data.status.SIGui.configured === 'true') {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight='bold' variant="h7">SI Gui Register</Typography>
                    </Grid>
                );
            }
        } else {
            if (_.includes(props.data.agentName, 'ars')) {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight='bold' variant='h7'>Server</Typography>
                    </Grid>
                )
            } else if (props.data.isSco === true) {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight='bold' variant="h7">SCO</Typography>
                    </Grid>
                );
            } else {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight='bold' variant="h7">Register</Typography>
                    </Grid>
                );
            }
        }
    }
    if (_.includes(props.data.agentName, 'ars')) {
        return (
            <Grid item xs={12}>
                <Typography fontWeight='bold' variant='h7'>Server</Typography>
            </Grid>
        )
    } else if (props.data.isSco === true) {
        return (
            <Grid item xs={12}>
                <Typography fontWeight='bold' variant="h7">SCO</Typography>
            </Grid>
        );
    } else if (props.data.os === 'Android') {
        return (
            <Grid item xs={12}>
                <Typography fontWeight='bold' variant="h7">Mobile</Typography>
            </Grid >
        )
    } else {
        return (
            <Grid item xs={12}>
                <Typography fontWeight='bold' variant="h7">Register</Typography>
            </Grid >
        );
    }
}
function DisplayOnOffStatus(props) {
    if (props.data.online) {
        if (props.data.authState === "authenticated") {
            return (
                <Grid item xs={4}>
                    <Typography color="#5BA52E">Online</Typography>
                </Grid>
            );
        } else if (props.data.authState === "unauthenticated") {
            return (
                <Grid item xs={4}>
                    <Typography color="red">Unauthenticated</Typography>
                </Grid>
            );
        } else {
            return (
                <Grid item xs={4}>
                    <Typography color="#5BA52E">Online</Typography>
                </Grid>
            )
        }
    }

    return (
        <Grid item xs={4}>
            <Typography color="red">Offline</Typography>
        </Grid>
    );
}

function ScreenshotModal({ data, screenshotOpen, handleScreenshotOpen, handleScreenshotClose, screenShotEnable, selectedRetailer }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 625,
        height: 640,
        bgcolor: '#ffffff',
        border: '2px solid #000',
        outline: '#7c70b3',
        boxShadow: 24,
        p: 4,
    };
    if (screenShotEnable) {
        return (
            <Grid item xs={12}>
                <Tooltip arrow title={<Typography sx={{ fontSize: 12 }}>Agent Screenshot</Typography>}>
                    <IconButton onClick={handleScreenshotOpen}>
                        <PhotoCamera style={{ color: '#484848' }} cursor={'pointer'} />
                    </IconButton>
                </Tooltip>
                <Modal open={screenshotOpen} onClose={handleScreenshotClose} aria-labelledby="modal-modal-title">
                    <Box sx={style}>
                        <ScreenCaptureDisplay agentData={data} width={600} height={600} refreshInterval={5000} selectedRetailer={selectedRetailer} />
                    </Box>
                </Modal>
            </Grid>
        );
    } else {
        return null
    }

}

function ScreenCaptureDisplay({ agentData, refreshInterval, width, height }) {
    const context = useContext(UserContext)
    const screenCaptureCommand = {
        Retailer: agentData.retailer_id,
        Tenant: agentData.tenant_id,
        Store: agentData.storeName,
        Agent: agentData.agentName,
        Command: 'ScreenCapture',
    };
    const [screenshotData, setScreenshotData] = useState({});
    fetch(
        '/api/registers/commands/' +
        btoa(unescape(encodeURIComponent(JSON.stringify(screenCaptureCommand).replace('/sg', ''))))
    );
    let retailerSegment = `retailerId=${context.selectedRetailer}`

    if (context.selectedRetailerIsTenant === true) {
        retailerSegment = `retailerId=${context.selectedRetailerParentRemsServerId}`
    }

    const { data, error } = useSWR(
        `/REMS/agentScreenShot?${retailerSegment}&storeName=` + agentData.storeName + '&agentName=' + agentData.agentName,
        fetcher,
        { refreshInterval }
    );

    useEffect(() => {
        if (data) {
            if (data.image !== screenshotData.image || data.last_updated !== screenshotData.lastUpdated) {
                setScreenshotData({ lastUpdated: data.last_updated, image: data.image });
            }
        }
        const interval = setInterval(() => {
            fetch(
                '/api/registers/commands/' +
                btoa(unescape(encodeURIComponent(JSON.stringify(screenCaptureCommand).replace('/sg', ''))))
            );

            if (data.last_updated && data.image) {
                if (data.image !== screenshotData.image || data.last_updated !== screenshotData.lastUpdated) {
                    setScreenshotData({ lastUpdated: data.last_updated, image: data.image });
                }
            }
        }, refreshInterval - 2500);

        clearInterval(interval);
    });

    if (error)
        return (
            <Root>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
                    <Typography align="center">{agentData.agentName}</Typography>
                    <Image
                        className="card-img-top"
                        src={OfflineImage}
                        width={width}
                        height={height}
                        alt="Fetching image data..."
                    />
                    <Typography>
                        Last Updated: {screenshotData.lastUpdated ? screenshotData.lastUpdated : 'Unknown'}
                    </Typography>
                </Box>
            </Root>
        );
    if (data === undefined || screenshotData === undefined) return <div>loading...</div>;

    if (Object.keys(screenshotData).length !== 0) {
        return (
            <Root>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
                    <Typography align="center">{agentData.agentName}</Typography>
                    <Image
                        className="card-img-top"
                        src={'data:image/png;base64,' + screenshotData.image}
                        width={width}
                        height={height}
                        alt="Fetching image data..."
                    />
                    <Typography>
                        Last Updated: {screenshotData.lastUpdated ? screenshotData.lastUpdated : 'Unknown'}
                    </Typography>
                </Box>
            </Root>
        );
    } else {
        return (
            <Root>
                <Typography align="center">{agentData.agentName}</Typography>
                <Image src={OfflineImage} alt="OfflineImage" />
            </Root>
        );
    }
}

function DumpWithConfirmationModal({
    data,
    link,
    dumpConfirmationOpen,
    handleDumpConfirmationOpen,
    handleDumpConfirmationClose,
}) {
    const confirmationString =
        'Are you sure you want to dump agent: ' + data.agentName.replace(data.storeName + '-', '') + '?';

    return (
        <Grid item xs={12}>
            <Tooltip arrow title={<Typography sx={{ fontSize: 12 }}>Dump</Typography>}>
                <IconButton onClick={handleDumpConfirmationOpen}>
                    <SyncProblem style={{ color: '#484848' }} cursor={'pointer'} />
                </IconButton>
            </Tooltip>
            <Dialog
                open={dumpConfirmationOpen}
                onClose={handleDumpConfirmationClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{confirmationString}</DialogTitle>
                <DialogActions>
                    <Button style={{ marginRight: 12 }} variant="contained" onClick={handleDumpConfirmationClose}>
                        Cancel
                    </Button>
                    <Link href={link}>
                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleDumpConfirmationClose}>
                            Yes
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

function ReloadWithConfirmationModal({
    disableReload,
    data,
    link,
    reloadConfirmationOpen,
    handleReloadConfirmationOpen,
    handleReloadConfirmationClose,
}) {
    const confirmationString =
        'Are you sure you want to reload agent: ' + data.agentName.replace(data.storeName + '-', '') + '?';

    return (
        <Grid item xs={12}>
            {disableReload ? null : (
                <Tooltip arrow title={<Typography sx={{ fontSize: 12 }}>Reload</Typography>}>
                    <IconButton onClick={handleReloadConfirmationOpen}>
                        <PowerSettingsNew style={{ color: '#484848' }} cursor={'pointer'} />
                    </IconButton>
                </Tooltip>
            )
            }

            <Dialog
                open={reloadConfirmationOpen}
                onClose={handleReloadConfirmationClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{confirmationString}</DialogTitle>
                <DialogActions>
                    <Button style={{ marginRight: 12 }} variant="contained" onClick={handleReloadConfirmationClose}>
                        Cancel
                    </Button>
                    <Link href={link}>
                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleReloadConfirmationClose}>
                            Yes
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </Grid >
    );
}

export default function OverviewAgentPaper({ devices, data, useScreenshotView }) {
    const context = useContext(UserContext);
    const [screenShotEnable, setScreenShotEnable] = useState(false)
    const [agentDevices, setAgentDevices] = useState([])
    let disableReload = true;
    if (context.userRoles.includes('Administrator') || context.userRoles.includes('toshibaAdmin')) {
        disableReload = false;
    }

    useEffect(() => {
        var localDevices = []
        devices.forEach(device => {
            if (device.agentName === data.agentName) {
                localDevices.push(device)
            }
        });
        setAgentDevices(localDevices)
    }, [devices, data])

    useEffect(() => {
        if (data.status?.AgentActions) {
            if (data.status.AgentActions?.screenshotsEnabled === 'true') {
                setScreenShotEnable(true)
            }
        }
    }, [data])

    const [screenshotOpen, setScreenshotOpen] = useState(false);
    const [dumpConfirmationOpen, setDumpConfirmationOpen] = useState(false);
    const [reloadConfirmationOpen, setReloadConfirmationOpen] = useState(false);
    const handleReloadConfirmationClose = () => setReloadConfirmationOpen(false);
    const handleReloadConfirmationOpen = () => setReloadConfirmationOpen(true);
    const handleDumpConfirmationClose = () => setDumpConfirmationOpen(false);
    const handleDumpConfirmationOpen = () => setDumpConfirmationOpen(true);
    const handleScreenshotOpen = () => setScreenshotOpen(true);
    const handleScreenshotClose = () => setScreenshotOpen(false);

    const jsonCommand = { Retailer: data.retailer_id, Tenant: data.tenant_id, Store: data.storeName, Agent: data.agentName, Command: 'Reload' };
    const reload_link =
        'javascript:fetch("/api/registers/commands/' +
        btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/sg', '')))) +
        '")';
    jsonCommand.Command = 'Dump';
    const dump_link =
        'javascript:fetch("/api/registers/commands/' +
        btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/sg', '')))) +
        '")';
    jsonCommand.Command = 'Wake';
    jsonCommand.Command = 'Sleep';

    let hasStatus = false;
    let statusType = '';
    if (data.hasOwnProperty('status')) {
        if (data.status.hasOwnProperty('ELMO')) {
            hasStatus = true;
            statusType = 'ELMO';
        }
        if (data.status.hasOwnProperty('DeviceBroker')) {
            hasStatus = true;
            statusType = 'DeviceBroker';
        }
    }

    // Docker or Elera status checker for background
    const [agentBackgroundColorStyle, setAgentBackgroundColorStyle] = useState('#ffffff');
    if (data.status) {
        if (data.status.docker) {
            const arr = Object.values(data.status.docker);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = JSON.parse(arr[i]);
                // if any of the docker containers are _not_ running, change to red
                // if (arr[i].State !== 'running' && agentBackgroundColorStyle !== '#ffc2cd') {
                //   setAgentBackgroundColorStyle('#ffc2cd')
                // }
            }
        }
        if (data.status.EleraServices && Object.values(data.status.EleraServices)[0].status) {
            // if elera status on the first (default) container isn't online, make it REDDDDDD
            // if ((JSON.parse(Object.values(data.status.EleraServices)[0]).containers[0].status) !== 'ONLINE' && agentBackgroundColorStyle !== '#ffc2cd') {
            //   setAgentBackgroundColorStyle('#ffc2cd')
            // }
        }
    }
    if (useScreenshotView === false) {
        return (
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#E7431F'
                }}
            >
                <Grid container style={{ backgroundColor: agentBackgroundColorStyle, padding: 12 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h6">{data.agentName.replace(data.storeName + '-', '')}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <DisplaySystemType data={data} />
                        </Grid>
                    </Grid>

                    <Grid className={classes.barHeight} container spacing={1}>
                        <Grid item xs={4}>
                            <DisplayOnOffStatus data={data} />
                        </Grid>
                        <Grid sx={{ display: 'flex', flexDirection: 'row' }} item xs={9}>
                            {data.vendor &&
                                <Typography sx={{ paddingRight: 2 }}>Mfg: {data.vendor}</Typography>
                            }
                            <Typography>OS: {data.os}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid className={classes.barHeight} item xs={12}>
                            <Typography>Last Update: {moment(data.last_updated_sec * 1000).fromNow()}</Typography>
                        </Grid>
                    </Grid>
                    <Typography>Agent Actions:</Typography>
                    <Grid container spacing={1}>
                        {(data.os === 'Sky' && data.deviceType !== 3) &&
                            <Grid item xs={1} sx={{ margin: 1 }}>
                                <DumpWithConfirmationModal
                                    data={data}
                                    link={dump_link}
                                    dumpConfirmationOpen={dumpConfirmationOpen}
                                    handleDumpConfirmationOpen={handleDumpConfirmationOpen}
                                    handleDumpConfirmationClose={handleDumpConfirmationClose}
                                />
                            </Grid>
                        }

                        <Grid item xs={1} sx={{ margin: 1 }}>
                            <ReloadWithConfirmationModal
                                disableReload={disableReload}
                                data={data}
                                link={reload_link}
                                reloadConfirmationOpen={reloadConfirmationOpen}
                                handleReloadConfirmationOpen={handleReloadConfirmationOpen}
                                handleReloadConfirmationClose={handleReloadConfirmationClose}
                            />
                        </Grid>
                        <Grid item xs={1} sx={{ margin: 1 }}>
                            <ScreenshotModal
                                screenShotEnable={screenShotEnable}
                                data={data}
                                screenshotOpen={screenshotOpen}
                                handleScreenshotOpen={handleScreenshotOpen}
                                handleScreenshotClose={handleScreenshotClose}
                                selectedRetailer={context.selectedRetailer}
                            />
                        </Grid>
                    </Grid>
                    { // This should be checking if the agent has any devices associated to it
                        // Which should be sent up from the agents endpoint (needs to be updated to include that)
                        (agentDevices.length > 0) &&
                        <Box>
                            <Typography>Devices:</Typography>
                            <Grid container spacing={3}>
                                {agentDevices.map((device, index) => (
                                    <Grid key={index} item xs={1} sx={{ margin: 1 }}>
                                        <Tooltip arrow title={
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                {(device.deviceType === "ProduceCamera") ? <Typography variant='h6'>Produce Camera</Typography> : <Typography variant='h6'>Loss Prevention Camera</Typography>}
                                                <Typography sx={{ fontSize: 12 }}>Manufacturer: {device.vendor}</Typography>
                                                <Typography sx={{ fontSize: 12 }}>Model: {device.model}</Typography>
                                            </Box>} >
                                            <IconButton>
                                                {(device.deviceType === "ProduceCamera") ? <ShoppingBasketRounded style={{ color: '#484848' }} cursor={'pointer'} /> : <Policy style={{ color: '#484848' }} cursor={'pointer'} />}
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    }
                </Grid>
            </Paper>
        );
    } else {
        return (
            <ScreenCaptureDisplay
                agentData={data}
                height={200}
                width={200}
                refreshInterval={30000}
            ></ScreenCaptureDisplay>
        );
    }
}
