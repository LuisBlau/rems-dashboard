import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { } from 'react';

export default function EleraInfoPaper({ elera, agent, eleraContainers }) {
    const router = useRouter();
    let key = agent
    let value = elera[agent]
    let workingStatus = null;
    let par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const params = new URLSearchParams(par);

    if (value["workingContainers"] == eleraContainers.length) {
        workingStatus = <Typography color="#5BA52E">{"Online: (" + value["workingContainers"] + "/" + eleraContainers.length + ")"}</Typography>
    } else if (value["workingContainers"] == 0) {
        workingStatus = <Typography color="#E7431F">{"Offline: (" + value["workingContainers"] + "/" + eleraContainers.length + ")"}</Typography>
    } else {
        workingStatus = <Typography color="#F8C45D">{"Partially  Online: (" + value["workingContainers"] + "/" + eleraContainers.length + ")"}</Typography>
    }

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container sx={{ padding: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Elera -- {params.get('storeName') + '-' + agent}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h8">{workingStatus}</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    {eleraContainers.map((containerName) => {
                        if (containerName in value && value[containerName] != undefined) {
                            return (
                                <Grid key={containerName} item xs={12}>
                                    <Typography>{containerName + " - " + value[containerName]}</Typography>
                                </Grid>
                            )
                        } else {
                            return (
                                <Grid key={containerName} item xs={12}>
                                    <Typography>{containerName + " -  Not Present"}</Typography>
                                </Grid>
                            )
                        }
                    })}
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row' }} >
                <Button variant="contained" sx={{ margin: 1, width: '25%' }} onClick={() => router.push('/store/eleraHealth?storeName=' + params.get("storeName") + '&retailer_id=' + params.get("retailer_id") + '&agentName=' + agent)} disableElevation>Health</Button>
                <Button variant="contained" sx={{ margin: 1, width: '25%' }} onClick={() => router.push('/store/eleraStats?storeName=' + params.get("storeName"))} disableElevation>Stats</Button>
            </Box>
        </Paper>
    );
}