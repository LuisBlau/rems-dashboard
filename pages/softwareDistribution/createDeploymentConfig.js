/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Command from '../../components/createCommands';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Copyright from '../../components/Copyright';
import UserContext from '../../pages/UserContext'
import axios from 'axios';
import _ from 'lodash';
import { useContext } from 'react';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const successToastDuration = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const failToastDuration = 10000;

const PREFIX = 'createDeploymentConfig';

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

export default function CreateDeploymentConfig() {
    const [cInit, setcInit] = useState(false);
    const [name, setName] = useState('');
    const [commands, setCommands] = useState({});
    const [configId, setConfigId] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [deploys, setDeploys] = useState(null);
    const [toastFailure, setToastFailure] = useState('');
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')

    useEffect(() => {
        if (context) {
            if (context.selectedRetailer) {
                setSelectedRetailer(context.selectedRetailer)
            }
        }
    }, [context])

    useEffect(() => {
        if (selectedRetailer !== '') {
            axios.get(`/api/REMS/deploy-configs?retailerId=${selectedRetailer}`).then(function (res) {
                const packages = [];
                res.data.forEach((v) => {
                    packages.push(v);
                });
                setDeploys(packages);
            });
        }
    }, [selectedRetailer]);

    const addCommand = () => {
        const id = Date.now();
        setCommands((commands) => {
            const jasper = Object();
            Object.assign(jasper, commands); // creating copy of state variable jasper
            jasper[id] = {}; // update the name property, assign a new value
            return jasper;
        });
    };

    const deleteDeploymentConfig = () => {
        if (configId) {
            axios.get(`/api/REMS/delete-deploy-config?retailerId=${selectedRetailer}&id=` + configId).then(function (resp) {
                if (resp.status === 200) {
                    setToastSuccess(resp.data.message);
                    setOpenSuccess(true);
                } else {
                    setToastFailure(resp.data.message);
                    setOpenFailure(true);
                }
            });
            setTimeout(function () {
                window.location.reload(true);
            }, successToastDuration + 500);
        } else {
            setToastFailure('Please select existing deployment config');
            setOpenFailure(true);
        }
    };

    const handleSubmit = (event, asCommon) => {
        event.preventDefault();

        const commandList = [];
        for (const x in commands) {
            const y = commands[x];
            commandList.push(y);
        }

        const commandObj = {
            name,
            steps: commandList,
        };

        const retailerId = asCommon === true ? 'common' : selectedRetailer;

        axios.post(`/api/sendCommand?retailerId=${retailerId}`, commandObj)
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure('Error Saving Deployment!!');
                    setOpenFailure(true);
                    return;
                }

                if (response.data.message === 'Duplicate') {
                    setToastFailure('Error - Duplicate Deployment');
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Configuration Successfully Saved.');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, successToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };

    const removeCommand = (id) => {
        setCommands((commands) => {
            const jasper = Object();

            Object.assign(jasper, commands); // creating copy of state variable jasper
            delete jasper[id];
            return jasper;
        });
    };

    const setst = (id, state) => {
        setCommands((commands) => {
            const jasper = Object.assign({}, commands); // creating copy of state variable jasper
            jasper[id] = state; // update the name property, assign a new value
            return jasper;
        });
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    if (!cInit) {
        setcInit(true);
        addCommand();
    }

    if (deploys == null) {
        return 'loading . . .';
    }

    const handleSelectedDeploy = (e, selectedValue) => {
        setCommands({})
        setName('')
        setTimeout(() => {
            const localDeploys = structuredClone(deploys)
            const dep = _.find(localDeploys, (d) => {
                return d.name === selectedValue;
            })
            if (dep) {
                setConfigId(dep.id);
                const steps = dep.steps.map(function (s, idx) {
                    const obj = {};
                    obj.id = idx;
                    obj.type = s.type;
                    delete s.type;
                    obj.arguments = s;
                    return obj;
                });
                const stepsobj = {};
                for (const v of steps) {
                    stepsobj[v.id] = v;
                }
                setName(selectedValue);
                setCommands(stepsobj);
            }
        }, 100)


    };

    const listItems = deploys.map(function (c, index) {
        return c.name
    });

    return (
        <Root className={classes.content}>
            <Container maxWidth="xl" className={classes.container}>
                <form>
                    <Typography align="center" variant="h3">
                        Create Deployment Configuration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                label="Deploy-Config Name"
                                variant="filled"
                                sx={{ marginBottom: 3 }}
                                onChange={handleNameChange}
                                value={name}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={4} />
                        <Grid item xs={4}>
                            <Autocomplete
                                sx={{ padding: 1, width: 300 }}
                                onChange={handleSelectedDeploy}
                                getOptionLabel={(option) => option}
                                options={listItems}
                                renderOption={(params, option) => {
                                    return (
                                        <li {...params} key={option}>
                                            {option}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => <TextField {...params} label={'Load Existing Config'}
                                />}
                            />
                        </Grid>
                    </Grid>
                    {Object.keys(commands).map(function (idx) {
                        return (
                            <Command
                                selectedRetailer={selectedRetailer}
                                key={'cmd-' + idx}
                                id={idx}
                                st={commands[idx]}
                                setst={setst}
                                onRemove={removeCommand}
                            />
                        );
                    })}
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ marginTop: 3, marginLeft: '16%', width: '50%' }}
                        endIcon={<AddTaskIcon />}
                        onClick={addCommand}
                    >
                        Add Task to Deployment Config
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 1, marginLeft: '16%', width: '50%' }}
                        endIcon={<DeleteIcon />}
                        onClick={deleteDeploymentConfig}
                    >
                        Delete Deployment Configuration
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 1, marginLeft: '16%', width: '50%' }}
                        endIcon={<SaveIcon />}
                        onClick={e => handleSubmit(e, false)}
                    >
                        Save Deployment Configuration
                    </Button>
                    {context?.userRoles?.includes('toshibaAdmin') && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 1, marginLeft: '16%', width: '50%' }}
                            endIcon={<SaveIcon />}
                            onClick={e => handleSubmit(e, true)}
                        >
                            Create Common Deployment Configuration
                        </Button>
                    )}
                </form>
                <Box pt={4}>
                    <Copyright />
                </Box>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSuccess}
                    autoHideDuration={successToastDuration}
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
                    autoHideDuration={failToastDuration}
                    onClose={(event) => {
                        setOpenFailure(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Error!!!</AlertTitle>
                        {toastFailure}
                    </Alert>
                </Snackbar>
            </Container>
        </Root>
    );
}
