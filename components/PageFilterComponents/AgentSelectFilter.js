/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import 'rsuite/dist/rsuite.min.css';
import { TreePicker } from 'rsuite';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FormControlLabel, Paper, styled, Switch } from '@mui/material';

const PREFIX = 'agents';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`,
};

const Input = styled('input')({
    display: 'none',
});

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    },
}));

export default function AgentSelectFilter({
    storeOnlyView,
    handleStoreOnlyViewSwitch,
    versionData,
    selectedVersion,
    setSelectedVersion,
    handleSelectedVersionChanged,
    existingListIsSelected,
}) {
    return (
        <Root>
            <Paper elevation={5} className={classes.paper}>
                <Grid container direction={'column'} spacing={1}>
                    <Grid item xs={2.5}>
                        <Typography fontWeight={'bold'} fontSize={'large'}>
                            Filters:
                        </Typography>
                    </Grid>
                    <Grid item xs={2.5}>
                        <FormControlLabel
                            label="Store Only View"
                            control={
                                <Switch
                                    disabled={existingListIsSelected}
                                    checked={storeOnlyView}
                                    onClick={handleStoreOnlyViewSwitch}
                                    color="success"
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TreePicker
                            placement="bottomEnd"
                            onChange={(val) => {
                                handleSelectedVersionChanged(val, setSelectedVersion);
                            }}
                            data={versionData}
                            style={{
                                width: 246,
                            }}
                            value={selectedVersion}
                            placeholder="Software Version"
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Root>
    );
}
