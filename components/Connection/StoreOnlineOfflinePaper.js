/* eslint-disable react/prop-types */
import { Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PieChart, { Connector, Label, Legend, Series, Size } from 'devextreme-react/pie-chart';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

export default function OnlineOfflinePaper({ onlineCount, title, totalCount, onlineLink, offlineLink }) {
    const [online, setOnline] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!onlineCount) return;
        setOnline(onlineCount);
        setTotal(totalCount);
    }, [onlineCount, totalCount]);

    const onPointClick = (e) => {
        const link = e.target?.data?.Link;
        if (link) {
            window.open(link, '_blank');
        }
    };

    const dataMapper = [
        { Type: 'Online', Count: online, Link: onlineLink },
        { Type: 'Offline', Count: total - online, Link: offlineLink },
    ];
    const paletteCollection = ['Green', 'Red'];

    return (
        // eslint-disable-next-line react/jsx-no-comment-textnodes
        <Paper sx={{ p: 2, mt: 0.9 }}>
            <Typography variant="h5">{title}</Typography>
            <Grid container>
                <Grid item container>
                    <PieChart
                        id={'pie' + 'online offline '}
                        dataSource={dataMapper}
                        onPointClick={onPointClick}
                        palette={paletteCollection}
                        title={'Online/Offline'}
                    >
                        <Legend visible={false} />
                        <Series argumentField="Type" valueField="Count">
                            <Label visible={false} customizeText={''}>
                                <Connector visible={false} width={1} />
                            </Label>
                        </Series>
                        <Size width={200} height={75} />
                    </PieChart>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item container xs={6}>
                    <Grid item>
                        <RadioButtonCheckedIcon style={{ color: 'green' }} />
                    </Grid>
                    <Grid item>
                        <Typography>{dataMapper[0]?.Count} Online</Typography>
                    </Grid>
                </Grid>
                <Grid item container xs={6}>
                    <Grid item>
                        <RadioButtonCheckedIcon style={{ color: 'red' }} />
                    </Grid>
                    <Grid item>
                        <Typography>{dataMapper[1]?.Count} Offline</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
