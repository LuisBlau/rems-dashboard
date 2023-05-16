/* eslint-disable react/prop-types */
import { CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function ProgressIndicator({ progress, inProgress }) {
    if (progress !== 0) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={progress} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 12,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.secondary">
                        {`${Math.round(progress)}%`}
                    </Typography>
                </Box>
            </Box>
        );
    } else if (progress === 0 && inProgress === true) {
        return <CircularProgress variant="indeterminate" />;
    } else {
        return null;
    }
}
