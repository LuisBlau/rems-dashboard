/* eslint-disable react/prop-types */
import React from 'react'
import { Box, Typography } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';

export function CustomLinearProgress({ title, subTitle, value, ...rest }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', margin: 1, justifyContent: 'start', width: '100%' }}>
            <Typography variant="h5">
                {title}
            </Typography>
            <Typography variant='h6'>{subTitle}</Typography>
            <LinearProgress sx={{ borderRadius: 1, height: 10, width: '100%' }} color="info" variant="determinate" value={value} {...rest} />
        </Box>
    )
}