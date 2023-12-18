import React, { useState, useEffect, useContext } from 'react';
import { Alert, AlertTitle, Box, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { CloseOutlined, Cloud } from '@mui/icons-material';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import UserContext from '../UserContext';
import { Button } from '@mui/base';
import { Snackbar, SnackbarContent } from '@mui/material';
import { useRouter } from 'next/router';

const EleraHealth = () => {
    const context = useContext(UserContext);
    const [eleraHealthUrl, setEleraHealthUrl] = useState('');
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [filter, setFilter] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [selectedRetailer, setSelectedRetailer] = useState('');
    const [containerData, setContainerData] = useState([]); // State for container data
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
    const { replace } = useRouter();

    var par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const params = new URLSearchParams(par);

    var initialStoreName = params.get('storeName');

    useEffect(() => {
        if (context?.selectedRetailer) {
            setSelectedRetailer(context.selectedRetailer);
        }
    }, [context?.selectedRetailer]);

    useEffect(() => {
        if (context?.retailerConfigs.length > 0 && context?.selectedRetailer) {
            const configurationArray = context.retailerConfigs;
            const configurationInfo = [];
            configurationArray.forEach(configObject => {
                const innerArray = Object.values(configObject)[0];
                configurationInfo.push(innerArray);
            });

            if (selectedMenuItem) {
                const selectedStore = storeList.find(store => store.storeName === selectedMenuItem);
                if (selectedStore) {
                    const urlFromDatabase = configurationInfo.find(item => item.configName === 'eleraDashboardHealthUrl').configValue;
                    const modifiedUrl = urlFromDatabase
                        .replace(/\${storeName}/g, selectedStore.storeName)
                        .replace(/\${selectedRetailer}/g, selectedRetailer);
                    setEleraHealthUrl(modifiedUrl);
                }
            }
        }
    }, [context?.selectedRetailer, storeList, selectedMenuItem, selectedRetailer]);

    useEffect(() => {
        if (selectedRetailer !== '' && selectedRetailer !== null) {
            axios.get(`/api/stores/getForRetailer?retailerId=${selectedRetailer}&isTenant=${context?.selectedRetailerIsTenant}`)
                .then(function (response) {
                    setStoreList(response.data);
                })
                .catch(function (error) {
                    console.log('Error fetching store list:', error);
                });
        }
    }, [context?.selectedRetailerIsTenant, selectedRetailer]);

    useEffect(() => {
        if (storeList.length > 0) {
            const defaultMenuItem = storeList.find((store) => store.storeName === initialStoreName);
            if (defaultMenuItem) {
                setSelectedMenuItem(defaultMenuItem.storeName);
            }
        }
    }, [storeList, initialStoreName]);

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
        const findMenu = storeList.find(x => x.storeName?.toLowerCase() === menuItem?.replace("/%20/g","")?.toLowerCase());

        replace(`/store/eleraHealth?storeName=${menuItem}&retailer_id=${selectedRetailer}&agentName=${findMenu?.agentName ?? ''}`);
        if (!findMenu?.agentName) {
            setSnackbarOpen(true);
            setSnackbarSeverity('danger')
            setSnackbarMessage('No agentname found');
            setContainerData([])
            return false;
        }

        // Fetch container data when a new store is selected
        axios.get(`/api/REMS/getContainerInformationForStoreAgent?storeName=${menuItem}&retailerId=${selectedRetailer}&agentName=${findMenu?.agentName}`)
            .then((resp) => {
                if (resp.data && resp.data.docker) {
                    const arr = Object.values(resp.data.docker);
                    const rows = [];
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = JSON.parse(arr[i]);
                        arr[i].Names = arr[i].Names.replace(/\/|\[|\]/g, '');
                        if (arr[i].Names.includes('elera') || arr[i].Names.includes('mongo') || arr[i].Names.includes('nginx') || arr[i].Names.includes('rabbitmq') || arr[i].Names.includes('tgcp')) {
                            if (arr[i].Names.includes('elera') || arr[i].Names.includes('tgcp')){
                                rows.push(
                                    objectifyRow(
                                        i + 1,
                                        arr[i].Names,
                                        arr[i].Read,
                                        arr[i].State,
                                        arr[i].Status
                                    )
                                );
                            }
                        }
                    }
                    setContainerData(rows);
                } else {
                    // Handle the case where resp.data is empty or doesn't contain the expected data
                    setContainerData([]); // Clear the container data or set it to an appropriate default value
                }
            })
            .catch(function (error) {
                console.log('Error fetching container data:', error);
            });
    };



    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredMenuItems = storeList
        .filter((store) => store.storeName.toLowerCase().includes(filter.toLowerCase()))
        .map((store) => ({
            id: store.storeName,
            label: `${store.storeName}`,
            icon: <Cloud />,
        }));

    useEffect(() => {
        if (selectedRetailer && initialStoreName && storeList?.length > 0) {
            handleMenuItemClick(initialStoreName);
        }
    }, [selectedRetailer, initialStoreName,storeList]);

    const columns = [
        {
            field: 'name',
            headerName: 'Container Name',
            flex: 1
        },
        {
            field: 'lastupd',
            headerName: 'Last Updated',
            sortable: true,
            filterable: true,
            type: 'dateTime',
            valueGetter: (params) => new Date(params.row.lastupd),
            flex: 1
        },
        {
            field: 'state',
            headerName: 'Status',
            flex: 1
        },
        {
            field: 'uptime',
            headerName: 'Up Time',
            flex: 1
        },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: (data) => {
                return data?.row?.state == 'running' ? <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleStop(data?.row)}
                        style={{ marginRight: '20px' }}
                    >Stop</Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRestart(data?.row)}
                    >
                        Restart
                    </Button>
                </div> :
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleStart(data?.row)}
                        >Start</Button>
                    </div>
            }
        },
    ];

    const handleStop = (data) => {
        const message = `Request to STOP the container ${data.name} sent successfully`;
        const formData = {
            retailer_id: params.get('retailer_id'),
            store: params.get('storeName'),
            agent: params.get('agentName'),
            container: data.name,
            command: 'stop'

        }
        axios.post(`/api/registers/controlProcess`, formData)
            .then(function (resp) {
                setSnackbarMessage(message);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch(function (error) {
                setSnackbarMessage("Request failed");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    }
    const handleRestart = (data) => {
        const message = `Request to RESTART the container ${data.name} sent successfully`;
        const formData = {
            retailer_id: params.get('retailer_id'),
            store: params.get('storeName'),
            agent: params.get('agentName'),
            container: data.name,
            command: 'restart'

        }
        axios.post(`/api/registers/controlProcess`, formData)
            .then(function (resp) {
                setSnackbarMessage(message);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch(function (error) {
                setSnackbarMessage("Request failed");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });
    }

    const handleStart = (data) => {
        const message = `Request to START the container ${data.name} sent successfully`;
        const formData = {
            retailer_id: params.get('retailer_id'),
            store: params.get('storeName'),
            agent: params.get('agentName'),
            container: data.name,
            command: 'start'
        }
        axios.post(`/api/registers/controlProcess`, formData)
            .then(function (resp) {
                setSnackbarMessage(message);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            })
            .catch(function (error) {
                setSnackbarMessage("Request failed");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            });

    }

    const objectifyRow = (id, name, lastupd, state, uptime) => {
        return { id, name, lastupd, state, uptime };
    };
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSnackbarOpen(false)}
            >
                <CloseOutlined fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Box display="flex" height="100vh" width="80vw">
            <Box width="200px" borderRight="1px solid #ccc">
                <Box padding="10px">
                    <Typography variant="h6" textAlign="center" marginBottom="10px" fontSize="1.5rem">
                        Stores
                    </Typography>
                    <input
                        type="text"
                        value={filter}
                        onChange={handleFilterChange}
                        placeholder="Filter stores"
                        style={{ width: '100%' }}
                    />
                </Box>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    action={action}
                    message={snackbarMessage}
                    ContentProps={{
                        sx:{
                            background: snackbarSeverity === 'success' ? 'green' : 'red',
                        }
                    }}
                />

                <Box sx={{ minHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
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
            <Box flex={1} padding="20px" display="flex" flexDirection="column">
                <Typography variant="h5" textAlign="center" marginBottom="10px" fontSize="1.5rem">
                    Elera Microservices Status
                </Typography>
                <div>
                    <DataGrid
                        rows={containerData}
                        columns={columns}
                        pageSize={5}
                        autoHeight
                    />
                </div>

                <iframe
                    title="Elera Health"
                    src={eleraHealthUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                ></iframe>
            </Box>
        </Box>
    );
};

export default EleraHealth;
