/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { FormControlLabel, Switch, Button } from '@mui/material';
import axios from 'axios';

export default function StoreAlerts({ alerts, updateAlerts }) {
    const [storeAlerts, setAlerts] = useState(alerts);

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

    const handleNotificationStatusChange = (id) => {
        // Determine the newStatus based on the updated alertAcknowledged
        const alertToUpdate = alerts.find((alert) => alert._id === id);
        alertToUpdate.alertAcknowledged = alertToUpdate.alertAcknowledged === true ? false : true;
        alertToUpdate.dateTimeFlagged = alertToUpdate.alertAcknowledged === true ? new Date() : null;

        // Make the Axios request to update the alertAcknowledged
        axios.put(`/api/alerts/${id}`, {
            alertAcknowledged: alertToUpdate.alertAcknowledged,
            dateTimeFlagged: alertToUpdate.dateTimeFlagged,
        })
            .then((response) => {
                if (response.status === 200) {
                    var updatedAlerts;
                    if (alertToUpdate.alertAcknowledged === "Flagged") {
                        // Update the storeAlert record with the values of alertToUpdate
                        updatedAlerts = alerts.map((alert) =>
                            alert._id === id ? { ...alert, alertAcknowledged: alertToUpdate.alertAcknowledged, dateTimeFlagged: alertToUpdate.dateTimeFlagged.toISOString() } : alert
                        );
                    } else {
                        // Update the storeAlert record with the values of alertToUpdate
                        updatedAlerts = alerts.map((alert) =>
                            alert._id === id ? { ...alert, alertAcknowledged: alertToUpdate.alertAcknowledged, dateTimeFlagged: alertToUpdate.dateTimeFlagged } : alert
                        );
                    }

                    // Update the state with the modified list
                    setAlerts(updatedAlerts);

                    //Let the storeOverview know
                    updateAlerts(updatedAlerts)
                } else if (response.status === 204) {
                    console.log('No matching document found', response.data);
                } else {
                    console.error('Error updating alertAcknowledged', response.data);
                }
            })
            .catch((error) => {
                console.error('Request error:', error);
            });
    };

    const handleCreateSNOWButtonClick = (row) => {
        alert("This feature is under development");
    };

    const formatTimeRemaining = (timestamp) => {
        if (timestamp === null || timestamp === undefined) {
            return;
        }

        const currentDate = new Date();
        const date = new Date(timestamp);
        const threeDaysLater = new Date(date);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);

        const timeDifference = threeDaysLater - currentDate;

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
            field: 'alertAcknowledged',
            headerName: 'Acknowledged',
            width: 100,
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={params.row.alertAcknowledged === true}
                            onChange={() => handleNotificationStatusChange(params.row._id)}
                        />
                    }
                    label={params.row.alertAcknowledged}
                />
            )
        },
        {
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
        },
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={storeAlerts} getRowId={(row) => row._id} columns={columns} />
        </div>
    );
}
