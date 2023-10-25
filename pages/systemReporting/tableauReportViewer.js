import React from 'react';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import UserContext from '../UserContext';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import ReportUnderConstruction from '../../components/ReportUnderConstruction';
import { useRouter } from 'next/router';

const PREFIX = 'inventory';

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

export default function tableauReportViewer(props) {
    const queryParameters = useRouter();
    const context = useContext(UserContext);
    const [showReport, setShowReport] = useState(null);
    const [jwt, setJwt] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
        if (context.selectedRetailer && context.selectedRetailer !== '') {
            if (jwt === '') {
                axios.get(`/api/REMS/getTableauJwt?retailerId=${context.selectedRetailer}&env=${queryParameters.query["env"]}`).then(function (res) {
                    setJwt(res.data)
                });
            }

            axios.get(`/api/retailers/getConfiguration?isAdmin=true&retailerId=${context.selectedRetailer}`)
                .then(function (res) {
                    // fetch configuration info
                    const configurationArray = res.data.configuration;
                    const configurationInfo = [];
                    configurationArray.forEach((configObject) => {
                        const innerArray = Object.values(configObject)[0];
                        configurationInfo.push(innerArray);
                    });
                    if (configurationInfo.find((x) => x.configName === (queryParameters.query["reportName"] + 'Url')).configValue !== 'Under Construction') {
                        setUrl(configurationInfo.find(x => x.configName === (queryParameters.query["reportName"] + 'Url')).configValue)
                        setShowReport(true);
                    } else {
                        setShowReport(false)
                    }
                });
        }
    }, [context]);

    if (showReport !== null && showReport === true && url !== '') {
        return (
            <Root className={classes.content}>
                <tableau-viz id="tableauViz"
                    src={url}
                    token={jwt}>
                </tableau-viz>
            </Root>
        );
    } else if (showReport === false) {
        return <ReportUnderConstruction />;
    } else {
        return null
    }
}
