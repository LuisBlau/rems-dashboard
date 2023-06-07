/* eslint-disable react/prop-types */
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import OverviewAgentPaper from '../Connection/OverviewAgentPaper';
import React from 'react';
import { TripleMaze } from 'react-spinner-animated';

export default function AgentDetailsRegion({ boxWidth, paperWidth, storeAgents, screenshotView }) {
    if (storeAgents.length === 0) {
        return (
            <div role="progressbar" style={{ width: '100%', height: '100%' }}>
                <TripleMaze center="true" />
            </div>
        );
    } else {
        return (
            <Box sx={{ display: 'flex', width: `${boxWidth}%`, flexDirection: 'row', flexWrap: 'wrap', overflowY: 'auto' }}>
                {storeAgents.map((agent, index) => (
                    <Box key={index} sx={{ width: `${paperWidth}%`, padding: 2 }}>
                        <Paper elevation={10}>
                            <OverviewAgentPaper data={agent} useScreenshotView={screenshotView} />
                        </Paper>
                    </Box>
                ))}
            </Box>
        );
    }
}
