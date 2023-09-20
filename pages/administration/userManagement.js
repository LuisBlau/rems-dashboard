import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import _ from 'lodash';
import { Alert, AlertTitle, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import axios from 'axios';
import UserContext from '../../pages/UserContext';

export default function UserSettings() {

    /// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
    const SuccessToastDuration = 4000;
    /// Number of millisec to show Failure toast. Page does not reload after.
    const FailToastDuration = 10000;
    const context = useContext(UserContext);

    const [retailers, setRetailers] = useState([])
    const [selectedRetailer, setSelectedRetailer] = useState(null)
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedUsersRoles, setSelectedUsersRoles] = useState([])
    const [availableRoles, setAvailableRoles] = useState([])
    const [selectedUsersRetailers, setSelectedUsersRetailers] = useState([])
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [newUserDialogOpen, setNewUserDialogOpen] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    useEffect(() => {

        axios.get('/api/retailers/getAllDetails').then(function (response) {
            let tempResponse = response.data
            tempResponse.push({ description: 'All' })
            tempResponse = _.sortBy(tempResponse, ['description'])
            setRetailers(tempResponse)
        });

        axios.get('/api/user/getAllUserDetails').then(function (response) {
            let localUsers = _.sortBy(response.data, ['email'])
            setUsers(localUsers)
            setFilteredUsers(localUsers)
            const roles = []
            roles.push({ name: 'Administrator', isChecked: false })
            localUsers.forEach(user => {
                if ((user.role).length > 0) {
                    (user.role).forEach(role => {
                        if (!_.some(roles, x => x.name === role)) {
                            roles.push({ name: role, isChecked: false })
                        }
                    });
                }
            });
            setAvailableRoles(roles)
        })

    }, [])

    useEffect(() => {
        if (selectedRetailer) {
            const tempUsers = []
            users.forEach(user => {
                const userRetailers = user.retailer
                if (userRetailers.includes(selectedRetailer.description)) {
                    tempUsers.push(user)
                }
            })
            setFilteredUsers(tempUsers)
        } else {
            setFilteredUsers(users)
        }
    }, [selectedRetailer])

    useEffect(() => {
        if (selectedUser) {
            const userRoles = selectedUser.role
            if (userRoles.length > 0) {
                const tempRoles = []
                userRoles.forEach(role => {
                    tempRoles.push(role)
                });
                setSelectedUsersRoles(tempRoles)
            }
            const userRetailers = selectedUser.retailer
            if (userRetailers.length > 0) {
                const tempRetailers = []
                userRetailers.forEach(retailer => {
                    if (retailer === 'All') {
                        tempRetailers.push('All')
                    } else {
                        if (!tempRetailers.includes(retailer)) {
                            tempRetailers.push(retailer)
                        }
                    }
                });
                setSelectedUsersRetailers(tempRetailers)
            }
        }
    }, [selectedUser])

    const handleRetailerSelected = (e, selectedValue) => {
        setSelectedRetailer(selectedValue)
    };

    const handleSelectedRolesChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedUsersRoles(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleSelectedRetailersChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedUsersRetailers(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleUserSelected = (e, selectedValue) => {
        if (selectedValue !== null) {
            setSelectedUser(selectedValue)
        }
    };

    function handleSubmission() {
        axios.post('/api/user/managementSubmission', { user: selectedUser, retailers: selectedUsersRetailers, roles: selectedUsersRoles })
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure('Error Saving User Info!');
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('User Info Successfully Saved.');
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
    }

    function handleDeleteUser() {
        axios.delete('/api/user/delete', { params: { email: selectedUser.email, authUserEmail: context.userDetails.email } })
            .then(function (response) {
                if (response.status !== 200) {
                    const errorMessage = response?.data?.message ? response.data.message : 'Error deleting user!';
                    setToastFailure(errorMessage);
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('User Successfully deleted!');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log('Error Details:', error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    }


    function handleNewUserDialogClosed() {
        setNewUserDialogOpen(false)
    }

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    function saveNewUser() {
        if (isValidEmail(newUserEmail) && firstName && lastName) {
            axios.post(`/api/user/insert`, { userEmail: newUserEmail, firstName, lastName })
                .then(function (response) {
                    if (response.status !== 200) {
                        setToastFailure('Error Saving New User!!');
                        setOpenFailure(true);
                    } else {
                        setToastSuccess('User created!')
                        setOpenSuccess(true)
                        handleNewUserDialogClosed()
                        setTimeout(function () {
                            window.location.reload(true);
                        }, SuccessToastDuration);
                    }
                })
                .catch(function (error) {
                    if (error.response.status === 409) {
                        setToastFailure('User with this email already exists!')
                        setOpenFailure(true)
                    } else {
                        setToastFailure('Error connecting to server!!' + error);
                        setOpenFailure(true);
                    }
                });
        } else {
            if (!newUserEmail || !firstName || !lastName) {
                setToastFailure('All field are required')
                setOpenFailure(true)
            }
            else {
                setToastFailure('Not a valid email')
                setOpenFailure(true)
            }
        }
    }

    return (
        <Box sx={{ display: 'flex', height: '100vh', width: '100%', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2">
                User Management
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', height: '10vh', width: '90%', margin: 1, justifyContent: 'space-around' }}>
                <Autocomplete
                    sx={{ padding: 1, width: '30%' }}
                    freeSolo
                    onChange={handleRetailerSelected}
                    getOptionLabel={(option) => option.description}
                    options={retailers}
                    renderOption={(params, option) => {
                        return (
                            <li {...params} key={option._id}>
                                {option.description}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField sx={{ backgroundColor: 'white' }} {...params} label={'Filter Users by Retailer'} />}
                />

                <Autocomplete
                    disableClearable
                    sx={{ padding: 1, width: '40%' }}
                    freeSolo
                    onChange={handleUserSelected}
                    getOptionLabel={(option) => option.firstName !== undefined ? option.firstName + ' ' + option.lastName + ' - ' + option.email : option.email}
                    options={filteredUsers}
                    renderOption={(params, option) => {
                        return (
                            <li {...params} key={option._id}>
                                {option.firstName !== undefined ? option.firstName + ' ' + option.lastName + ' - ' + option.email : option.email}
                            </li>
                        );
                    }}
                    renderInput={(params) => <TextField sx={{ backgroundColor: 'white' }} {...params} label={'Select User to Update'} />}
                />
                <Button sx={{ height: '70%', alignSelf: 'center' }} variant="contained" onClick={() => { setNewUserDialogOpen(!newUserDialogOpen) }}>Add a User</Button>
            </Box>
            {selectedUser && context.userRoles.includes('toshibaAdmin') &&
                <Box sx={{ width: '85%' }} alignItems="center">
                    <Grid container>
                        <Grid xs={5}>
                            <InputLabel id="roles-input-label">Role(s)</InputLabel>
                            <Select
                                labelId="roles-selector-label"
                                id="roles-multi-select"
                                multiple
                                value={selectedUsersRoles}
                                onChange={handleSelectedRolesChange}
                                MenuProps={MenuProps}
                                sx={{ margin: 2 }}
                                fullWidth
                            >
                                {availableRoles.map((role) => (
                                    <MenuItem
                                        key={role.name}
                                        value={role.name}
                                    >
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid xs={2} />

                        <Grid xs={5}>
                            <InputLabel id="retailers-input-label">Retailer(s)</InputLabel>
                            <Select
                                labelId="retailers-selector-label"
                                id="retailers-multi-select"
                                multiple
                                value={selectedUsersRetailers}
                                onChange={handleSelectedRetailersChange}
                                MenuProps={MenuProps}
                                sx={{ margin: 2, overflow: 'wrap' }}
                                fullWidth
                            >
                                {retailers.map((retailer) => (
                                    <MenuItem
                                        key={retailer._id}
                                        value={retailer.description}
                                    >
                                        {retailer.description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid xs={12}>
                            <Button
                                onClick={handleSubmission} variant='contained'
                                sx={{ marginRight: 2 }}
                            >
                                Submit</Button>

                            <Button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete:  ${selectedUser.email}?`)) {
                                        handleDeleteUser();
                                    }
                                }}
                                variant='contained'>Delete</Button>
                        </Grid>
                    </Grid>
                </Box>
            }
            <Dialog open={newUserDialogOpen} onClose={handleNewUserDialogClosed}>
                <DialogTitle>Create New User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This screen allows you to create a new user, you will still need to assign their role(s)/retailer(s).
                    </DialogContentText>
                    <Grid container>
                        <Grid xs={12}>
                            <TextField
                                required
                                type='text'
                                autoFocus
                                margin="dense"
                                label='First Name'
                                fullWidth
                                variant='standard'
                                value={firstName}
                                onChange={(event) => {
                                    setFirstName(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                required
                                type='text'
                                margin="dense"
                                label='Last Name'
                                fullWidth
                                variant='standard'
                                value={lastName}
                                onChange={(event) => {
                                    setLastName(event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid xs={12}>
                            <TextField
                                required
                                type={'email'}
                                margin="dense"
                                label='Email Address'
                                fullWidth
                                variant='standard'
                                value={newUserEmail}
                                onChange={(event) => {
                                    setNewUserEmail(event.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewUserDialogClosed}>Cancel</Button>
                    <Button variant='contained' onClick={saveNewUser}>Save</Button>
                </DialogActions>
            </Dialog>
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
        </Box >
    )
}
