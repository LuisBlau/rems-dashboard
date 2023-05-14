/* eslint-disable react/prop-types */
import useSWR from 'swr';
import { styled } from '@mui/material/styles';
import fetcher from '../../lib/lib';
import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Copyright from '../../components/Copyright';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CellTowerIcon from '@mui/icons-material/CellTower';
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4';
import HandymanIcon from '@mui/icons-material/Handyman';
import OnlineOfflinePaper from '../../components/Connection/StoreOnlineOfflinePaper';

const PREFIX = 'connectionOverview';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    appBarSpacer: `${PREFIX}-appBarSpacer`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`,
    tinySpace: `${PREFIX}-tinySpace`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    // [`& .${classes.container}`]: {
    //   paddingTop: theme.spacing(4),
    //   paddingBottom: theme.spacing(4)
    // },

    [`& .${classes.appBarSpacer}`]: {
        paddingTop: 80,
    },
    [`& .${classes.tinySpace}`]: {
        paddingTop: 20,
    },
    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    },
}));

function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + ' years ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
}

function RemsConnected({ up }) {
    if (up) {
        return (
            <Tooltip title="Rems Server Up">
                <CellTowerIcon fontSize="large" />
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title="Rems Server Down">
                <SignalWifiConnectedNoInternet4Icon fontSize="large" />
            </Tooltip>
        );
    }
}

function CloudConnected({ up }) {
    if (up) {
        return (
            <Tooltip title="Cloud Forwarder Up">
                <CloudQueueIcon fontSize="large" />
            </Tooltip>
        );
    } else {
        return (
            <Tooltip title="Cloud Forwarder Down">
                <CloudOffIcon fontSize="large" />
            </Tooltip>
        );
    }
}
function PasConnected({ up }) {
    if (up) {
        return (
            <Tooltip title="PAS Assistance On">
                <HandymanIcon fontSize="large" />
            </Tooltip>
        );
    } else {
        return <Typography></Typography>;
    }
}

function RemsStatus() {
    const { data, error } = useSWR('/REMS/rems', fetcher);

    if (error) return <div>failed to load </div>;
    if (!data) return <div>loading...</div>;
    return (
        <Root>
            <Paper elevation={3} className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item xs={2.5}>
                        <RemsConnected up={data.rems} />
                    </Grid>
                    <Grid item xs={2.5}>
                        <CloudConnected up={data.cloud} />
                    </Grid>
                    <Grid item xs={2.5}>
                        <PasConnected up={data.pas} />
                    </Grid>
                    <Grid item xs={4.5}>
                        <Typography>Last Update:</Typography>
                        <Typography>{timeSince(data.last_update_sec * 1000)}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Root>
    );
}

function TotalAgents({ data }) {
    if (!data) return 0;

    return data.reduce((sum, store) => sum + store.totalAgents, 0);
}

export default function ConnectionOverview() {
    const [onlineAgents, setOnlineAgents] = useState(0);
    const [totalAgents, setTotalAgents] = useState(0);

    // TODO: consider changing this to not use fetcher/useSWR and instead use an API call
    const { data, error } = useSWR('/REMS/stores', fetcher);

    useEffect(() => {
        if (!data) return;
        setOnlineAgents(data.reduce((sum, store) => sum + store.onlineAgents, 0));
        setTotalAgents(data.reduce((sum, store) => sum + store.totalAgents, 0));
    }, [data]);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8.5}>
                        <Typography variant="h4">
                            Total Systems Monitored - <TotalAgents data={data} />
                        </Typography>
                    </Grid>
                    <Grid item xs={3.5}>
                        <RemsStatus />
                    </Grid>
                </Grid>

                <Grid></Grid>

                <Grid container justifyContent={'center'} spacing={4}>
                    <Grid item>
                        <OnlineOfflinePaper
                            title={'Store Overview'}
                            totalCount={data.length}
                            onlineCount={data.filter((store) => store.online).length}
                            // add a link to land
                            // onlineLink={""}s
                            // offlineLink={""}
                        />
                    </Grid>
                    <Grid item>
                        <OnlineOfflinePaper
                            title={'Agent Overview'}
                            onlineCount={onlineAgents}
                            totalCount={totalAgents}
                            // onlineLink={""}
                            // offlineLink={""}
                        />
                    </Grid>
                </Grid>
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
