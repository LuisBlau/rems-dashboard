/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { Cloud } from '@mui/icons-material';
import axios from 'axios';
import UserContext from '../UserContext';

const EleraStats = () => {
    const context = useContext(UserContext);
    const [eleraStatsUrl, setEleraStatsUrl] = useState('')
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [filter, setFilter] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [selectedRetailer, setSelectedRetailer] = useState('');
    const [registerStats, setRegisterSCOStats] = useState({ registerUp: 0, registerDown: 0, scoUp: 0, scoDown: 0 });

    //Not pretty having to mix both context and params since they share some data that I need
    //But this seems to be the only clean way of grabbing the previously selected storeName
    var par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const params = new URLSearchParams(par);

    //Grab the store name from the url and assign. We'll use this as the default selection
    var initialStoreName = params.get('storeName');

    useEffect(() => {
        if (context?.selectedRetailer) {
            setSelectedRetailer(context.selectedRetailer);
        }
    }, [context?.selectedRetailer]);

    useEffect(() => {
        if (context?.selectedRetailer) {
            axios
                .get(`/api/REMS/retailerConfiguration?isAdmin=true&retailerId=${context?.selectedRetailer}`)
                .then(function (res) {
                    // fetch configuration info
                    const configurationArray = res.data.configuration;
                    const configurationInfo = [];
                    configurationArray.forEach(configObject => {
                        const innerArray = Object.values(configObject)[0];
                        configurationInfo.push(innerArray);
                    });
                    const urlFromDatabase = configurationInfo.find(item => item.configName === 'eleraDashboardStatsUrl').configValue;

                    //Necessary because javascript doesn't like string interpolation pulled from the db.
                    if (selectedMenuItem) {
                        const selectedStore = storeList.find(store => store.storeName === selectedMenuItem);
                        if (selectedStore) {
                            const modifiedUrl = urlFromDatabase
                                .replace(/\${store\.storeName}/g, selectedStore.storeName)
                                .replace(/\${selectedRetailer}/g, selectedRetailer);

                            setEleraStatsUrl(modifiedUrl);
                        }
                    }
                })
                .catch(function (error) {
                    console.error('Error fetching retailer configuration:', error);
                });
        }
    }, [context?.selectedRetailer, storeList, selectedMenuItem, selectedRetailer]);

    useEffect(() => {
        if (selectedRetailer !== '' && selectedRetailer !== null) {
            axios.get(`/api/REMS/stores?retailerId=${selectedRetailer}&isTenant=${context?.selectedRetailerIsTenant}`)
                .then(function (response) {
                    setStoreList(response.data);
                })
                .catch(function (error) {
                    console.error('Error fetching store list:', error);
                });
        }
    }, [context?.selectedRetailerIsTenant, selectedRetailer]);

    useEffect(() => {
        if (storeList.length > 0) {
            const defaultMenuItem = storeList.find((store) => store.storeName === initialStoreName);
            if (defaultMenuItem) {
                setSelectedMenuItem(defaultMenuItem.storeName);
                fetchRegisterSCOStats(defaultMenuItem.storeName);
            }
        }
    }, [storeList, initialStoreName]);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
        fetchRegisterSCOStats(menuItem);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    useEffect(() => {
        if (selectedMenuItem) {
            fetchRegisterSCOStats(selectedMenuItem);
        }
    }, [selectedMenuItem]);

    const fetchRegisterSCOStats = (storeName) => {
        axios
            .get(`/api/REMS/agentsForStore?storeName=${storeName}&retailerId=${selectedRetailer}`)
            .then((response) => {
                var regUp = 0;
                var regDown = 0;
                var SCOUp = 0;
                var SCODown = 0;

                for (var i = 0; i < response.data.length; i++) {
                    var obj = response.data[i];

                    //Check if the registers are Elera
                    if ((obj.status && obj.status.EleraClient && obj.status.EleraClient.configured === 'true')) {

                        // Check if the Elera registers is online or offline
                        // Have to actually spell out true or false here because undefined would be taken as false. Nice one JS
                        if (obj.online === true) {
                            regUp++;
                        } else if (obj.online === false) {
                            regDown++;
                        }

                        // Check if the Elera register is SCO or not
                        if (obj.isEleraSCO === true) {
                            SCOUp++;
                        } else if (obj.isEleraSCO === false) {
                            SCODown++;
                        }
                    }
                }

                setRegisterSCOStats({
                    registerUp: regUp,
                    registerDown: regDown,
                    scoUp: SCOUp,
                    scoDown: SCODown
                });
            })
            .catch((error) => {
                console.error('Error fetching register stats:', error);
            });
    };


    const filteredMenuItems = storeList
        .filter((store) => store.storeName.toLowerCase().includes(filter.toLowerCase()))
        .map((store) => ({
            id: store.storeName,
            label: `${store.storeName}`,
            icon: <Cloud />,
            content: (
                <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', background: '#f6f6f6' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            height: '25%',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            mb: 3,
                            background: '#f6f6f6',
                        }}
                    >
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                marginRight: 3,
                                height: '90%',
                                width: '25%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'} mb={0}>
                                ELERA Registers
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '15%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    mb: 3,
                                }}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center" mr={3}>
                                    <Typography fontSize="150%">Up</Typography>
                                    <Typography fontSize="125%">{registerStats.registerUp}</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography fontSize="150%">Down</Typography>
                                    <Typography fontSize="125%">{registerStats.registerDown}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                        <Paper
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: 5,
                                marginRight: 3,
                                height: '90%',
                                width: '25%',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            elevation={10}
                        >
                            <Typography fontSize={'175%'} fontWeight={'bold'}>
                                ELERA SCO
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    height: '25%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    mb: 3,
                                }}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center" mr={3}>
                                    <Typography fontSize="150%">Up</Typography>
                                    <Typography fontSize="125%">{registerStats.scoUp}</Typography>
                                </Box>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Typography fontSize="150%">Down</Typography>
                                    <Typography fontSize="125%">{registerStats.scoDown}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                    <iframe
                        title="Status"
                        src={eleraStatsUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                    ></iframe>
                </Box>
            ),
        }));

    const renderContent = () => {
        const selectedItem = filteredMenuItems.find((item) => item.id === selectedMenuItem);
        return selectedItem ? selectedItem.content : <div>Please select a menu item</div>;
    };

    return (
        <Box display="flex" height="100vh">

            <Box width="200px" borderRight="1px solid #ccc">
                <Box padding="10px">
                    <Typography variant="h6" textAlign="center" marginBottom="10px" fontSize="1.5rem">
                        Instances
                    </Typography>
                    <input
                        type="text"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Filter menu items"
                        style={{ width: '100%' }}
                    />
                </Box>
                <Box sx={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
                    <List component="nav">
                        {filteredMenuItems.map((menuItem) => (
                            <ListItem
                                key={menuItem.id}
                                button
                                onClick={() => handleMenuItemClick(menuItem.id)}
                                style={{
                                    backgroundColor: selectedMenuItem === menuItem.id ? '#bdbdbd' : 'inherit',
                                }}
                            >
                                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                <ListItemText primary={menuItem.label} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>

            <Box flex={1} padding="20px" display="flex" justifyContent="center">
                <Box width="70vw" maxWidth="100%">
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default EleraStats;
