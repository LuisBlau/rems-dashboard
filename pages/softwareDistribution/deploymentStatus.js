/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
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
import { FormControl, IconButton, InputLabel, OutlinedInput } from '@mui/material';
import { Clear } from '@mui/icons-material';

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

    const handleClearClick = () => {
        setPackageFilter('');
    };

    if (selectedRetailer !== '') {
        return (
            <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ width: 200 }} id="package-input-label">Package Filter</InputLabel>
                <Select
                    endAdornment={<IconButton sx={{ visibility: packageFilter ? "visible" : "hidden" }} onClick={handleClearClick}><Clear /></IconButton>}
                    value={packageFilter}
                    labelId="Package-input-label"
                    id="select-type"
                    label="Package Filter"
                    onChange={changePackageFilter}
                    input={<OutlinedInput label="Package Filter" />}
                >
                    {packageFilterItems.map((i, index) => (
                        <MenuItem key={'mi-' + index} value={i.name}>
                            {i.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    } else {
        return null
    }
}

export default function DeploymentStatus() {
    // Max number of records to pull from database. 0 = all records.
    // we need to paginate this page at some point, but not today.
    const maxRecords = 0;

    const [storeFilter, setStoreFilter] = useState('');
    const [packageFilterItems, setPackageFilterItems] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [statusFilterItems, setStatusFilterItems] = useState([]);
    const context = useContext(UserContext)
    const [packageFilter, setPackageFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (context.selectedRetailer) {
                if (context.selectedRetailerIsTenant === false) {
                    setIsLoading(true)
                    axios.get('/api/REMS/deploy-configs?retailerId=' + context.selectedRetailer)
                        .then((resp) => setPackageFilterItems(resp.data));
                    setStatusFilterItems([
                        { id: 'Pending', name: 'Pending' },
                        { id: 'Failed', name: 'Failed' },
                        { id: 'Success', name: 'Success' },
                        { id: 'Cancel', name: 'Cancelled' },
                    ]);
                } else if (context.selectedRetailerParentRemsServerId) {
                    setIsLoading(true)
                    axios.get('/api/REMS/deploy-configs?retailerId=' + context.selectedRetailerParentRemsServerId + '&tenantId=' + context.selectedRetailer)
                        .then((resp) => setPackageFilterItems(resp.data));
                    setStatusFilterItems([
                        { id: 'Pending', name: 'Pending' },
                        { id: 'Failed', name: 'Failed' },
                        { id: 'Success', name: 'Success' },
                        { id: 'Cancel', name: 'Cancelled' },
                    ]);
                }
            }
        }
    }, [context])

    if (packageFilterItems == null) {
        return 'loading . . .';
    }
    const changeStoreFilter = (e) => {
        setStoreFilter(e.target.value);
    };

    const changeStatusFilter = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleClearClick = () => {
        setStatusFilter('');
    };

    return (
        <Root className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
                <Typography align="center" variant="h3">
                    Deployment Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: 2, justifyContent: 'space-around' }}>
                    {/* <TextField value={storeFilter} onChange={changeStoreFilter} label="Store/Agent Filter" />
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel sx={{ width: 200 }} id="status-input-label">Status Filter</InputLabel>
                        <Select
                            endAdornment={<IconButton sx={{ visibility: statusFilter ? "visible" : "hidden" }} onClick={handleClearClick}><Clear /></IconButton>}
                            value={statusFilter}
                            labelId="status-input-label"
                            id="simple-select-status"
                            label="Status Filter"
                            input={<OutlinedInput label="Status Filter" />}
                            onChange={changeStatusFilter}
                        >
                            {statusFilterItems.map((i, index) => (
                                <MenuItem key={index} value={i.id}>
                                    {i.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <PackageFilterItemsDisplay
                        selectedRetailer={context.selectedRetailer}
                        packageFilterItems={packageFilterItems}
                        packageFilter={packageFilter}
                        setPackageFilter={setPackageFilter} /> */}
                </Box>
                <DeployTable
                    selectedRetailer={context.selectedRetailer}
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
