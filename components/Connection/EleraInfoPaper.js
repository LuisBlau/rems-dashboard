/* eslint-disable react/prop-types */
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { } from 'react';

export default function EleraInfoPaper({ elera, agent }) {
    const router = useRouter();
    let par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const params = new URLSearchParams(par);

    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container sx={{ padding: 2 }}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Elera -- {params.get('storeName') + '-' + agent}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row' }} >
                <Button variant="contained" sx={{ margin: 1, width: '25%' }} onClick={() => router.push('/store/eleraHealth?storeName=' + params.get("storeName") + '&retailer_id=' + params.get("retailer_id") + '&agentName=' + agent)} disableElevation>Health</Button>
                <Button variant="contained" sx={{ margin: 1, width: '25%' }} onClick={() => router.push('/store/eleraStats?storeName=' + params.get("storeName"))} disableElevation>Stats</Button>
            </Box>
        </Paper>
    );
}