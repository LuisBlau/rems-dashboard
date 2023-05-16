/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material';
import React from 'react';
import StoreIcon from '@mui/icons-material/Store';
import PieChart, { Connector, Label, Legend, Series, Size } from 'devextreme-react/pie-chart';
import Link from 'next/link';

const PREFIX = 'OverviewStorePaper';

const classes = {
    barHeight: `${PREFIX}-barHeight`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.

function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + ' year' + (Math.floor(interval) !== 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' month' + (Math.floor(interval) !== 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' day' + (Math.floor(interval) !== 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hour' + (Math.floor(interval) !== 1 ? 's' : '') + ' ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minute' + (Math.floor(interval) !== 1 ? 's' : '') + ' ago';
    }
    return Math.floor(seconds) + ' second' + (Math.floor(seconds) !== 1 ? 's' : '') + ' ago';
}

export default function OverviewStorePaper({ data }) {

    const onlineAgents = [
        { Type: 'Online', Count: data.onlineAgents },
        { Type: 'Offline', Count: data.totalAgents - data.onlineAgents },
    ];
    const paletteCollection = ['Green', 'Red'];

    function customizeText({ argument, value }) {
        return `${argument}: ${value}`;
    }

    return (
        <Grid container>
            <Grid item container xs={2}>
                <StoreIcon fontSize="large"></StoreIcon>
            </Grid>
            <Grid item xs={5}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Link
                            key={data.storeName}
                            href={`/storeOverview?store=${data.storeName}&retailer_id=${data.retailerId}`}

                        >
                            <Typography style={{ cursor: 'pointer' }} variant="h5">
                                {data.storeName}
                            </Typography>
                        </Link>
                        <Typography>Updated: {timeSince(data.last_updated_sec * 1000)}</Typography>
                        <Typography>
                            Online: {data.onlineAgents} of {data.totalAgents}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container xs={3}>
                <PieChart
                    id={'pie' + props.title}
                    dataSource={onlineAgents}
                    palette={paletteCollection}
                    title={props.title}
                >
                    <Legend visible={false} />
                    <Series argumentField="Type" valueField="Count">
                        <Label visible={false} customizeText={customizeText}>
                            <Connector visible={false} width={1} />
                        </Label>
                    </Series>
                    <Size width={200} height={75} />
                </PieChart>
            </Grid>
        </Grid>
    );
}
