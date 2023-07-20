import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import axios from 'axios';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Copyright from '../../components/Copyright';

export default function alerts() {
    const context = useContext(UserContext)
    const [alerts, setAlerts] = useState([])
    const [allAlerts, setAllAlerts] = useState([])
    const [alertTypes, setAlertTypes] = useState([])
    const [pullAlertsPeriodically, setPullAlertsPeriodically] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const [alertsEnabled, setAlertsEnabled] = useState(false)
    const [retailerIsLab, setRetailerIsLab] = useState(null)
    const [selectedRetailer, setSelectedRetailer] = useState(null)

    const columns = [
        {
            field: 'StoreNumber',
            headerName: 'Store',
            width: 100,
            sortable: true,
            sortModel: ['asc', 'desc'],
            filterable: true
        },
        {
            field: 'AgentName',
            headerName: 'Agent',
            width: 100,
            sortable: true,
            sortModel: ['asc', 'desc'],
            filterable: true
        },
        {
            field: 'AlertType',
            headerName: 'Type',
            width: 100,
            filterable: true,
            sortModel: ['asc', 'desc']
        },
        {
            field: 'AlertCurrentReading',
            headerName: 'Value',
            width: 100,
        },
        {
            field: 'AlertSeverity',
            headerName: 'Severity',
            width: 150,
            filterable: true,
            sortable: true,
            sortModel: ['asc', 'desc']
        },
        {
            field: 'AlertCollectedTime',
            headerName: 'Timestamp',
            width: 300,
            type: 'dateTime',
            sortable: true,
            sortModel: ['asc', 'desc'],
            valueGetter: (params) => new Date(params.row.AlertCollectedTime),
        },
    ];

    useEffect(() => {
        if (context.selectedRetailer && pullAlertsPeriodically > 0) {
            const interval = setInterval(() => {
                if (retailerIsLab !== null) {
                    fetchAlerts(alertTypes)
                }
            }, pullAlertsPeriodically);
            return () => clearInterval(interval);
        }
    }, [context.selectedRetailer, pullAlertsPeriodically]);

    function handleAlertTypeClicked(alertType) {
        alertTypes[_.findIndex(alertTypes, { type: alertType })].filterApplied = !alertTypes[_.findIndex(alertTypes, { type: alertType })].filterApplied
        let alertsAreFiltered = false
        let filteredAlerts = []
        alertTypes.forEach(alertType => {
            if (alertType.filterApplied === true) {
                alertsAreFiltered = true
                // add to filter 
                var localFilteredAlerts = _.filter(allAlerts, function (a) {
                    return a.AlertType == alertType.type;
                })
                filteredAlerts = _.concat(filteredAlerts, localFilteredAlerts)
            }
        });

        if (alertsAreFiltered === false) {
            setAlerts(allAlerts)
        } else {
            setAlerts(filteredAlerts)
        }
    }


    function fetchAlerts(alertTypes) {
        let url = `/api/REMS/getRsmpAlerts?retailerId=${context.selectedRetailer}`
        if (context.selectedRetailerIsTenant === true) {
            url = `/api/REMS/getRsmpAlerts?retailerId=${context.selectedRetailerParentRemsServerId}`
        }
        url = url + `&isLab=${retailerIsLab}`

        axios.get(url).then(function (res) {
            if (alertTypes === undefined) {
                let localAlertTypes = []
                res.data.forEach(alert => {
                    if (_.find(localAlertTypes, { type: alert.AlertType }) === undefined) {
                        localAlertTypes.push({ type: alert.AlertType, count: 1, filterApplied: false })
                    } else {
                        localAlertTypes[_.findIndex(localAlertTypes, { type: alert.AlertType })].count += 1
                    }
                });
                setAlertTypes(localAlertTypes)
                setAlerts(res.data)
            }
            setAllAlerts(res.data)
            setIsLoaded(true)
        })
    }

    useEffect(() => {
        if (context.selectedRetailer && context.selectedRetailerIsTenant !== null) {
            axios.get(`/api/REMS/retailerConfiguration?isAdmin=true&retailerId=${context.selectedRetailer}`).then(function (res) {
                // fetch configuration info
                const configurationArray = res.data.configuration;
                const configurationInfo = [];
                configurationArray.forEach(configObject => {
                    const innerArray = Object.values(configObject)[0];
                    configurationInfo.push(innerArray);
                });
                setRetailerIsLab(configurationInfo.find(item => item.configName === 'retailerIsLab').configValue)
                setAlertsEnabled(configurationInfo.find(item => item.configName === 'alertsEnabled').configValue)
                setPullAlertsPeriodically(configurationInfo.find(item => item.configName === 'alertsRefreshRate').configValue)
            })
        }
    }, [context.selectedRetailerIsTenant])

    useEffect(() => {
        if (selectedRetailer === null || context.selectedRetailer !== selectedRetailer) {
            setSelectedRetailer(context.selectedRetailer)
        } else {
            if (retailerIsLab !== null) {
                if (context.selectedRetailerIsTenant === false) {
                    fetchAlerts()
                } else if (context.selectedRetailerParentRemsServerId) {
                    fetchAlerts()
                }
            }
        }
    }, [context.selectedRetailer, selectedRetailer, retailerIsLab])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
                </Box>
            </GridToolbarContainer>
        );
    }

    if (isLoaded === true && alertsEnabled === true && selectedRetailer === context.selectedRetailer) {
        if (alerts.length > 0 && alertTypes.length > 0 && selectedRetailer === context.selectedRetailer) {
            return (
                <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Box sx={{ flexDirection: 'column', display: 'flex', height: '90vh', width: '20%', justifyContent: 'space-around', alignItems: 'center' }}>
                            {alertTypes.map((alert, index) => (
                                <Paper onClick={() => handleAlertTypeClicked(alert.type)} key={index} elevation={10} sx={[alert.filterApplied === false ? { margin: 1, padding: 2, width: '60%', justifyItems: 'center' } : { margin: 1, padding: 2, width: '60%', justifyItems: 'center', backgroundColor: '#ddd' }]}>
                                    <Typography variant='h6'>{alert.type} - {alert.count}</Typography>
                                </Paper>
                            ))}
                        </Box>
                        <Box sx={{ height: '90vh', width: '80%' }}>
                            <DataGrid
                                slots={{ toolbar: CustomToolbar }}
                                sx={{ margin: 2 }}
                                initialState={{
                                    sorting: {
                                        sortModel: [{ field: 'AlertCollectedTime', sort: 'desc' }]
                                    },
                                    pagination: { paginationModel: { pageSize: 25 } },
                                }}
                                rows={alerts?.map((item, key) => ({ ...item, id: key }))}
                                columns={columns}
                                pageSizeOptions={[10, 25, 50]}
                                checkboxSelection={false}
                                rowSelection={false}
                            />
                        </Box>
                    </Box>
                    <Box pt={1} pb={1}>
                        <Copyright />
                    </Box>
                </Box >
            )
        } else if (selectedRetailer !== context.selectedRetailer) {
            return (
                <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={100} />
                </Box>
            )
        }
    } else if (isLoaded === true && alertsEnabled === false && selectedRetailer === context.selectedRetailer && selectedRetailer === context.selectedRetailer) {
        return (
            <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant='h2'>Alerts Disabled</Typography>
            </Box>
        )
    } else {
        return (
            <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress size={100} />
            </Box>
        )
    }
}