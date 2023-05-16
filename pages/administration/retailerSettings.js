import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import _ from 'lodash';
import UserContext from '../UserContext';
import { Tabs, Tab } from '@mui/material';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const SuccessToastDuration = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const FailToastDuration = 10000;

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ConfigItemValueDisplay({ configItem, allConfigItems, setConfigurationItems }) {
    const [val, setVal] = useState(configItem.configValue || null)

    const handleValueChange = (event) => {
        const objectToUpdate = _.find(allConfigItems, x => x.configName === configItem.configName)
        if (configItem.configValueType === 'numeric') {
            _.set(objectToUpdate, 'configValue', Number(event.target.value))
        } else {
            _.set(objectToUpdate, 'configValue', event.target.value)
        }
        setVal(event.target.value)
        setConfigurationItems(allConfigItems)
    }

    if (configItem.configValueType === 'numeric') {
        return (
            <TextField type="number" value={val} onChange={handleValueChange}></TextField>
        )
    } else if (configItem.configValueType === 'boolean') {
        return (
            <Select
                onChange={handleValueChange}
                value={val || false}
                autoWidth>
                <MenuItem value={true}>
                    true
                </MenuItem>
                <MenuItem value={false}>
                    false
                </MenuItem>
            </Select>
        )
    } else if (configItem.configValueType === 'string') {
        return (
            <TextField defaultValue={val} onChange={handleValueChange}></TextField>
        )
    } else {
        return null
    }
}

export default function RetailerSettings() {
    const [configurationItems, setConfigurationItems] = useState([])
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [category, setCategory] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [pageLoaded, setPageLoaded] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post(`/api/REMS/retailerConfigurationUpdate?retailerId=${selectedRetailer}`, configurationItems)
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure('Error Saving Configuration!');
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Configuration Successfully Saved.');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };
    useEffect(() => {
        let url = ''
        if (context) {
            if (context.selectedRetailer) {
                setSelectedRetailer(context.selectedRetailer)
                if (context.userRoles.includes('toshibaAdmin') && context.userRoles.includes('commandCenterViewer')) {
                    url = `/api/REMS/retailerConfiguration?isAdmin=true&ccv=true&retailerId=${context.selectedRetailer}`
                } else if (context.userRoles.includes('toshibaAdmin')) {
                    url = `/api/REMS/retailerConfiguration?isAdmin=true&retailerId=${context.selectedRetailer}`
                } else if (context.userRoles.includes('commandCenterViewer')) {
                    url = `/api/REMS/retailerConfiguration?ccv=true&retailerId=${context.selectedRetailer}`
                } else {
                    url = `/api/REMS/retailerConfiguration?&retailerId=${context.selectedRetailer}`
                }
            }
        }
        if (url !== '') {
            axios.get(url).then(function (res) {
                const configItems = [];
                if (res.data !== null && Object.keys(res.data).length > 0) {
                    res.data.configuration.forEach((value) => {
                        configItems.push(Object.values(value)[0]);
                    });
                    const configItemsByCategory = _.groupBy(configItems, 'configCategory');
                    let tabCategory = Object.keys(configItemsByCategory);
                    setPageLoaded(true)
                    setCategory(tabCategory);
                    setConfigurationItems(configItems);
                    setActiveCategory(configItems?.[0]?.configCategory)
                }
            });
        }
    }, [context])

    if (Object.keys(configurationItems)?.length > 0 && pageLoaded) {
        return (
            <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h2">
                    Retailer Configuration
                </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeCategory}>
                        {category.map((item, key) => <Tab key={key} value={item} onClick={() => setActiveCategory(item)} label={item} {...a11yProps(key)} />
                        )}
                    </Tabs>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {activeCategory &&
                        configurationItems.filter(c => c.configCategory === activeCategory).map((element) => (
                            <Paper key={element.configName} elevation={10} sx={{ display: 'flex', margin: 3, padding: 2, alignItems: 'center', width: 500 }}>
                                <Typography sx={{ marginRight: 1 }} fontWeight='bold'>{element.configDisplay}</Typography>
                                <ConfigItemValueDisplay configItem={element} setConfigurationItems={setConfigurationItems} allConfigItems={configurationItems} />
                            </Paper>
                        ))
                    }
                </Box>
                <Button onClick={handleSubmit} variant="contained">
                    Submit
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSuccess}
                    autoHideDuration={SuccessToastDuration}
                    onClose={(event) => {
                        setOpenSuccess(false);
                    }}
                >
                    <Alert variant="filled" severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        {toastSuccess}
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openFailure}
                    autoHideDuration={FailToastDuration}
                    onClose={(event) => {
                        setOpenFailure(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Error!!!</AlertTitle>
                        {toastFailure}
                    </Alert>
                </Snackbar>
            </Box>
        )
    } else if (pageLoaded) {
        return (
            <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h2">
                    Retailer Configuration
                </Typography>
                <Typography sx={{ marginTop: 10 }} variant="h4"> No configurations found, contact an administrator</Typography>
            </Box>
        )
    } else {
        return null
    }
}