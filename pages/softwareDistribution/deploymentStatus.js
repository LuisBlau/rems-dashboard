/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Copyright from '../../components/Copyright';
import { DeployTable } from '../../components/Tables/DeployTable';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../pages/UserContext'

const PREFIX = 'deploymentStatus';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

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
}));

function PackageFilterItemsDisplay({ selectedRetailer, packageFilterItems, setPackageFilter, packageFilter }) {

    const changePackageFilter = (e) => {
        setPackageFilter(e.target.value);
    };

    if (selectedRetailer !== '') {
        return (
            <Grid item xs={4}>
                <Select
                    value={packageFilter}
                    labelId="demo-simple-select-label-type"
                    id="demo-simple-select-type"
                    label="Type"
                    onChange={changePackageFilter}
                >
                    {packageFilterItems.map((i, index) => (
                        <MenuItem key={'mi-' + index} value={i.id}>
                            {i.name}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>
        )
    } else {
        return null
    }

}

export default function DeploymentStatus() {
    // Max number of records to pull from database. 0 = all records.
    const maxRecords = 20;

    const [storeFilter, setStoreFilter] = useState('');
    const [packageFilterItems, setPackageFilterItems] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [statusFilterItems, setStatusFilterItems] = useState(null);
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [packageFilter, setPackageFilter] = useState(0);

    useEffect(() => {
        if (context) {
            setSelectedRetailer(context.selectedRetailer)
        }
    }, [context])
    useEffect(() => {
        if (selectedRetailer !== '') {
            axios
                .get('/api/REMS/deploy-configs?retailerId=' + selectedRetailer)
                .then((resp) => setPackageFilterItems([{ id: 0, name: 'All Configs' }].concat(resp.data)));
            setStatusFilterItems([
                { id: 'All', name: 'All Status' },
                { id: 'Pending', name: 'Pending' },
                { id: 'Failed', name: 'Failed' },
                { id: 'Success', name: 'Success' },
                { id: 'Cancel', name: 'Cancelled' },
            ]);
        }
    }, [selectedRetailer]);
    if (packageFilterItems == null) {
        return 'loading . . .';
    }
    const changeStoreFilter = (e) => {
        setStoreFilter(e.target.value);
    };

    const changeStatusFilter = (e) => {
        setStatusFilter(e.target.value);
    };

    return (
        <Root className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
                <Typography align="center" variant="h3">
                    Deployment Status
                </Typography>
                <Box pt={2}>
                    <Grid container spacing={4}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={3}>
                            <TextField value={storeFilter} onChange={changeStoreFilter} label="store" />
                        </Grid>
                        <Grid item xs={2}>
                            <Select
                                value={statusFilter}
                                labelId="demo-simple-select-label-status"
                                id="demo-simple-select-status"
                                label="Type"
                                onChange={changeStatusFilter}
                            >
                                {statusFilterItems.map((i, index) => (
                                    <MenuItem key={index} value={i.id}>
                                        {i.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <PackageFilterItemsDisplay
                            selectedRetailer={selectedRetailer}
                            packageFilterItems={packageFilterItems}
                            packageFilter={packageFilter}
                            setPackageFilter={setPackageFilter} />
                    </Grid>
                </Box>
                <DeployTable
                    selectedRetailer={selectedRetailer}
                    storeFilter={storeFilter}
                    packageFilter={packageFilter}
                    maxRecords={maxRecords}
                    statusFilter={statusFilter}
                />
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
