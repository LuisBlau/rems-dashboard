import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import SnmpCommand from '../../components/snmpCommand';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { isIPAddress } from 'ip-address-validator';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Copyright from '../../components/Copyright';
import Papa from 'papaparse';
import { Switch } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UserContext from '../../pages/UserContext';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const SuccessToastDuration = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const FailToastDuration = 10000;

const PREFIX = 'snmp';

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

const Input = styled('input')({
    display: 'none',
});

export default function snmp() {
    const [cInit, setcInit] = useState(false);
    const [snmpRequests, setSnmpRequests] = useState({});
    const [snmpTrapPort, setSnmpTrapPort] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [openIpFailure, setOpenIpFailure] = useState(false);
    const [stores, setStores] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [toastFailure, setToastFailure] = useState('');
    const [ips, setIps] = useState([]);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [bulkUpload, setBulkUpload] = useState(false)
    const [fileName, setFileName] = useState('');

    const uploadColumns = [
        { field: 'store', headerName: 'Store Name', width: 150 },
        { field: 'agent', headerName: 'Agent Name', width: 150 },
        { field: 'trapport', headerName: 'Trap Port', width: 100 },
        { field: 'mfg', headerName: 'Manufacturer', width: 150 },
        { field: 'type', headerName: 'Device Type', width: 150 },
        { field: 'ip', headerName: 'IP Address', width: 150 },
    ];
    const allowedExtensions = ['csv'];

    const [uploadedRows, setUploadedRows] = useState([])
    const context = useContext(UserContext)

    useEffect(() => {
        if (context.selectedRetailer) {
            let stringParams = `retailerId=${context.selectedRetailer}&isTenant=false`
            if (context.selectedRetailerParentRemsServerId) {
                stringParams = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
            }
            axios.get(`/api/REMS/stores?${stringParams}`).then(function (res) {
                const packages = [];
                res.data.forEach((v) => {
                    packages.push(v.storeName);
                });
                setStores(packages);
            });
        }
    }, [context.selectedRetailer, context.selectedRetailerParentRemsServerId]);

    const onFileChange = (event) => {
        const inputFile = event.target.files[0];
        if (inputFile) {
            const fileExtension = inputFile?.type.split('/')[1];

            if (!allowedExtensions.includes(fileExtension)) {
                alert('Bulk upload only accepts a CSV file');
                return;
            }

            setFileToUpload(inputFile);
            setFileName(inputFile.name);
        }
    };
    const handleDownload = () => {
        const csvContent = `store,agent,trapport,mfg,type,ip
    ,,,Toshiba,POS Printer,xxx.xxx.xxx.xxx
    ,,,Hobart,Scale,xxx.xxx.xxx.xxx
    ,,,Spectra,Ups,xxx.xxx.xxx.xxx`;

        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a temporary download link
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'sample-snmp.csv');
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up the temporary link
        link.parentNode.removeChild(link);
    };

    const onFileUpload = () => {
        // If user clicks the 'upload file' button without a file we show a error
        if (!fileToUpload) return alert('Enter a valid file')

        const fileExtension = fileToUpload?.type.split('/')[1];

        // Initialize a reader which allows user to read any file or blob.
        const reader = new FileReader();

        // Event listener on reader when the file loads, we parse it and set the data.
        let deviceList = [];
        let id = 0
        if (fileExtension === 'csv') {
            reader.onload = async ({ target }) => {
                Papa.parse(target.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) {
                        let typeAlert = "Only valid types are 'POS Printer', 'Scale', and 'Ups', check capitalization for: \n"
                        let mfgAlert = "Only valid manufacturers are 'Toshiba', 'Hobart', and 'Spectra', check capitalization for: \n"
                        results.data.forEach(x => {
                            let key, keys = Object.keys(x)
                            let n = keys.length
                            let newObj = {}
                            while (n--) {
                                key = keys[n];
                                newObj[key.toLowerCase()] = x[key]
                            }
                            if (newObj.type !== 'Scale' && newObj.type !== 'Ups' && newObj.type !== 'POS Printer') {
                                typeAlert += (newObj.agent).toString() + " : " + newObj.ip + "\n"
                            } else if (newObj.mfg !== 'Hobart' && newObj.mfg !== 'Spectra' && newObj.mfg !== 'Toshiba') {
                                mfgAlert += (newObj.agent).toString() + " : " + newObj.ip + "\n"
                            } else {
                                deviceList.push(newObj)
                            }
                        });
                        let finalAlert = ''
                        if (typeAlert !== "Only valid types are 'POS Printer', 'Scale', and 'Ups', check capitalization for: \n") {
                            finalAlert += (typeAlert + "\n")
                        }
                        if (mfgAlert !== "Only valid manufacturers are 'Toshiba', 'Hobart', and 'Spectra', check capitalization for: \n") {
                            finalAlert += (mfgAlert + "\n")
                        }
                        if (finalAlert !== '') {
                            alert(finalAlert)
                        }
                    },
                });
                if (deviceList.length > 0) {
                    deviceList.forEach(listItem => {
                        listItem.id = id
                        id += 1
                    });
                    setUploadedRows(deviceList)
                }
            };
        } else {
            alert('Invalid file type!')
            return
        }

        reader.readAsText(fileToUpload);
    };

    const handleBulkSubmission = (event) => {
        event.preventDefault();
        // get unique stores, so you can process stores individually
        const uniqueStores = []
        const uniqueStoreRows = _.uniqBy(uploadedRows, x => x.agent)
        uniqueStoreRows.forEach(row => {
            uniqueStores.push({ store: row.store, agent: row.agent, trapport: row.trapport })
        });

        let errorsExist = false

        // for each store, process the records
        uniqueStores.forEach(store => {
            const rowsToProcess = _.filter(uploadedRows, x => x.agent === store.agent)
            let counter = 1
            const subDeviceTypes = {};
            const subDeviceAddresses = {};
            rowsToProcess.forEach(subLoopRow => {
                subDeviceTypes['com.tgcs.retail.snmpDevice.type' + counter.toString()] = subLoopRow.type;
                subDeviceAddresses['com.tgcs.retail.snmpDevice.networkName' + counter.toString()] = subLoopRow.ip;
                counter += 1
            });
            const commandObj = {
                retailer: context.selectedRetailer,
                storeName: store.store,
                agentName: store.agent,
                configFile: "user/rma/rmauser.properties",
                type: "property",
                category: "rma",
                values: [
                    { "com.tgcs.retail.snmpDevices.Enabled": "true" },
                    { "com.tgcs.retail.snmpDevices.count": rowsToProcess.length.toString() },
                    { "com.tgcs.retailer.snmpDevices.trapPort": store.trapport },
                    subDeviceTypes,
                    subDeviceAddresses

                ]
            }
            if (context.selectedRetailerIsTenant === true) {
                commandObj.retailer = context.selectedRetailerParentRemsServerId
            }
            axios.post('/api/sendSNMPRequest', commandObj).then(function (response) {
                if (response.status !== 200) {
                    errorsExist = true
                }
            }).catch(function (error) {
                console.log(error);
                errorsExist = true
            });
        });
        if (!errorsExist) {
            setToastSuccess('Batch Configuration Successfully Saved');
            setOpenSuccess(true);
        } else {
            setToastFailure('An error occured, please check your CSV file for inconsistencies.')
            setOpenFailure(true);
        }
        setTimeout(function () {
            window.location.reload(true);
        }, SuccessToastDuration + 500);
    }

    const addCommand = () => {
        const id = Date.now();
        setSnmpRequests((snmpRequests) => {
            const jasper = Object();
            Object.assign(jasper, snmpRequests); // creating copy of state variable jasper
            jasper[id] = {}; // update the name property, assign a new value
            return jasper;
        });

    };

    const commandList = [];
    for (const x in snmpRequests) {
        const y = snmpRequests[x];
        commandList.push(y);
    }

    const removeCommand = (id) => {
        setSnmpRequests((snmpRequests) => {
            const jasper = Object();

            Object.assign(jasper, snmpRequests); // creating copy of state variable jasper
            delete jasper[id];
            return jasper;
        });
    };

    const setst = (id, state) => {
        setSnmpRequests((snmpRequests) => {
            const jasper = Object.assign({}, snmpRequests); // creating copy of state variable jasper
            jasper[id] = state; // update the name property, assign a new value
            return jasper;
        });
    };

    if (!cInit) {
        setcInit(true);
        addCommand();
    }
    if (stores == null) {
        return 'loading . . .';
    }

    const handleSelectedStore = (e, selectedValue) => {
        setSelectedStore(selectedValue);
        // clears agent when a different store is selected
        setSelectedAgent(null);
        if (selectedValue) {
            if (context.selectedRetailerIsTenant === false) {
                axios.get('/api/REMS/agents?store=' + selectedValue + '&retailer=' + context.selectedRetailer).then(function (res) {
                    const packages = [];
                    res.data.forEach((v) => {
                        packages.push(v.agentName);
                    });
                    setAgents(packages);
                });
            } else {
                axios.get('/api/REMS/agents?store=' + selectedValue + '&retailer=' + context.selectedRetailerParentRemsServerId).then(function (res) {
                    const packages = [];
                    res.data.forEach((v) => {
                        packages.push(v.agentName);
                    });
                    setAgents(packages);
                });
            }
        } else {
            setAgents([])
        }
    };

    const handleSelectedAgent = (e, selectedValue) => {
        setSelectedAgent(selectedValue);
        handleGatherConfig(selectedValue);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const deviceTypes = {};
        const deviceAddresses = {};
        const commandList = [];

        for (const x in snmpRequests) {
            const y = snmpRequests[x];
            commandList.push(y);
        }

        for (const c in commandList) {
            const realidx = parseInt(c) + 1;
            deviceTypes['com.tgcs.retail.snmpDevice.type' + realidx.toString()] = commandList[c].arguments.DeviceType;
            deviceAddresses['com.tgcs.retail.snmpDevice.networkName' + realidx.toString()] =
                commandList[c].arguments.ipaddress;
        }

        const commandObj = {
            retailer: context.selectedRetailer,
            storeName: selectedStore,
            agentName: selectedAgent,
            configFile: 'user/rma/rmauser.properties',
            type: 'property',
            category: 'rma',
            values: [
                {
                    'com.tgcs.retail.snmpDevices.Enabled': 'true',
                },
                {
                    'com.tgcs.retail.snmpDevices.count': commandList.length,
                },
                {
                    'com.tgcs.retailer.snmpDevices.trapPort': snmpTrapPort,
                },
                deviceTypes,
                deviceAddresses,
            ],
        };

        if (context.selectedRetailerIsTenant === true) {
            commandObj.retailer = context.selectedRetailerParentRemsServerId
        }

        axios
            .post('/api/sendSNMPRequest', commandObj)
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
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };

    const handleGatherConfig = (agent) => {
        setSnmpRequests({});
        let retailer = context.selectedRetailer
        if (context.selectedRetailerIsTenant === true) {
            retailer = context.selectedRetailerParentRemsServerId
        }
        // Get config values for agent and stores selected
        axios.get(`/api/getSNMPConfig?retailerId=${retailer}`, { params: { sName: selectedStore, aName: agent } }).then(function (res) {
            if (res.data && res.data.find((o) => o['com.tgcs.retail.snmpDevices.count'])) {
                const snmpDeviceCount = Object.entries(
                    res.data.find((o) => o['com.tgcs.retail.snmpDevices.count'])
                )[0][1];
                let trapPort = '';
                if (res.data.find((o) => o['com.tgcs.retailer.snmpDevices.trapPort']) !== undefined) {
                    trapPort = Object.entries(res.data.find((o) => o['com.tgcs.retailer.snmpDevices.trapPort']))[0][1];
                }
                if (snmpDeviceCount > 0) {
                    const devices = {};
                    for (let i = 1; i <= snmpDeviceCount; i++) {
                        const type = Object.entries(
                            res.data.find((o) => o[`com.tgcs.retail.snmpDevice.type${i}`])
                        )[0][1];
                        const ip = Object.entries(
                            res.data.find((o) => o[`com.tgcs.retail.snmpDevice.networkName${i}`])
                        )[0][1];
                        const device = {
                            arguments: {
                                DeviceType: type,
                                ipaddress: ip,
                            },
                        };
                        devices[i] = device;
                    }
                    setSnmpRequests(devices);
                    setSnmpTrapPort(trapPort);
                }
            }
        });
    };

    const ipChangesAreValid = (ips) => {
        for (let i = 0; i < ips.length; i++) {
            if (!isIPAddress(ips[i].value)) {
                if (openIpFailure === false) {
                    setOpenIpFailure(true);
                }
                return false;
            }
        }
        return true;
    };

    const changeTrapPort = (e) => {
        setSnmpTrapPort(e.target.value);
    };

    return (
        <Root className={classes.content}>
            <Container maxWidth="xl" className={classes.container}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'start', padding: 2 }}>
                        <Typography variant="h6">
                            Bulk Upload
                        </Typography>
                        <Switch checked={bulkUpload} onChange={() => { setBulkUpload(!bulkUpload) }} color="success" />
                    </Box>
                    {bulkUpload &&
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <label htmlFor="contained-button-file">
                                    <Input
                                        accept="*"
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                        onChange={onFileChange}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        component="span"
                                        endIcon={<FindInPageIcon />}
                                        sx={{ width: 250, height: '100%', marginRight: 1 }}
                                    >
                                        Choose CSV To Upload
                                    </Button>
                                </label>
                                <TextField sx={{ height: '100%' }} disabled label="File Name" value={fileName} />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={fileToUpload == null}
                                    onClick={onFileUpload}
                                    endIcon={<CloudUploadIcon />}
                                    sx={{ width: 175, marginLeft: 1 }}
                                >
                                    Upload File
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleDownload}>
                                    Download sample csv file
                                </Button>
                            </Box>
                            {uploadedRows.length > 0 &&
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, height: '73vh' }}>
                                    <DataGrid
                                        columns={uploadColumns}
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 10 } },
                                        }}
                                        rows={uploadedRows}
                                        pageSizeOptions={[5, 10, 15]} />
                                    <Button sx={{ maxWidth: 200, justifySelf: 'center', alignSelf: 'center', margin: 1 }} variant="contained" onClick={handleBulkSubmission}>Submit</Button>
                                </Box>
                            }
                        </Box>
                    }
                    {!bulkUpload &&
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={4.5} />
                                <Grid item>
                                    <Autocomplete
                                        disablePortal
                                        options={stores}
                                        onChange={handleSelectedStore}
                                        value={selectedStore}
                                        sx={{ width: 300, marginBottom: 3 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Store"
                                                value={params}
                                            />
                                        )}
                                    />
                                    <Autocomplete
                                        disabled={agents == null}
                                        disablePortal
                                        options={agents}
                                        value={selectedAgent}
                                        onChange={handleSelectedAgent}
                                        sx={{ width: 300, marginBottom: 3 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Agent"
                                                value={params}
                                            />
                                        )}
                                    />
                                    <TextField
                                        value={snmpTrapPort}
                                        onChange={changeTrapPort}
                                        sx={{ width: 300, marginBottom: 3 }}
                                        label="Trap Port"
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            {
                                Object.keys(snmpRequests).map(function (idx) {
                                    return (
                                        <SnmpCommand
                                            key={'cmd-' + idx}
                                            id={idx}
                                            st={snmpRequests[idx]}
                                            ips={ips}
                                            setIps={setIps}
                                            setst={setst}
                                            onRemove={removeCommand}
                                        />
                                    );
                                })
                            }
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ marginTop: 3, marginLeft: '25%', width: '50%' }}
                                endIcon={<AddTaskIcon />}
                                onClick={addCommand}
                            >
                                Add A New Device
                            </Button>
                            <Button
                                variant="contained"
                                disabled={!ipChangesAreValid(ips)}
                                color="primary"
                                sx={{ marginTop: 1, marginLeft: '25%', width: '50%' }}
                                endIcon={<SaveIcon />}
                                type="submit"
                            >
                                Push To Store
                            </Button>
                        </Box>
                    }

                </form>
                <Box pt={4}>
                    <Copyright />
                </Box>
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
                    open={openIpFailure}
                    autoHideDuration={FailToastDuration}
                    onClose={(event) => {
                        setOpenIpFailure(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>IP Invalid!</AlertTitle>
                        Enter a valid IP Address
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
            </Container>
        </Root>
    );
}
