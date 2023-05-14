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

export default function EleraStats() {
    return (
        <Root className={classes.content}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <iframe
                    style={{ paddingTop: 4, flexGrow: 1, border: 'none' }}
                    src="https://pas-apm.kb.us-central1.gcp.cloud.es.io:9243/app/dashboards?auth_provider_hint=anonymous1#/view/adc9dbd0-744b-11ed-a2f3-7763c1be2fed?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-7d%2Cto%3Anow))&show-time-filter=true"
                />
            </div>
        </Root>
    );
}
