import React, { useEffect } from 'react';
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
    function reload() {
        document.getElementById('healthSNOWFrame').src += '';
    }

    useEffect(() => {
        const doReload = () => {
            reload();
        };
        const interval = setInterval(() => {
            doReload();
        }, 20 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Root className={classes.content}>
            <div style={{ display: 'flex', width: '60%', height: '50%' }}>
                <iframe style={{ paddingTop: 4, flexGrow: 1, border: 'none' }} src="/needsRehoming/SSHRedirect" />
            </div>
            <div style={{ display: 'flex', width: '100%', height: '50%' }}>
                <iframe
                    id="healthSNOWFrame"
                    style={{ paddingTop: 4, flexGrow: 1, border: 'none' }}
                    src="https://toshibatagstest.service-now.com/now/nav/ui/classic/params/target/em_event_list.do%3Fsysparm_query%3Dsys_created_on%253E%253Djavascript%3Ags.beginningOfLastMinute()%255Esource%253DRMA-AI-ML%26sysparm_first_row%3D1%26sysparm_view%3D"
                />
            </div>
        </Root>
    );
}
