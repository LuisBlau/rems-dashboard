import React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'servicetrace';

const classes = {
    content: `${PREFIX}-content`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
}));

export default function ServiceTrace() {
    return (
        <Root className={classes.content}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <iframe src="/needsRehoming/ServiceTraceRedirect" width="1400" frameBorder="0"></iframe>
            </div>
        </Root>
    );
}
