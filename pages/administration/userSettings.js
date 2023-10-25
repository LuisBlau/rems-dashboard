/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import UserContext from '../UserContext';
import { Alert, AlertTitle, Button, Snackbar } from '@mui/material';
import axios from 'axios';
import Copyright from '../../components/Copyright';

export default function UserSettings() {
    /// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
    const SuccessToastDuration = 4000;
    /// Number of millisec to show Failure toast. Page does not reload after.
    const FailToastDuration = 10000;

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const context = useContext(UserContext)
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);

    useEffect(() => {
        if (context) {
            if (context.userDetails) {
                setFirstName(context.userDetails.firstName)
                setLastName(context.userDetails.lastName)
                setEmail(context.userDetails.email)
            }
        }
    }, [context])

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value)
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value)
    }

    function handleSubmitMap() {
        const mapParams = {
            userMapZoom: 3,
            userMapCenter: {
                lat: 38.8097343,
                lng: -90.5556199,
            }
        }

        axios.post(`/api/user/settingsSubmission`, { email, firstName, lastName, userDefinedMapConfig: '' })
            .then(res => {
                context.setUserDetails({
                    ...context.userDetails,
                    userDefinedMapConfig: ''
                });

                setToastSuccess('Map View Reset successfully');
                setOpenSuccess(true);
                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(err => {
                setToastSuccess('Error Resetting map view');
                setOpenSuccess(true);

                console.log('Error:', err);
            });
    }

    function handleSubmit() {
        axios.post('/api/user/settingsSubmission', { email, firstName, lastName })
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure("Error Saving User Info!");
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess("User Info Successfully Saved.");
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure("Error connecting to server!!");
                setOpenFailure(true);
            });
    }

    return (
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2">
                User Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh', width: '90%', margin: 1 }}>
                <Typography variant="h4">{'Account: ' + email}</Typography>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h5" sx={{ marginRight: 1, alignSelf: 'center' }}>First Name: </Typography>
                    <TextField onChange={handleFirstNameChange} value={firstName} />
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h5" sx={{ marginRight: 1, alignSelf: 'center' }}>Last Name: </Typography>
                    <TextField onChange={handleLastNameChange} value={lastName} />
                </Box>
                <Button onClick={handleSubmit} sx={{ width: '5%', margin: 2, alignSelf: 'center' }} variant='contained'>Save</Button>
                <Button onClick={handleSubmitMap} sx={{ width: '20%', margin: 2, alignSelf: 'center' }} variant='contained'>Reset Map View</Button>


            </Box>
            <Copyright />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSuccess}
                autoHideDuration={SuccessToastDuration}
                onClose={(event) => {
                    setOpenSuccess(false);
                }}
            >
                <Alert variant="filled" severity="success">
                    <AlertTitle>Success</AlertTitle>
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
                    <AlertTitle>Error</AlertTitle>
                    {toastFailure}
                </Alert>
            </Snackbar>
        </Box>
    )
}