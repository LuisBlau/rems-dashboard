import React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'systemPerformance';

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

export default function SystemPerformance() {
    return (
        <Root className={classes.content}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                <iframe
                    style={{ paddingTop: 4, flexGrow: 1, border: 'none' }}
                    src="https://pas-apm.kb.us-central1.gcp.cloud.es.io:9243/app/dashboards?auth_provider_hint=anonymous1#/view/b0338a70-8291-11ed-a2f3-7763c1be2fed?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-1d%2Cto%3Anow))"
                    height="900"
                    width="800"
                ></iframe>
            </div>
        </Root>
    );
}
