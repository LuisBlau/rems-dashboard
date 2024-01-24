/* eslint-disable react/prop-types */
import { CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import StoreAgentOverviewTable from './StoreAgentOverviewTable';

export default function AgentDetailsRegion({ cameraDevices, storeAgents, screenshotView, storeHasNoAgents, elera }) {

    if (storeAgents.length === 0 && storeHasNoAgents !== true) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <CircularProgress size={80} />
            </Box>
        );
    } else if (storeHasNoAgents === true) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <Typography variant='h2' >No Agents Reporting for This Store</Typography>
            </Box>
        )
    } else {
        return (
            <StoreAgentOverviewTable
                devices={cameraDevices}
                rows={storeAgents}
                useScreenshotView={screenshotView}
                elera={elera}
            />
        );
    }
}
