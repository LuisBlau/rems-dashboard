/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Command from '../../components/createCommands';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
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
import 'rsuite/dist/rsuite.min.css';
import { TreePicker } from 'rsuite';
import axios from 'axios';
import _ from 'lodash';
import { useContext } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel } from '@mui/material';

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
    const [commands, setCommands] = useState({});
    const [configId, setConfigId] = useState(null);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [deploys, setDeploys] = useState(null);
    const [toastFailure, setToastFailure] = useState('');
    const context = useContext(UserContext)
    const [_options, setOptions] = useState([]);
    const [selectedDeployConfig, setSelectedDeployConfig] = useState(null);
    const [isCommon, setIsCommon] = useState(false);
    const [retailerType, setRetailerType] = useState('');
    const [forProdChecked, setForProdChecked] = useState(false)

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        mode: 'all'
    });

    useEffect(() => {
        if (context.selectedRetailer) {
            if (!context.selectedRetailerIsTenant) {
                axios.get(`/api/REMS/deploy-configs?retailerId=common,${context.selectedRetailer}`).then(function (res) {
                    let deploys = []
                    res.data.forEach(element => {
                        if (element.retailer !== 'common') {
                            deploys.push(element)
                        } else {
                            if (element.forProd !== undefined && element.forProd === true) {
                                deploys.push(element)
                            }
                        }
                    });
                    handleOptions(_.groupBy(deploys, 'retailer_id'));
                    setDeploys(deploys);
                });
            } else if (context.selectedRetailerParentRemsServerId) {
                axios.get(`/api/REMS/deploy-configs?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`).then(function (res) {
                    let deploys = []
                    res.data.forEach(element => {
                        if (element.retailer !== 'common') {
                            deploys.push(element)
                        } else {
                            if (element.forProd !== undefined && element.forProd === true) {
                                deploys.push(element)
                            }
                        }
                    });
                    handleOptions(_.groupBy(deploys, 'retailer_id'));
                    setDeploys(deploys);
                });
            }
        }
    }, [context.selectedRetailerIsTenant, context.selectedRetailerParentRemsServerId]);

    useEffect(() => {
        if (deploys?.length > 0) {
            const localDeploys = structuredClone(deploys)
            const dep = _.find(localDeploys, (d) => {
                if (context.selectedRetailerIsTenant === false || isCommon === true) {
                    return d.name === selectedDeployConfig && d.retailer_id === (isCommon ? 'common' : context.selectedRetailer);
                } else {
                    return d.name === selectedDeployConfig && d.tenant_id === (isCommon ? 'common' : context.selectedRetailer)
                }
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
                if (dep.forProd !== null) {
                    setForProdChecked(dep.forProd)
                }
                setValue('configName', selectedDeployConfig);
                setCommands(stepsobj);
            }
        }

    }, [selectedDeployConfig]);

    const handleOptions = response => {
        let data = []
        if (context.selectedRetailerIsTenant !== null) {
            if (context.selectedRetailerIsTenant === false) {
                if (Object.keys(response).length > 0) {
                    for (const soft of Object.keys(response)) {
                        if (soft === 'common' && !_.includes(context.userRoles, 'toshibaAdmin')) {
                            response[soft] = _.filter(response[soft], x => x.forProd === true)
                        }
                        const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                        const entry = { children: [], label: (findRetailer ? findRetailer.description : soft === 'common' ? 'Common' : soft) + " Deployments", value: soft };
                        for (const v of response[soft]) {
                            entry.children.push({
                                label: v.name,
                                value: v.name,
                                type: context.selectedRetailer === soft ? 'retailer' : 'common'
                            });
                        }
                        data.push(entry);
                    }
                }
            } else {
                if (Object.keys(response.length > 0)) {
                    for (let soft of Object.keys(response)) {
                        if (soft === 'common' && !_.includes(context.userRoles, 'toshibaAdmin')) {
                            response[soft] = _.filter(response[soft], x => x.forProd === true)
                        }
                        if (soft !== 'common') {
                            const oldKey = soft
                            soft = response[soft][0].tenant_id
                            Object.defineProperty(response, soft, Object.getOwnPropertyDescriptor(response, oldKey));
                            delete response[oldKey];

                        }
                        const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                        const entry = { children: [], label: (findRetailer ? findRetailer.description : soft?.toLowerCase() === 'common' ? 'Common' : soft) + " Deployments", value: soft };
                        for (const v of response[soft]) {
                            entry.children.push({
                                label: v.name,
                                value: v.name,
                                type: context.selectedRetailer?.toLowerCase() === soft?.toLowerCase() ? 'retailer' : 'common'
                            });
                        }
                        data.push(entry);
                    }
                }
            }
        }
        setOptions(data)
    }

    const addCommand = () => {
        const id = Date.now();
        setCommands((commands) => {
            const jasper = Object();
            Object.assign(jasper, commands); // creating copy of state variable jasper
            jasper[id] = {}; // update the name property, assign a new value
            return jasper;
        });
    };

    const deleteDeploymentConfig = (selectedRetailer) => {
        if (configId && !context.selectedRetailerIsTenant) {
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
        } else if (context.selectedRetailerParentRemsServerId) {
            axios.get(`/api/REMS/delete-deploy-config?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}&id=` + configId).then(function (resp) {
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

    const onSubmit = (data) => {
        const commandList = [];
        for (const x in commands) {
            const y = commands[x];
            commandList.push(y);
        }

        let commandObj
        if (retailerType === 'common') {
            commandObj = {
                name: data.configName,
                steps: commandList,
                forProd: forProdChecked
            }
        } else {
            commandObj = {
                name: data.configName,
                steps: commandList,
            };
        }

        let varString = `retailerId=${retailerType}`
        if (context.selectedRetailerIsTenant === true && retailerType !== 'common') {
            varString = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${retailerType}`
        }

        axios.post(`/api/sendCommand?${varString}`, commandObj)
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

    if (!cInit) {
        setcInit(true);
        addCommand();
    }

    if (deploys == null) {
        return 'loading . . .';
    }

    const handleSelectedDeploy = (e, selectedValue) => {
        if (selectedValue === 'common' || selectedValue === context.selectedRetailer) {
            e.preventDefault();
            return;
        }
        setSelectedDeployConfig(selectedValue)
        setCommands({})
        setValue('configName', selectedValue);
    };

    const handleForProdChanged = (e, val) => {
        setForProdChecked(val)
    }

    const onSelectDeploy = i => {
        if (i.type !== undefined) {
            setIsCommon(i.type.toLowerCase() === 'common')
        }
    }

    return (
        <Root className={classes.content}>
            <Container maxWidth="xl" className={classes.container}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography align="center" variant="h3">
                        Create Deployment Configuration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Controller
                                rules={{ required: true }}
                                render={({ field }) => <TextField
                                    {...field}
                                    label="Deploy-Config Name"
                                    variant="filled"
                                    sx={{ marginBottom: 3 }}
                                />}
                                defaultValue=""
                                control={control}
                                name="configName"
                            />

                            {errors?.configName && <Typography variant='body2' color='error'>This field is required</Typography>}
                        </Grid>
                        <Grid item xs={4} />
                        <Grid item xs={4}>
                            <TreePicker
                                placement="bottomEnd"
                                onChange={(selectedConfig, e) => {
                                    handleSelectedDeploy(e, selectedConfig);
                                }}
                                onSelect={onSelectDeploy}
                                data={_options}
                                style={{
                                    width: 300,
                                    padding: 8
                                }}
                                value={selectedDeployConfig}
                                placeholder="Load Existing Config"
                            />
                        </Grid>
                    </Grid>
                    {Object.keys(commands).map(function (idx) {
                        return (
                            <Command
                                selectedRetailer={context.selectedRetailer}
                                isTenant={context.selectedRetailerIsTenant}
                                parentRemsServer={context.selectedRetailerParentRemsServerId}
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
                    {context?.userRoles?.includes('toshibaAdmin') && selectedDeployConfig && (
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 1, marginLeft: '16%', width: '50%' }}
                            endIcon={<DeleteIcon />}
                            onClick={() => deleteDeploymentConfig(isCommon ? 'common' : context.selectedRetailer)}
                        >
                            Delete  Deployment Configuration
                        </Button>
                    )}
                    <Button
                        type='submit'
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 1, marginLeft: '16%', width: '50%' }}
                        endIcon={<SaveIcon />}
                        onClick={e => setRetailerType(context.selectedRetailer)}
                    >
                        Save Deployment Configuration
                    </Button>
                    {context?.userRoles?.includes('toshibaAdmin') && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '16%' }}>
                            <FormControlLabel sx={{ marginLeft: '20%' }} control={
                                <Checkbox
                                    checked={forProdChecked}
                                    onChange={handleForProdChanged} />
                            }
                                label="FOR PRODUCTION" />
                            <Button
                                type='submit'
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 1, width: '60%' }}
                                endIcon={<SaveIcon />}
                                onClick={e => setRetailerType('common')}
                            >
                                Save Common Deployment Configuration
                            </Button>
                        </Box>

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
