/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
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
    storeList: '',
    dateTime: '',
};

export default function ScheduleDeployment() {
    const [_formValues, setFormValues] = useState(formValues);
    const [deployConfigs, setDeployConfigs] = useState([]);
    const [selectedDeployConfig, setSelectedDeployConfig] = useState(null);
    const [allStoresDetails, setAllStoresDetails] = useState([]);
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
    const [toastSuccess, setToastSuccess] = useState('');
    const [openMissingMaster, setOpenMissingMaster] = useState(false);
    const [toastMissingMaster, setToastMissingMaster] = useState('');
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

    useEffect(() => {
        if (context.selectedRetailer && context.userRetailers?.length > 0) {
            let searchParams = `retailerId=common,${context.selectedRetailer}`
            if (context.selectedRetailerIsTenant === true && context.selectedRetailerParentRemsServerId) {
                searchParams = `retailerId=common,${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
            }
            axios.get(`/api/REMS/deploy-configs?${searchParams}`).then(function (res) {
                const data = [];
                const response = _.groupBy(res.data, 'retailer_id');
                for (const soft of Object.keys(response)) {
                    const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                    const entry = { children: [], label: (findRetailer ? findRetailer.description : soft) + " Deployments", value: soft };
                    for (const v of response[soft]) {
                        entry.children.push({
                            label: v.name,
                            value: v.id,
                        });
                    }
                    data.push(entry);
                }
                setDeployConfigs(res.data);
                setOptions(data)
            });
        }
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId])

    useEffect(() => {
        setStoreNames([]);
        if (context.selectedRetailer) {
            // TODO:
            // this won't be performant when we have a large number of uploads
            // we should do this later in the workflow, once a deploy-config is
            // selected, and filter the request
            if (context.selectedRetailerIsTenant === false) {
                axios.get(`/api/REMS/uploads?retailerId=${context.selectedRetailer}`).then(function (res) {
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

                axios.get(`/api/REMS/store-list?retailerId=${context.selectedRetailer}`).then((resp) => {
                    const sNames = [];
                    const stores = [];
                    resp.data.forEach((v) => {
                        stores.push(v);
                        sNames.push(v.list_name);
                    });
                    setAllStoresDetails(stores);
                    setStoreNames(sNames);
                });
            } else if (context.selectedRetailerParentRemsServerId) {
                axios.get(`/api/REMS/uploads?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`).then(function (res) {
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

                axios.get(`/api/REMS/store-list?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`).then((resp) => {
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
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId]);

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
        if (selectedUploadedFiles.length > 0 && agentVersions.length > 0) {
            const packages = [];
            if (selectedUploadedFiles.length > 0) {
                selectedUploadedFiles.forEach((file) => {
                    if (file) {
                        const filePacks = [];
                        file.packages.forEach((pack) => {
                            filePacks.push(pack);
                        });
                        packages.push(filePacks);
                    }
                });
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
        let paramsString = `retailer=${context.selectedRetailer}`
        if (context.selectedRetailerIsTenant === true) {
            paramsString = `retailer=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
        }
        await axios.get(`/api/REMS/agents?${paramsString}`).then(function (res) {
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

        let config = deployConfigs.find((x) => x.id === selectedDeployConfig);
        formValues.name = config.name;
        formValues.id = config.id;
        formValues.retailerId = config.retailer_id;
        if (context.selectedRetailerIsTenant === true) {
            formValues.tenantId = config.tenant_id;
        }
        formValues.storeList = _storeList;
        // formValues.listNames = _listNames,
        // Don't adjust for users time zone i.e we are always in store time.
        // en-ZA puts the date in the design doc format except for an extra comma.
        formValues.dateTime = new Date(_dateTime)
            .toLocaleString('en-ZA', { hourCycle: 'h24' })
            .replace(',', '')
            .replace(' 24:', ' 00:');

        setFormValues(formValues);

        let paramString = `retailerId=${context.selectedRetailer}`
        if (context.selectedRetailerIsTenant === true) {
            paramString = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
        }
        axios.post(`/api/deploy-schedule?${paramString}`, _formValues)
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
    };

    function handleVersionCollisionDialogClose() {
        setVersionCollisionDialogOpen(false);
    }

    function handleSelectDeployConfig(selectedConfig) {
        if (selectedConfig) {
            setSelectedDeployConfig(selectedConfig);
            // retrieve config by name
            // traverse the 'steps' array
            // retrieve any that have 'upload'
            // get file name from there
            const selectedConfigDetailSteps = deployConfigs.find((x) => x.name === selectedConfig.label).steps;
            const newSelectedUploadedFiles = [];
            selectedConfigDetailSteps.forEach((step) => {
                if (step.type === 'upload') {
                    // store the uploaded files in an array, filtered down to the ones that have matches :)
                    newSelectedUploadedFiles.push(allUploads.find((upload) => upload.fileId === step.file));
                    // from here, we have access to an array of files and their associated packages (and their versions)
                    // we can access that array from:
                    // selectedUploadedFiles[index].packages
                }
            });
            setSelectedUploadedFiles(newSelectedUploadedFiles);
        } else {
            setSelectedDeployConfig(null);
            setSelectedUploadedFiles([]);
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
                        <Autocomplete
                            id="select-deploy-config"
                            value={selectedDeployConfig}
                            onChange={(event, selectedConfig) => {
                                handleSelectDeployConfig(selectedConfig);
                            }}
                            options={_options}
                            noOptionsText="Error Loading Package List"
                            renderInput={(params) => (
                                <TextField
                                    sx={{ width: uiWidth }}
                                    {...params}
                                    label="Deploy-Config to Schedule"
                                    InputProps={{ ...params.InputProps, type: 'search' }}
                                    required={true}
                                />
                            )}
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
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Stack>
                </form>
                <Box pt={4}>
                    <Copyright />
                </Box>
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
