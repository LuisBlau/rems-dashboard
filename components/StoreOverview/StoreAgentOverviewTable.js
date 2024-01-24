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
    Avatar,
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useContext, useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import UserContext from '../../pages/UserContext';
import { MoreVert, PhotoCamera, PowerSettingsNew, SyncProblem } from '@mui/icons-material';
import Image from 'next/image';
import OfflineImage from '../../public/images/offline.png';
import masterAgentImage from '../../public/images/masteragent.png';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoDisturbAltRoundedIcon from '@mui/icons-material/DoDisturbAltRounded';
import _ from 'lodash';
import moment from 'moment';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { DataGrid } from '@mui/x-data-grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
    if (props.status) {
        if (props.status.EleraClient) {
            if (props.status.EleraClient.configured === 'true') {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight={"bold"} variant="h7">ELERA Register</Typography>
                    </Grid>
                );
            }
        }
        if (props.status.Controller) {
            if (props.status.Controller.configured === 'true') {
                if (props.is_master_agent) {
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
        } else if (props.status.SIGui) {
            if (props.status.SIGui.configured === 'true') {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight='bold' variant="h7">SI Gui Register</Typography>
                    </Grid>
                );
            }
        } else {
            if (_.includes(props.agentName, 'ars')) {
                return (
                    <Grid item xs={12}>
                        <Typography fontWeight='bold' variant='h7'>Server</Typography>
                    </Grid>
                )
            } else if (props.isSco === true) {
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
    if (_.includes(props.agentName, 'ars')) {
        return (
            <Grid item xs={12}>
                <Typography fontWeight='bold' variant='h7'>Server</Typography>
            </Grid>
        )
    } else if (props.isSco === true) {
        return (
            <Grid item xs={12}>
                <Typography fontWeight='bold' variant="h7">SCO</Typography>
            </Grid>
        );
    } else if (props.os === 'Android') {
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
    if (props.online) {
        if (props.authState === "authenticated") {
            return (
                <Grid item xs={4}>
                    <Typography color="#5BA52E">Online</Typography>
                </Grid>
            );
        } else if (props.authState === "unauthenticated") {
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
            <Typography color="#E7431F">Offline</Typography>
        </Grid>
    );
}



export default function StoreAgentOverviewTable({ devices, rows, useScreenshotView }) {
    const context = useContext(UserContext);

    let disableReload = true;
    if (context.userRoles.includes('Administrator') || context.userRoles.includes('toshibaAdmin')) {
        disableReload = false;
    }

    const [screenshotOpen, setScreenshotOpen] = useState(false);
    const [dumpConfirmationOpen, setDumpConfirmationOpen] = useState(false);
    const [reloadConfirmationOpen, setReloadConfirmationOpen] = useState(false);
    const handleReloadConfirmationClose = () => setReloadConfirmationOpen(false);
    const handleReloadConfirmationOpen = () => setReloadConfirmationOpen(true);
    const handleDumpConfirmationClose = () => setDumpConfirmationOpen(false);
    const handleDumpConfirmationOpen = () => setDumpConfirmationOpen(true);
    const handleScreenshotOpen = () => setScreenshotOpen(true);
    const handleScreenshotClose = () => setScreenshotOpen(false);

    const columns = [
        {
            field: 'statusIndicator',
            headerClassName: 'super-app-theme--header',
            headerName: '',
            sortable: false,
            filterable: false,
            width: 80,
            cellClassName: (params) => {
                const isOnline = params.row.online;
                return isOnline ? 'online' : 'offline'
            },
            renderCell: (params) => {
                const isOnline = params.row.online;
                return (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {isOnline ? (
                            <CheckCircleOutlineIcon style={{ color: '#FFFFFF' }} />
                        ) : (
                            <DoDisturbAltRoundedIcon style={{ color: '#FFFFFF' }} />
                        )}
                    </div>
                );
            },
        },
        {
            field: 'masterAgentIndicator',
            headerClassName: 'super-app-theme--header',
            headerName: '',
            sortable: false,
            filterable: false,
            width: 50,
            cellClassName: (params) => {
                const isOnline = params.row.is_master_agent;
                return isOnline ? 'isMaster' : ''
            },
            renderCell: (params) => {
                return (
                    <Box alignContent={'center'} display="flex" gap={1}>
                        {params.row?.is_master_agent && (
                            <Image
                                src={masterAgentImage}
                                alt="Master Agent"
                                style={{
                                    width: 25,
                                    height: 25,
                                }}
                            />
                        )}
                    </Box>
                );
            }
        },
        {
            field: 'agentName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Agent Name',
            sortable: true,
            flex: 2,
            filterable: true,
            cellClassName: (params) => {
                const isOnline = params.row.is_master_agent;
                return isOnline ? 'isMaster' : ''
            },
            renderCell: (params) => {
                const agentName = params.row.agentName.replace(params.row.storeName + '-', '');
                return (
                    <Box alignContent={'center'} display="flex" gap={1}>
                        <Typography variant='body1'> {agentName}</Typography>
                    </Box>
                );
            }

        },
        {
            field: 'row',
            headerClassName: 'super-app-theme--header',
            flex: 2,
            headerName: 'Type',
            sortable: true,
            cellClassName: (params) => {
                const isOnline = params.row.is_master_agent;
                return isOnline ? 'isMaster' : ''
            },
            renderCell: (params) => DisplaySystemType(params.row),
            valueGetter: (props) => {
                if (props.row.status?.EleraClient) {
                    if (props.row.status?.EleraClient?.configured === 'true') {
                        return 'ELERA Register'
                    }
                }
                if (props.row.status?.Controller) {
                    if (props.row.status?.Controller?.configured === 'true') {
                        if (props.row.is_master_agent) {
                            return 'Controller - Master'
                        }
                        return 'Controller'
                    }
                } else if (props.row.status?.SIGui) {
                    if (props.row.status?.SIGui?.configured === 'true') {
                        return 'SI Gui Register'
                    }
                } else {
                    if (_.includes(props.row.agentName, 'ars')) {
                        return 'Server'
                    } else if (props.row.isSco === true) {
                        return 'SCO'
                    } else {
                        return 'Register'
                    }
                }
            }
        },
        {
            field: 'os',
            headerClassName: 'super-app-theme--header',
            headerName: 'OS',
            flex: 1,
            filterable: true,
            sortable: false,
            cellClassName: (params) => {
                const isOnline = params.row.is_master_agent;
                return isOnline ? 'isMaster' : ''
            }
        },
        {
            field: 'last_updated_sec',
            headerClassName: 'super-app-theme--header',
            headerName: 'Last Updated',
            sortable: true,
            filterable: false,
            flex: 2,
            cellClassName: (params) => {
                const isOnline = params.row.is_master_agent;
                return isOnline ? 'isMaster' : ''
            },
            renderCell: (params) => params.row.last_updated_sec ? moment(params.row.last_updated_sec * 1000).fromNow() : 'N/A'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName: 'Status',
            sortable: false,
            flex: 2,
            cellClassName: (params) => {
                const isOnline = params.row.is_master_agent;
                return isOnline ? 'isMaster' : ''
            },
            renderCell: (params) => DisplayOnOffStatus(params.row),
            valueGetter: (params) => params.row.authState === 'authenticated' ? params.row.online === true ? 'online' : 'offline' : 'unauthenticated'
        }
    ];

    function DumpWithConfirmationModal({
        data,
        link,
        dumpConfirmationOpen,
        handleDumpConfirmationOpen,
        handleDumpConfirmationClose,
    }) {
        const confirmationString =
            'Are you sure you want to dump agent: ' + data?.agentName?.replace(data?.storeName + '-', '') + '?';

        return (
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onClick={handleDumpConfirmationOpen}>
                    <IconButton >
                        <SyncProblem style={{ color: '#FFFFFF' }} cursor={'pointer'} />
                    </IconButton>
                    <Typography sx={{ color: '#FFFFFF' }}>
                        Dump
                    </Typography>

                </Box>
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
            'Are you sure you want to reload agent: ' + data?.agentName.replace(data?.storeName + '-', '') + '?';

        return (
            <Grid item xs={12}>
                {disableReload ? null : (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onClick={handleReloadConfirmationOpen}>
                        <IconButton >
                            <PowerSettingsNew style={{ color: '#FFFFFF' }} cursor={'pointer'} />
                        </IconButton>
                        <Typography sx={{ color: '#FFFFFF' }}>
                            Reload
                        </Typography>
                    </Box>
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
            </Grid >
        );
    }

    function ActionColumn(data) {
        const jsonCommand = { Retailer: data?.retailer_id, Tenant: data?.tenant_id, Store: data?.storeName, Agent: data?.agentName, Command: 'Reload' };
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

        return (
            <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                    <Box >
                        <IconButton   {...bindTrigger(popupState)}>
                            <MoreVert />
                        </IconButton>

                        <Menu sx={{ "& .MuiMenu-paper": { backgroundColor: '#383838' } }} {...bindMenu(popupState)}>
                            {(data?.os === 'Sky' && data?.deviceType !== 3) &&
                                <MenuItem >
                                    <DumpWithConfirmationModal
                                        data={data}
                                        link={dump_link}
                                        dumpConfirmationOpen={dumpConfirmationOpen}
                                        handleDumpConfirmationOpen={handleDumpConfirmationOpen}
                                        handleDumpConfirmationClose={handleDumpConfirmationClose}
                                    />
                                </MenuItem>
                            }
                            <MenuItem>
                                <ReloadWithConfirmationModal
                                    disableReload={disableReload}
                                    data={data}
                                    link={reload_link}
                                    reloadConfirmationOpen={reloadConfirmationOpen}
                                    handleReloadConfirmationOpen={handleReloadConfirmationOpen}
                                    handleReloadConfirmationClose={handleReloadConfirmationClose}
                                /></MenuItem>
                            {!useScreenshotView && data?.status?.AgentActions?.screenshotsEnabled == 'true' &&
                                <MenuItem>
                                    <ScreenshotModal
                                        screenShotEnable
                                        data={data}
                                        screenshotOpen={screenshotOpen}
                                        handleScreenshotOpen={handleScreenshotOpen}
                                        handleScreenshotClose={handleScreenshotClose}
                                        selectedRetailer={context.selectedRetailer}
                                    />
                                </MenuItem>
                            }
                        </Menu>
                    </Box>
                )}
            </PopupState>
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} onClick={handleScreenshotOpen}>
                        <IconButton >
                            <PhotoCamera style={{ color: '#FFFFFF' }} cursor={'pointer'} />
                        </IconButton>
                        <Typography sx={{ color: '#FFFFFF' }}>
                            Screenshot
                        </Typography>
                    </Box>
                    <Modal open={screenshotOpen} onClose={handleScreenshotClose} aria-labelledby="modal-modal-title">
                        <Box sx={style}>
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: data?.online ? '#9DC982' : '#F57C62',
                                    }}>
                                        {data?.online ? (
                                            <CheckCircleOutlineIcon style={{ color: '#FFFFFF' }} />
                                        ) : (
                                            <DoDisturbAltRoundedIcon style={{ color: '#FFFFFF' }} />
                                        )}
                                    </div>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography align="center">{data.agentName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <ScreenCaptureDisplay agentData={data} width={600} height={600} refreshInterval={5000} selectedRetailer={selectedRetailer} />
                                </Grid>
                            </Grid>
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
                if (data?.image !== screenshotData.image || data?.last_updated !== screenshotData.lastUpdated) {
                    setScreenshotData({ lastUpdated: data?.last_updated, image: data?.image });
                }
            }
            const interval = setInterval(() => {
                fetch(
                    '/api/registers/commands/' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(screenCaptureCommand).replace('/sg', ''))))
                );

                if (data?.last_updated && data?.image) {
                    if (data?.image !== screenshotData.image || data?.last_updated !== screenshotData.lastUpdated) {
                        setScreenshotData({ lastUpdated: data?.last_updated, image: data?.image });
                    }
                }
            }, refreshInterval - 2500);

            clearInterval(interval);
        });

        if (error)
            return (
                <div>
                    <Image
                        className="card-img-top"
                        src={OfflineImage}
                        width={width}
                        height={height}
                        layout="responsive"
                        alt="Fetching image data?..."
                    />
                    <Typography>
                        Last Updated: {screenshotData.lastUpdated ? screenshotData.lastUpdated : 'Unknown'}
                    </Typography>
                </div>
            );
        if (data === undefined || screenshotData === undefined) return <div>loading...</div>;

        if (Object.keys(screenshotData).length !== 0) {
            return (
                <div>
                    <Image
                        className="card-img-top"
                        src={'data:image/png;base64,' + screenshotData.image}
                        layout="responsive"
                        height={height}
                        width={width}
                        alt="Fetching image data?..."
                        style={{ minHeight: 250 }}
                    />
                    <Typography>
                        Last Updated: {screenshotData.lastUpdated ? screenshotData.lastUpdated : 'Unknown'}
                    </Typography>
                </div>
            );
        } else {
            return (
                <div>
                    <Typography align="center">{agentData.agentName}</Typography>
                    <Image src={OfflineImage} alt="OfflineImage" />
                </div>
            );
        }
    }

    return !useScreenshotView ?
        <Box sx={{
            overflow: 'auto',
            width: '100%',
            '& .super-app-theme--header': {
                backgroundColor: '#EDEDF0'
            },
            '& .online': {
                backgroundColor: '#9DC982'
            },
            '& .offline': {
                backgroundColor: '#F57C62'
            },
            '& .isMaster': {
                backgroundColor: '#FEF3DF'
            }
        }}>
            <DataGrid
                rows={rows?.length > 0 ? rows?.map(x => ({ ...x, id: x._id })) : []}
                columns={[...columns, {
                    field: 'id',
                    headerClassName: 'super-app-theme--header',
                    headerName: '',
                    sortable: false,
                    filterable: false,
                    flex: 1,
                    cellClassName: (params) => {
                        const isMaster = params.row.is_master_agent;
                        return isMaster ? 'isMaster' : ''
                    },
                    renderCell: (params) => ActionColumn(params.row)
                }]}
                checkboxSelection={false}
                rowSelection={false}
                columnHeaderHeight={35}
                rowHeight={35}
            />
        </Box>
        :
        <Grid container spacing={2}>{rows?.map((data, index) =>
            <Grid key={index} item xs={3}>
                <Card>
                    <CardHeader
                        sx={{ backgroundColor: data?.is_master_agent ? '#FEF3DF' : '#FFFFF', padding: 0 }}
                        avatar={
                            <Box padding={1} sx={{ backgroundColor: data?.online ? '#9DC982' : '#F57C62' }} >
                                <Avatar aria-label="recipe" sx={{ backgroundColor: data?.online ? '#9DC982' : '#F57C62' }}>
                                    {data?.online ? (
                                        <CheckCircleOutlineIcon />
                                    ) : (
                                        <DoDisturbAltRoundedIcon />
                                    )}
                                </Avatar>
                            </Box>
                        }
                        action={<Box alignContent={'center'} padding={1}>{ActionColumn(data)}</Box>}
                        title={<Box alignContent={'center'} display="flex" gap={1}>{data?.is_master_agent && <Image
                            src={masterAgentImage}
                            alt=""
                            style={{
                                width: 25,
                                height: 25,
                                backgroundColor: '#FEF3DF'
                            }}
                        />}<Typography variant='body1'>  {data.agentName}</Typography></Box>}
                    />
                    <CardContent sx={{ padding: 0 }}>
                        <ScreenCaptureDisplay
                            agentData={data}
                            refreshInterval={30000}
                            height={250}
                            width={200}
                        />
                    </CardContent>
                </Card>
            </Grid>
        )}
        </Grid>
}



