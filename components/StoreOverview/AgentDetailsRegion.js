/* eslint-disable react/prop-types */
import { CircularProgress, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import OverviewAgentPaper from '../Connection/OverviewAgentPaper';
import React from 'react';

export default function AgentDetailsRegion({ boxWidth, paperWidth, cameraDevices, storeAgents, screenshotView, storeHasNoAgents }) {
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
            <Box sx={{ display: 'flex', width: `${boxWidth}%`, flexDirection: 'row', flexWrap: 'wrap', overflowY: 'auto' }}>
                {storeAgents.map((agent, index) => (
                    <Box key={index} sx={{ width: `${paperWidth}%`, padding: 2 }}>
                        <Paper elevation={10}>
                            <OverviewAgentPaper devices={cameraDevices} data={agent} useScreenshotView={screenshotView} />
                        </Paper>
                    </Box>
                ))}
            </Box>
        );
    }
}
