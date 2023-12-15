/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FormControlLabel, Switch, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

export default function StoreAlerts({ alerts, updateAlerts, ma, retailerConfig }) {
    const [storeAlerts, setAlerts] = useState(alerts);
    const [b2benabled, setB2BEnabled] = useState(false);

    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' or 'error'
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarState({
            ...snackbarState,
            open: false,
        });
    };

    useEffect(() => {
        // Map alerts to apply the formatTimeAgo function
        const formattedAlerts = alerts.map((alert) => ({
            ...alert,
            dateTimeReceived: formatTimeAgo(alert.dateTimeReceived),
            dateTimeFlagged: formatTimeRemaining(alert.dateTimeFlagged)
        }));

        // Set the state with the formatted alerts
        setAlerts(formattedAlerts);
    }, [alerts]);

    useEffect(() => {
        const b2benabled = retailerConfig.find(item => item.configName === 'b2b_subscription_active').configValue;
        setB2BEnabled(b2benabled);

        //TODO: DO NOT FORGET TO REMOVE THIS LINE AFTER TESTING!!!
        setB2BEnabled(true);

    }, [retailerConfig])

    const handleNotificationStatusChange = (id) => {
        // Determine the newStatus based on the updated alertKeep
        const alertToUpdate = alerts.find((alert) => alert._id === id);
        alertToUpdate.alertKeep = alertToUpdate.alertKeep === true ? false : true;
        alertToUpdate.dateTimeFlagged = alertToUpdate.alertKeep === false ? new Date() : null;

        // Make the Axios request to update the alertKeep
        axios.put(`/api/alerts/${id}`, {
            alertKeep: alertToUpdate.alertKeep,
            dateTimeFlagged: alertToUpdate.dateTimeFlagged,
        })
            .then((response) => {
                if (response.status === 200) {
                    var updatedAlerts;
                    if (alertToUpdate.alertKeep === false) {
                        // Update the storeAlert record with the values of alertToUpdate
                        updatedAlerts = alerts.map((alert) =>
                            alert._id === id ? { ...alert, alertKeep: alertToUpdate.alertKeep, dateTimeFlagged: alertToUpdate.dateTimeFlagged.toISOString() } : alert
                        );
                    } else {
                        // Update the storeAlert record with the values of alertToUpdate
                        updatedAlerts = alerts.map((alert) =>
                            alert._id === id ? { ...alert, alertKeep: alertToUpdate.alertKeep, dateTimeFlagged: alertToUpdate.dateTimeFlagged } : alert
                        );
                    }

                    // Update the state with the modified list
                    setAlerts(updatedAlerts);

                    //Let the storeOverview know
                    updateAlerts(updatedAlerts)
                } else if (response.status === 204) {
                    console.log('No matching document found', response.data);
                } else {
                    console.error('Error updating alertKeep', response.data);
                }
            })
            .catch((error) => {
                console.error('Request error:', error);
            });
    };

    const getEnvironment = () => {
        var url = '';
        if (typeof window !== 'undefined') {
            url = window.location.origin;
        }

        if (url.includes("localhost")) {
            return "test";
        }
        else if (url.includes("test")) {
            return "test";
        } else {
            return "prod";
        }
    }

    const handleCreateSNOWButtonClick = async (row) => {
        //Get the environment. I might need to parse the url here
        const environment = getEnvironment();

        const delimitedAgentName = ma.agentName.split('-');
        const maSysId = delimitedAgentName[1];

        const epochTime = new Date().getTime();
        const dataToHash = ma.agentName + row.retailer_id + row.store + epochTime;

        const eleraPlatformVersion = ma.versions.find(i => i.Name.includes("ELERA Platform Version")).Version;
        const eleraUIVersion = ma.versions.find(i => i.Name.includes("ELERA UI Version")).Version;
        const eleraTerminalVersion = ma.versions.find(i => i.Name.includes("ELERA Terminal Services")).Version;
        const eleraClientDbrokerVersion = ma.versions.find(i => i.Name.includes("ELERA Client DBroker AddOns")).Version;
        const eleraPayVersion = ma.versions.find(i => i.Name.includes("ELERA Pay Version")).Version;
        const eleraAdminVersion = ma.versions.find(i => i.Name.includes("ELERA Administration UI")).Version;
        const eleraControllerVersion = ma.versions.find(i => i.Name.includes("ELERA Controller Services")).Version;

        var reqId;
        //This is async, so we need to act on it when it returns the promise
        await getHash(dataToHash).then((hashedResult) => {
            reqId = hashedResult;
        });

        //Create the basic XML
        const incidentData = {
            lz_payload: {
                lz_element: [
                    {
                        retailer_id: row.retailer_id,
                        store_id: row.store,
                        system_id: maSysId,
                        request_id: reqId,
                        data: {
                            Event: {
                                Message: row.alertName + ": " + row.reason,
                                Severity: 1,
                                TimeStamp: epochTime,
                                Array: {
                                    numRecs: "2",
                                    type: "Qualifier",
                                    Qualifier: ["Retail", "OS04690"]
                                },
                                OriginatingMO: {
                                    _attributes: {
                                        deviceType: ma.deviceType,
                                        agentID: ma.agentName,
                                        systemID: maSysId,
                                        agentType: "Master Agent",
                                        mgmtPort: "",
                                        agentVersion: "",
                                        storeID: ma.storeName,
                                        IPAddress: ma.ipaddress,
                                        deviceID: maSysId,
                                        eleraPlatformVersion: eleraPlatformVersion,
                                        eleraPayVersion: eleraPayVersion,
                                        eleraUIVersion: eleraUIVersion,
                                        eleraTerminalVersion: eleraTerminalVersion,
                                        eleraClientDbrokerVersion: eleraClientDbrokerVersion,
                                        eleraAdminVersion: eleraAdminVersion,
                                        eleraControllerVersion: eleraControllerVersion
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        };


        axios.post(`/api/snow/createevent?environment=${environment}`, incidentData)
            .then(response => {
                // Open success toast notification
                setSnackbarState({
                    open: true,
                    message: 'SNOW event created successfully',
                    severity: 'success',
                });
            })
            .catch(error => {
                // Open error toast notification
                setSnackbarState({
                    open: true,
                    message: 'Error creating SNOW event',
                    severity: 'error',
                });

            }).finally(() => {
                //Nothing for now
            });
    };

    async function getHash(data) {
        try {
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(data);

            const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashString = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

            return hashString;
        } catch (e) {
            console.error('Unable to create hash:', e.message);
            return null;
        }
    }

    const formatTimeRemaining = (timestamp) => {
        if (timestamp === null || timestamp === undefined) {
            return;
        }

        const currentDate = new Date();
        const date = new Date(timestamp);
        const sevenDaysLater = new Date(date);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

        const timeDifference = sevenDaysLater - currentDate;

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 1) {
            return `${days} days, ${hours % 24} hours`;
        } else if (hours >= 1) {
            return `${hours} hours, ${minutes % 60} minutes`;
        } else if (minutes >= 1) {
            return `${minutes} minutes, ${seconds % 60} seconds`;
        } else if (seconds > 0) {
            return `${seconds} seconds`;
        } else {
            return 'Flagged for removal today';
        }
    };

    const formatTimeAgo = (timestamp) => {
        if (timestamp === null || timestamp === undefined) {
            return;
        }

        // Regular expression to match the various time formats
        const timeAgoRegex = /^(\d+)\s(seconds|minutes|hours|days)\sago$/;
        const match = timestamp.match(timeAgoRegex);

        if (match) {
            // If it matches the format, return the timestamp as is
            return timestamp;
        }

        // If it doesn't match the format, proceed with the conversion logic
        const currentDate = new Date();
        const date = new Date(timestamp);
        const timeDifference = currentDate - date;

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 1) {
            return `${days} days ago`;
        } else if (hours > 1) {
            return `${hours} hours ago`;
        } else if (minutes > 1) {
            return `${minutes} minutes ago`;
        } else {
            return `${seconds} seconds ago`;
        }
    }

    const columns = [
        { field: 'dateTimeReceived', headerName: 'Received', width: 100 },
        { field: 'dateTimeFlagged', headerName: 'Time To Deletion', width: 150 },
        { field: 'alertName', headerName: 'Alert Name', width: 150 },
        { field: 'reason', headerName: 'Reason', width: 500 },
        {
            field: 'alertKeep',
            headerName: 'Keep',
            width: 100,
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={params.row.alertKeep === true}
                            onChange={() => handleNotificationStatusChange(params.row._id)}
                        />
                    }
                    label={params.row.alertKeep}
                />
            )
        }
    ];

    const sortModel = [
        {
            field: 'dateTimeReceived',
            sort: 'asc'
        },
    ];

    if (b2benabled) {
        columns.push({
            field: 'createSNOW',
            headerName: 'SNOW Incident',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCreateSNOWButtonClick(params.row)}
                >
                    Open SNOW Ticket
                </Button>
            ),
        });
    }

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={storeAlerts} getRowId={(row) => row._id} columns={columns} sortModel={sortModel} />
            <Snackbar
                open={snackbarState.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ marginTop: 50, marginLeft: 10 }}
            >
                <Alert elevation={6} variant="filled" severity={snackbarState.severity}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
