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
import { PhotoCamera, PowerSettingsNew, SyncProblem } from '@mui/icons-material';
import EleraInfoModal from './InformationModals/EleraInfoModal';
import RmqInfoModal from './InformationModals/RmqInfoModal';
import DockerInfoModal from './InformationModals/DockerInfoModal';
import Image from 'next/image';
import OfflineImage from '../../public/images/offline.png';

// TODO: Move reusable modals out of this file into their own components
const PREFIX = 'OverviewAgentPaper';
const bytesPerMegabyte = 1048576;

const classes = {
    barHeight: `${PREFIX}-barHeight`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('main')(({ theme }) => ({
    [`& .${classes.barHeight}`]: {
        height: 50,
    },
}));

function timeSince(date) {
    const seconds = (new Date() - new Date(date)) / 1000;
    return prettifyTime(seconds) + ' ago';
}

function prettifyTime(seconds) {
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' months';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' days';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hours';
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minutes';
    }
    return Math.floor(seconds) + ' seconds';
}

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
            return (
                <Grid item xs={12}>
                    <Typography fontWeight='bold' variant="h7">Register</Typography>
                </Grid>
            );
        }
    }

    return (
        <Grid item xs={12}>
            <Typography fontWeight='bold' variant="h7">Register</Typography>
        </Grid >
    );
}
function DisplayOnOffStatus(props) {
    if (props.data.online) {
        if (props.data.authState === "authenticated") {
            return (
                <Grid item xs={4}>
                    <Typography color="#5BA52E">Online</Typography>
                </Grid>
            );
        } else {
            return (
                <Grid item xs={4}>
                    <Typography color="red">Unauthenticated</Typography>
                </Grid>
            );
        }
    }

    return (
        <Grid item xs={4}>
            <Typography color="red">Offline</Typography>
        </Grid>
    );
}


