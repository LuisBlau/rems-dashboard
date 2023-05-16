import React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'snmpCreate';

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

export default function ServiceNowDashboard() {
    return (
        <Root className={classes.content}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <iframe
                    style={{ paddingTop: 4, flexGrow: 1, border: 'none' }}
                    src="https://toshibatagstest.service-now.com/now/nav/ui/classic/params/target/%24pa_dashboard.do"
                />
            </div>
        </Root>
    );
}
