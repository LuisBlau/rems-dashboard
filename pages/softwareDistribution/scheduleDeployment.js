/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Copyright from '../../components/Copyright';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import {
    Dialog,
    DialogActions,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'rsuite/dist/rsuite.min.css';
import { TreePicker } from 'rsuite';
import _ from 'lodash';
import UserContext from '../../pages/UserContext'

/// Number of millisec to show Successful toast. Page will reload 1/2 second before to clear it.
// TODO: move these to top-level of app so it's consistent throughout?
const successToastDuration = 1500;
/// Number of millisec to show Failure toast. Page does not reload after.
const failToastDuration = 8000;
// Number of millisec to show master missing toast.  Page does not reload after.
const missingMasterToastDuration = 8000;

const PREFIX = 'scheduleDeployment';

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

const uiWidth = 600;

const formValues = {
    name: '',
    id: '',
    retailerId: '',
    storeList: '',
    dateTime: '',
};

export default function ScheduleDeployment() {
    const [_formValues, setFormValues] = useState(formValues);
    const [deployConfigs, setDeployConfigs] = useState([]);
    const [selectedDeployConfig, setSelectedDeployConfig] = useState(null);
    const [allStoresDetails, setAllStoresDetails] = useState([]);
    const [variables, setVariables] = useState({});
    const [_storeList, setStoreList] = useState('');
    const [_dateTime, setDateTime] = useState(_.now);
    const [_options, setOptions] = useState([]);
    const [allUploads, setAllUploads] = useState([]);
    const [agentVersions, setAgentVersions] = useState([]);
    const [selectedUploadedFiles, setSelectedUploadedFiles] = useState([]);
    const [versionCollisionDialogOpen, setVersionCollisionDialogOpen] = useState(false);
    const collisionDialogTitleString = 'Existing Version Collision';
    const [collisionDialogData, setCollisionDialogData] = useState([]);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [canDeploy, setCanDeploy] = useState(true);

    const [toastSuccess, setToastSuccess] = useState('');
    const [openMissingMaster, setOpenMissingMaster] = useState(false);
    const [openFileMissingPackages, setOpenFileMissingPackages] = useState(false);
    const [toastMissingMaster, setToastMissingMaster] = useState('');
    const [toastMissingPackages, setToastMissingPackages] = useState('')
    const [openFailure, setOpenFailure] = useState(false);
    const [toastFailure, setToastFailure] = useState('');
    const [storeFilterNames, setStoreFilterNames] = React.useState([]);
    const [storeNames, setStoreNames] = React.useState([]);
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
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [deployImmediately, setDeployImmediately] = useState(false);

    useEffect(() => {
        if (context.selectedRetailer) {
            setSelectedRetailer(context.selectedRetailer);
        }
        if (context.selectedRetailer && context.userRetailers?.length > 0 && context.selectedRetailerIsTenant !== null) {
            if (context.selectedRetailerIsTenant === false) {
                axios.get(`/api/REMS/deploy-configs?retailerId=common,${context.selectedRetailer}`).then(function (res) {
                    const data = [];
                    const response = _.groupBy(res.data, 'retailer_id');
                    for (const soft of Object.keys(response)) {
                        if (soft.toLowerCase() === 'common' && !_.includes(context.userRoles, 'toshibaAdmin')) {
                            response[soft] = _.filter(response[soft], x => x.forProd === true)
                        }

                        const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                        const entry = { children: [], label: (findRetailer ? findRetailer.description : soft.toLowerCase() === 'common' ? 'Common' : soft) + " Deployments", value: soft };
                        for (const v of response[soft]) {
                            entry.children.push({
                                label: v.name,
                                value: v.uuid,
                            });
                        }
                        data.push(entry);
                    }
                    setDeployConfigs(res.data);
                    setOptions(data)
                });
            } else {
                axios.get(`/api/REMS/deploy-configs?retailerId=common,${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`).then(function (res) {
                    const data = [];
                    const response = _.groupBy(res.data, 'retailer_id');
                    for (let soft of Object.keys(response)) {
                        if (soft.toLowerCase() === 'common' && !_.includes(context.userRoles, 'toshibaAdmin')) {
                            response[soft] = _.filter(response[soft], x => x.forProd === true)
                        }

                        if (soft.toLowerCase() !== 'common') {
                            const oldKey = soft
                            soft = response[soft][0].tenant_id
                            Object.defineProperty(response, soft, Object.getOwnPropertyDescriptor(response, oldKey));
                            delete response[oldKey];
                        }

                        const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                        const entry = { children: [], label: (findRetailer ? findRetailer.description : soft.toLowerCase() === 'common' ? 'Common' : soft) + " Deployments", value: soft };
                        for (const v of response[soft]) {
                            entry.children.push({
                                label: v.name,
                                value: v.uuid,
                            });
                        }
                        data.push(entry);
                    }
                    setDeployConfigs(res.data);
                    setOptions(data)
                });
            }
        }
    }, [context])

    useEffect(() => {
        setStoreNames([]);
        if (selectedRetailer !== '') {
            // TODO:
            // this won't be performant when we have a large number of uploads
            // we should do this later in the workflow, once a deploy-config is
            // selected, and filter the request
            if (context.selectedRetailerIsTenant !== null) {
                if (context.selectedRetailerIsTenant === false) {
                    axios.get(`/api/REMS/uploads?retailerId=${selectedRetailer}`).then(function (res) {
                        const uploads = [];
                        res.data.forEach((upload) => {
                            uploads.push({
                                fileId: upload.uuid,
                                fileName: upload.filename,
                                description: upload.description,
                                packages: upload.packages,
                            });
                        });
                        setAllUploads(uploads);
                    });

                    axios.get(`/api/REMS/store-list?retailerId=${selectedRetailer}`).then((resp) => {
                        const sNames = [];
                        const stores = [];
                        resp.data.forEach((v) => {
                            stores.push(v);
                            sNames.push(v.list_name);
                        });
                        setAllStoresDetails(stores);
                        setStoreNames(sNames);
                    });
                } else {
                    axios.get(`/api/REMS/uploads?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${selectedRetailer}`).then(function (res) {
                        const uploads = [];
                        res.data.forEach((upload) => {
                            uploads.push({
                                fileId: upload.id,
                                fileName: upload.filename,
                                description: upload.description,
                                packages: upload.packages,
                            });
                        });
                        setAllUploads(uploads);
                    });

                    axios.get(`/api/REMS/store-list?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${selectedRetailer}`).then((resp) => {
                        const sNames = [];
                        const stores = [];
                        resp.data.forEach((v) => {
                            stores.push(v);
                            sNames.push(v.list_name);
                        });
                        setAllStoresDetails(stores);
                        setStoreNames(sNames);
                    });
                }
            }

        }
    }, [selectedRetailer, context.selectedRetailerIsTenant, context.selectedRetailerParentRemsServerId]);

    function getUsefulInformation(agents, useful) {
        const arr = [];
        agents.forEach((agent) => {
            if (agent.includes(':')) {
                arr.push(useful.find((x) => x.storeAgentCombo === agent));
            } else {
                if (useful.find((x) => x.store === agent && x.isMaster === true) !== undefined) {
                    arr.push(useful.find((x) => x.store === agent && x.isMaster === true));
                } else {
                    setToastMissingMaster(agent + ' does not have a master agent.');
                    setOpenMissingMaster(true);
                }
            }
        });
        return arr;
    }

    useEffect(() => {
        const miffedStoreAgentPackageVersions = [];
        const missingPackages = [];
        if (selectedUploadedFiles.length > 0 && agentVersions.length > 0) {
            const packages = [];
            if (selectedUploadedFiles.length > 0) {
                selectedUploadedFiles.forEach((file) => {
                    if (file) {
                        if (file.packages) {
                            const filePacks = [];
                            file.packages.forEach((pack) => {
                                filePacks.push(pack);
                            });
                            packages.push(filePacks);
                        } else {
                            missingPackages.push(file.description)
                        }
                    }
                });
            }
            if (missingPackages.length > 0) {
                setToastMissingPackages(missingPackages)
                setOpenFileMissingPackages(true)
            }
            agentVersions.forEach((agent) => {
                if (agent && agent.versions) {
                    if (packages.length > 0) {
                        agent.versions.forEach((version) => {
                            packages.forEach((pckg) => {
                                if (
                                    pckg.some(
                                        (x) =>
                                            x.productName === Object.keys(version)[0] &&
                                            x.version === Object.values(version)[0]
                                    )
                                ) {
                                    // Store these matching kittens off into an array for the dialog
                                    const packageVersionString =
                                        Object.keys(version)[0] + ' : ' + Object.values(version)[0];
                                    miffedStoreAgentPackageVersions.push({
                                        agent: agent.storeAgentCombo,
                                        package: packageVersionString,
                                    });
                                }
                            });
                        });
                    }
                }
            });
        }
        // if we have any version collisions between the deploy config
        // and stores in the list
        if (miffedStoreAgentPackageVersions.length > 0) {
            setCollisionDialogData(miffedStoreAgentPackageVersions);
            setVersionCollisionDialogOpen(true);
        }
    }, [agentVersions, selectedUploadedFiles]);

    const changeStoreFilter = async (event) => {
        const {
            target: { value },
        } = event;
        setStoreFilterNames(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
        const usefulInformation = [];
        // gets useful agent/store info for the selected retailer
        if (context.selectedRetailerIsTenant === false) {
            await axios.get('/api/REMS/agents?retailer=' + selectedRetailer).then(function (res) {
                res.data.forEach((element) => {
                    usefulInformation.push({
                        storeAgentCombo: element.storeName + ':' + element.agentName,
                        versions: element.versions,
                        isMaster: element.is_master,
                        store: element.storeName,
                        agent: element.agentName,
                    });
                });
            });
        } else {
            await axios.get('/api/REMS/agents?retailer=' + context.selectedRetailerParentRemsServerId + '&tenantId=' + selectedRetailer).then(function (res) {
                res.data.forEach((element) => {
                    usefulInformation.push({
                        storeAgentCombo: element.storeName + ':' + element.agentName,
                        versions: element.versions,
                        isMaster: element.is_master,
                        store: element.storeName,
                        agent: element.agentName,
                    });
                });
            });
        }

        if (value.length === 1) {
            // I want to store all the stores/agents in the distribution list
            // in the store list :)
            // this is the list of agents for the selected distribution list
            const distributionListAgents = allStoresDetails.find((x) => x.list_name === String(value)).agents;

            // gathers an array of agents that are relevant to the selected
            // distribution list and their associated package version combos
            const newAgentVersions = getUsefulInformation(distributionListAgents, usefulInformation);
            setAgentVersions(newAgentVersions);

            // set store list to storeAgentCombo
            let newStoreList = '';
            newAgentVersions.forEach((agent) => {
                if (agent) {
                    if (!newStoreList.includes(agent.storeAgentCombo)) {
                        if (newStoreList.length > 0 && newStoreList.charAt(newStoreList.length - 2) !== ',') {
                            newStoreList += ', ';
                        }
                        newStoreList += agent.storeAgentCombo + ', ';
                    }
                }
            });
            // remove whitespace
            newStoreList = newStoreList.trim();
            // remove trailing comma
            newStoreList = newStoreList.replace(/,*$/, '');
            setStoreList(newStoreList);
        } else if (value.length > 1) {
            // handle when multiple distribution lists are selected
            let newStoreList = '';

            value.forEach(async (val) => {
                const distributionListAgents = allStoresDetails.find((x) => x.list_name === String(val)).agents;

                // gathers an array of agents that are relevant to the selected
                // distribution list and their associated package version combos
                const newAgentVersions = getUsefulInformation(distributionListAgents, usefulInformation);
                setAgentVersions(newAgentVersions);

                // set store list to storeAgentCombo
                newAgentVersions.forEach((agent) => {
                    if (agent) {
                        if (!newStoreList.includes(agent.storeAgentCombo)) {
                            if (newStoreList.length > 0 && newStoreList.charAt(newStoreList.length - 2) !== ',') {
                                newStoreList += ', ';
                            }
                            newStoreList += agent.storeAgentCombo + ', ';
                        }
                    }
                });
                // remove whitespace
                newStoreList = newStoreList.trim();
                // remove trailing comma
                newStoreList = newStoreList.replace(/,*$/, '');
                setStoreList(newStoreList);
            });
        } else {
            setStoreList('');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let config = deployConfigs.find((x) => x.uuid === selectedDeployConfig);
        formValues.name = config.name;
        formValues.id = config.uuid;
        formValues.retailerId = config.retailer_id;
        formValues.variables = variables;
        if (context.selectedRetailerIsTenant === true) {
            formValues.tenantId = config.tenant_id;
        }
        formValues.storeList = _storeList;
        // formValues.listNames = _listNames,
        // Don't adjust for users time zone i.e we are always in store time.
        // en-ZA puts the date in the design doc format except for an extra comma.
        formValues.dateTime = deployImmediately ? null : new Date(_dateTime)
            .toLocaleString('en-ZA', { hourCycle: 'h24' })
            .replace(',', '')
            .replace(' 24:', ' 00:');
        formValues.deploy = deployImmediately ? 'immediate' : '';

        setFormValues(formValues);

        if (context.selectedRetailerIsTenant === false) {
            const apiCall = `/api/deploy-schedule?retailerId=${selectedRetailer}`
            axios
                .post(apiCall, _formValues)
                .then(function (response) {
                    if (response.data.message !== 'Success') {
                        setToastFailure(response.data);
                        setOpenFailure(true);
                    } else {
                        setToastSuccess('Deploy-Config Scheduled');
                        setOpenSuccess(true);
                    }
                })
                .catch(function (error) {
                    setToastFailure(error.message);
                    setOpenFailure(true);
                });
        } else {
            const apiCall =
                `/api/deploy-schedule?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${selectedRetailer}`
            axios
                .post(apiCall, _formValues)
                .then(function (response) {
                    if (response.data.message !== 'Success') {
                        setToastFailure(response.data);
                        setOpenFailure(true);
                    } else {
                        setToastSuccess('Deploy-Config Scheduled');
                        setOpenSuccess(true);
                    }
                })
                .catch(function (error) {
                    setToastFailure(error.message);
                    setOpenFailure(true);
                });
        }

    };

    function handleVersionCollisionDialogClose() {
        setVersionCollisionDialogOpen(false);
    }

    function handleSelectDeployConfig(selectedConfig, e) {
        if (selectedConfig) {
            if (selectedConfig.toLowerCase() === 'common' || selectedConfig === context.selectedRetailer) {
                e.preventDefault();
                return;
            }
            if (selectedConfig["children"]) {
                setOptions(selectedConfig["children"])
                return;
            }
            setSelectedDeployConfig(selectedConfig);
            // retrieve config by name
            // traverse the 'steps' array
            // retrieve any that have 'upload'
            // get file name from there
            const selectedConfigDetailSteps = deployConfigs.find((x) => x.uuid === selectedConfig)?.steps ?? [];
            const newSelectedUploadedFiles = [];
            let newVars = {}
            selectedConfigDetailSteps.forEach((step) => {
                if (step.type === 'upload') {
                    // store the uploaded files in an array, filtered down to the ones that have matches :)
                    newSelectedUploadedFiles.push(allUploads.find((upload) => upload.fileId === step.file));
                    // from here, we have access to an array of files and their associated packages (and their versions)
                    // we can access that array from:
                    // selectedUploadedFiles[index].packages
                }
                if (step.type === 'shell') {
                    for (var v of Object.values(step)) {
                        let varMatch = v.match(/(?<!^\\)\$[A-Z0-9_]+/)
                        if (varMatch) newVars[varMatch] = null;
                    }
                }
            });
            if (Object.keys(newVars).length > 0) {
                setCanDeploy(false)
            } else {
                setCanDeploy(true)
            }
            setVariables(newVars);
            setSelectedUploadedFiles(newSelectedUploadedFiles);
        } else {
            setSelectedDeployConfig(null);
            setSelectedUploadedFiles([]);
            setVariables({});
        }
    }
    function varentry(name) {
        return function changever(event) {
            let newVars = Object.assign({}, variables)
            newVars[name] = event.target.value
            setVariables(newVars)
            if (canDeploy && event.target.value) return
            var nowCanDeploy = true
            Object.values(newVars).forEach(variable => {
                if (variable === null || variable === '' || nowCanDeploy === false) {
                    nowCanDeploy = false
                }
            });
            setCanDeploy(nowCanDeploy)
        }
    }
    return (
        <Root className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
                <Typography marginBottom={3} align="center" variant="h3">
                    Schedule a Deployment
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} sx={{ alignItems: 'center' }}>
                        <TreePicker
                            placement="bottomEnd"
                            onChange={(selectedConfig, e) => {
                                handleSelectDeployConfig(selectedConfig, e);
                            }}
                            data={_options}
                            style={{
                                width: uiWidth
                            }}
                            value={selectedDeployConfig}
                            placeholder="Deployment Configuration to Schedule"
                        />
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ width: 200 }} id="distro-list-label">
                                Distribution List
                            </InputLabel>
                            <Select
                                labelId="distro-list-label"
                                id="distro-list"
                                multiple
                                value={storeFilterNames}
                                onChange={changeStoreFilter}
                                input={<OutlinedInput label="Distribution List" />}
                                renderValue={(selected) => selected.join(', ')}
                                sx={{ minWidth: 600 }}
                                MenuProps={MenuProps}
                                label="Distribution List"
                            >
                                {storeNames.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={storeFilterNames.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* for handler to work 'name' has to match the formsValue member */}
                        <TextField
                            id="storeList-input"
                            multiline
                            rows={5}
                            sx={{ width: uiWidth, height: '100%' }}
                            value={_storeList}
                            label="Store List"
                            name="storeList"
                            onChange={(event) => {
                                setStoreList(String(event.target.value));
                            }}
                            required
                            // disabled={storeSelected}
                            helperText="example store list: 0001:0001-CC, 0500:0500-CC, 0100:0100-CC, 02000:02000-CC, 0123:0123-CC"
                        />
                        {Object.keys(variables).map(function (name, index) {
                            return <TextField key={index} onChange={varentry(name)} label={name} />
                        })
                        }
                        {_.includes(context.userRoles, 'toshibaAdmin') &&
                            <FormControlLabel
                                control={<Checkbox
                                    checked={deployImmediately}
                                    onChange={(e) => setDeployImmediately(e.target.checked)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />}
                                label='Deploy Immediately'
                            />
                        }

                        {!deployImmediately &&

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    id="date-time-local"
                                    label="Apply Time (local store time)"
                                    value={dayjs(_dateTime)}
                                    onChange={(newValue) => {
                                        setDateTime(newValue);
                                    }}
                                />
                            </LocalizationProvider>
                        }
                        <Button variant="contained" color="primary" type="submit" disabled={!canDeploy}>
                            Submit
                        </Button>
                    </Stack>
                </form>
                <Box pt={4}>
                    <Copyright />
                </Box>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openFileMissingPackages}
                    autoHideDuration={missingMasterToastDuration}
                    onClose={(event) => {
                        setOpenFileMissingPackages(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>File(s) Missing Packages!</AlertTitle>
                        {toastMissingPackages}
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openMissingMaster}
                    autoHideDuration={missingMasterToastDuration}
                    onClose={(event) => {
                        setOpenMissingMaster(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Missing Master Agent!</AlertTitle>
                        {toastMissingMaster}
                    </Alert>
                </Snackbar>
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
                <Dialog
                    open={versionCollisionDialogOpen}
                    onClose={handleVersionCollisionDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{collisionDialogTitleString}</DialogTitle>
                    <div style={{ margin: 20, flexWrap: true }}>Issues exist for the following:</div>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Store:Agent Combination</TableCell>
                                    <TableCell align="right">Package:Version Combination</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collisionDialogData.map((row, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {row.agent}
                                        </TableCell>
                                        <TableCell align="right">{row.package}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div style={{ margin: 20, flexWrap: true }}>
                        {
                            'If you would like to proceed with this deployment, continue with submission.  Otherwise, remove the store(s)/agent(s) from the list before submission.'
                        }
                    </div>
                    <DialogActions>
                        <Button
                            style={{ marginRight: 12 }}
                            variant="contained"
                            onClick={handleVersionCollisionDialogClose}
                        >
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Root>
    );
}