function ModalDisplayButtonsComponentTitle({ data }) {
    if (data.status) {
        if (data.status.docker || data.status.EleraServices || data.status.RMQ) {
            return <Typography>Service Information:</Typography>;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function ModalDisplayButtonsComponent({
    data,
    dockerModalOpen,
    handleDockerModalClose,
    handleDockerModalOpen,
    eleraModalOpen,
    handleEleraModalClose,
    handleEleraModalOpen,
    rmqModalOpen,
    handleRmqModalClose,
    handleRmqModalOpen,
}) {
    if (data.status) {
        return (
            <>
                <Grid container spacing={1}>
                    <Grid item xs={1} sx={{ margin: 1 }}>
                        <DockerInfoModal
                            modalData={data.status}
                            dockerModalOpen={dockerModalOpen}
                            handleDockerModalClose={handleDockerModalClose}
                            handleDockerModalOpen={handleDockerModalOpen}
                        />
                    </Grid>
                    <Grid item xs={1} sx={{ margin: 1 }}>
                        <EleraInfoModal
                            modalData={data.status}
                            eleraModalOpen={eleraModalOpen}
                            handleEleraModalClose={handleEleraModalClose}
                            handleEleraModalOpen={handleEleraModalOpen}
                        />
                    </Grid>
                    <Grid item xs={1} sx={{ margin: 1 }}>
                        <RmqInfoModal
                            modalData={data.status}
                            rmqModalOpen={rmqModalOpen}
                            handleRmqModalClose={handleRmqModalClose}
                            handleRmqModalOpen={handleRmqModalOpen}
                            prettifyTime={prettifyTime}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }
    return null;
}

function DisplaySalesApplication(props) {
    const { data, error } = useSWR(
        '/REMS/agents?store=' + props.data.storeName + '&agentName=' + props.data.agentName,
        fetcher
    );

    if (error) return <div>failed to load </div>;
    if (!data) return <div>loading...</div>;

    const displayData = data[0]?.status;
    let date = displayData?.snapshot;
    const isElmo = displayData?.ELMO;
    const isDB = displayData?.DeviceBroker;

    if (isElmo) {
        return (
            <Grid item xs={12}>
                <Typography>Costl online: {String(timeSince((date = date)))}</Typography>
            </Grid>
        );
    } else if (isDB) {
        return (
            <Grid item xs={12}>
                <Typography>WebPos</Typography>
                <Typography>{props.data.isUIstate}</Typography>
            </Grid>
        );
    }
    return null;
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
        height: 625,
        bgcolor: '#ffffff',
        border: '2px solid #000',
        outline: '#7c70b3',
        boxShadow: 24,
        p: 4,
    };
    if (screenShotEnable) {
        return (
            <Grid item xs={12}>
                <Tooltip arrow title="Agent Screenshot">
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
    const style = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const screenCaptureCommand = {
        Retailer: agentData.retailer_id,
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
            <Tooltip arrow title="Dump">
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
                <Tooltip arrow title="Reload">
                    <IconButton onClick={handleReloadConfirmationOpen}>
                        <PowerSettingsNew style={{ color: '#484848' }} cursor={'pointer'} />
                    </IconButton>
                </Tooltip>
            )}

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
        </Grid>
    );
}

export default function OverviewAgentPaper({ data, useScreenshotView }) {
    const context = useContext(UserContext);
    const [screenShotEnable, setScreenShotEnable] = useState(false)
    let disableReload = true;
    if (context.userRoles.includes('admin') || context.userRoles.includes('toshibaAdmin')) {
        disableReload = false;
    }


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
    const [dockerModalOpen, setDockerModalOpen] = useState(false);
    const [eleraModalOpen, setEleraModalOpen] = useState(false);
    const [rmqModalOpen, setRmqModalOpen] = useState(false);
    const handleReloadConfirmationClose = () => setReloadConfirmationOpen(false);
    const handleReloadConfirmationOpen = () => setReloadConfirmationOpen(true);
    const handleDumpConfirmationClose = () => setDumpConfirmationOpen(false);
    const handleDumpConfirmationOpen = () => setDumpConfirmationOpen(true);
    const handleScreenshotOpen = () => setScreenshotOpen(true);
    const handleScreenshotClose = () => setScreenshotOpen(false);
    const handleDockerModalOpen = () => setDockerModalOpen(true);
    const handleDockerModalClose = () => setDockerModalOpen(false);
    const handleEleraModalOpen = () => setEleraModalOpen(true);
    const handleEleraModalClose = () => setEleraModalOpen(false);
    const handleRmqModalOpen = () => setRmqModalOpen(true);
    const handleRmqModalClose = () => setRmqModalOpen(false);

    const jsonCommand = { Retailer: data.retailer_id, Store: data.storeName, Agent: data.agentName, Command: 'Reload' };
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
    const wake_link =
        'javascript:fetch("/api/registers/commands/' +
        btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/sg', '')))) +
        '")';
    jsonCommand.Command = 'Sleep';
    const sleep_link =
        'javascript:fetch("/api/registers/commands/' +
        btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/sg', '')))) +
        '")';

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
                        <Grid item xs={9}>
                            <Typography>OS: {data.os}</Typography>
                        </Grid>
                    </Grid>
                    {/* <Grid container spacing={1}>
            <Grid item xs={12}>
              <DisplaySalesApplication data={data} />
            </Grid>
          </Grid> */}
                    <Grid container spacing={1}>
                        <Grid className={classes.barHeight} item xs={12}>
                            <Typography>Last Update: {timeSince(data.last_updated)}</Typography>
                        </Grid>
                    </Grid>
                    {/*
            <Grid container spacing={1}>
              <Grid className={classes.barHeight} item xs={12}>
                <Typography>Status:</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} marginBottom={1.5}>
            <Grid className={classes.barHeight} item xs={12}>
              {
                (hasStatus && statusType === 'ELMO') && <Typography>ui_state:"{data.status.ELMO.ui_state}"</Typography>
              }
              {
                (hasStatus && statusType === 'DeviceBroker') && <Typography>ui_state:"{data.status.DeviceBroker.ui_state}"</Typography>
              }
              {
                (hasStatus && statusType === 'ELMO') && <Typography>ui_substate:"{data.status.ELMO.ui_substate}"</Typography>
              }
              {
                (hasStatus && statusType === 'DeviceBroker') && <Typography>ui_substate:"{data.status.DeviceBroker.ui_substate}"</Typography>
              }
              {
                (hasStatus && statusType === 'ELMO') && <Typography>pinpad_stage:"{data.status.ELMO.pinpad_stage}"</Typography>
              }
              {
                (hasStatus && statusType === 'DeviceBroker') && <Typography>pinpad_stage:"{data.status.DeviceBroker.pinpad_stage}"</Typography>
              }
              {
                (!hasStatus) && <Typography>No Status Found</Typography>
              }
            </Grid>
          </Grid> */}
                    <Typography>Agent Actions:</Typography>
                    <Grid container spacing={1}>
                        {data.os === 'Sky' &&
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
                        <Grid item xs={1} sx={{ margin: 1 }}>
                            <DockerInfoModal
                                modalData={data.status}
                                dockerModalOpen={dockerModalOpen}
                                handleDockerModalClose={handleDockerModalClose}
                                handleDockerModalOpen={handleDockerModalOpen}
                            />
                        </Grid>
                    </Grid>
                    {/* <ModalDisplayButtonsComponentTitle data={data}></ModalDisplayButtonsComponentTitle>
          <ModalDisplayButtonsComponent data={data} dockerModalOpen={dockerModalOpen} handleDockerModalClose={handleDockerModalClose} handleDockerModalOpen={handleDockerModalOpen} eleraModalOpen={eleraModalOpen} handleEleraModalOpen={handleEleraModalOpen} handleEleraModalClose={handleEleraModalClose} rmqModalOpen={rmqModalOpen} handleRmqModalClose={handleRmqModalClose} handleRmqModalOpen={handleRmqModalOpen} /> */}
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
