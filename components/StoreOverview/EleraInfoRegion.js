/* eslint-disable react/prop-types */
import { Box, Paper } from "@mui/material";
import React from 'react';
import EleraInfoPaper from "../Connection/EleraInfoPaper";

export default function EleraInfoRegion({ elera }) {
    return (
        <Box sx={{ display: 'flex', width: '30%', flexDirection: 'row', flexWrap: 'wrap', overflowY: 'auto' }}>
            {Object.keys(elera).map((agent, index) => (
                <Box key={index} sx={{ width: '100%', padding: 2 }}>
                    <Paper elevation={10}>
                        <EleraInfoPaper elera={elera} agent={agent} />
                    </Paper>
                </Box>
            ))}
        </Box>
    )
}