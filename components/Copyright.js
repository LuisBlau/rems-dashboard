import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import appInfo from '../package.json';

export default function Copyright() {
    const [appVersion, setAppVersion] = useState('');

    useEffect(() => {
        setAppVersion(appInfo.version);
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <div>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <MuiLink color="inherit" href="https://toshibacommerce.com/" target={"_blank"}>
                    Toshiba Global Commerce Solutions
                </MuiLink>{' '}
                {new Date().getFullYear()}
                {' -- '}
                Version: {appVersion}
            </Typography>
        </div>
    );
}
