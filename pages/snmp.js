import React, { useState,useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Container from "@mui/material/Container";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Box from "@mui/material/Box";
import Copyright from "../src/Copyright";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import AlertTitle from "@mui/material/AlertTitle";
import Typography from '@mui/material/Typography';
import SnmpCommand from "../components/snmpCommand"
import Cookies from 'universal-cookie';

import axios from 'axios';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const Success_Toast = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const Fail_Toast = 10000;

const PREFIX = 'snmpCreate';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    appBarSpacer: `${PREFIX}-appBarSpacer`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`,
    rowItemSX: `${PREFIX}-rowItemSX`
};

const Root = styled('main')((
    {
        theme
    }
) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },

    [`& .${classes.appBarSpacer}`]: {
        paddingTop: 50
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    },

    [`& .${classes.rowItem}`]: {
        m: 1,
        minWidth: 120
    }

}));



export default function snmp(props) {
    const [cInit, setcInit] = useState(false);
    const [name, setName] = useState("");
    const [snmpRequests, setSnmpRequests] = useState({});
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState("")
    const [openFailure, setOpenFailure] = useState(false);
    const [stores, setStores] = useState([]);
	const [agents, setAgents] = useState([]);
	const [selectedStore,setSelectedStore] = useState(null);
	const [selectedAgent,setSelectedAgent] = useState(null);
	const [toastFailure, setToastFailure] = useState("");
    useEffect(() => {
        axios.get("/api/REMS/stores").then(function (res) {
            var packages = []
            res.data.forEach(v => {
                packages.push(v["storeName"])
            })
            setStores(packages);
        })
    }, []);
    const addCommand = () => {
        let id = Date.now();
        setSnmpRequests(snmpRequests => {
            var jasper = Object();
            Object.assign(jasper, snmpRequests);   // creating copy of state variable jasper
            jasper[id] = {};                   // update the name property, assign a new value
            return jasper;
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let commandList = []
        for (let x in snmpRequests) {
            let y = snmpRequests[x]
            commandList.push(y)
        }
		let deviceTypes = {}
		let deviceAddresses = {}
		for (let c in commandList) {
			let realidx = (parseInt(c) + 1)
			deviceTypes["com.tgcs.retail.snmpDevice.type" + realidx.toString()] = commandList[c]["arguments"]["DeviceType"]
			deviceAddresses["com.tgcs.retail.snmpDevice.networkName" + realidx.toString()] = commandList[c]["arguments"]["ipaddress"]
		}
		let cookies = new Cookies();
        let commandObj = {
          "retailer":cookies.get('retailerId'),
          "storeName":selectedStore,
          "agentName": selectedAgent,
          "configFile":"user/rma/rmauser.properties",
          "type":"property",
		  "category":"rma",
		  "values":[
              {
                 "com.tgcs.retail.snmpDevices.Enabled":"true"
              },
              {
                 "com.tgcs.retail.snmpDevices.count":commandList.length
              },
				deviceTypes,
				deviceAddresses

          ]

        }

        axios.post('/api/sendSNMPRequest', commandObj)
            .then(function (response) {
                
                if (response.status != 200) {
                    setToastFailure("Error Saving Deployment!!")
                    setOpenFailure(true)
                    return
                }

                if (response.data.message == "Duplicate") {
                    setToastFailure("Error - Duplicate Deployment")
                    setOpenFailure(true)
                    return 

                }
                

                setToastSuccess("Configuration Successfully Saved.")
                setOpenSuccess(true)

                setTimeout(function () {
                    window.location.reload(true);
                }, Success_Toast + 500)

            })
            .catch(function (error) {
                console.log(error);
                setToastFailure("Error connecting to server!!")
                setOpenFailure(true)
                return
            });

    }

    const removeCommand = (id) => {

        setSnmpRequests(snmpRequests => {

            var jasper = Object();

            Object.assign(jasper, snmpRequests);  // creating copy of state variable jasper
            delete jasper[id];
            return jasper;
        })

    }

    const setst = (id, state) => {
        setSnmpRequests(snmpRequests => {
            let jasper = Object.assign({}, snmpRequests);  // creating copy of state variable jasper
            jasper[id] = state;                     // update the name property, assign a new value
            return jasper;
        })
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    if (!cInit) {
        setcInit(true)
        addCommand()
    }
	if(stores == null) {
		return "loading . . ."
	}
	const handleSelectedStore = (e,selectedValue) => {
		setSelectedStore(selectedValue);
        // clears agent when a different store is selected
        setSelectedAgent(null);
		axios.get("/api/REMS/agents?store=" + selectedValue).then(function (res) {
            var packages = []
            res.data.forEach(v => {
                packages.push(v["agentName"])
            })
            setAgents(packages);
        });
	}
	
	const handleSelectedAgent = (e,selectedValue) => {
		setSelectedAgent(selectedValue);
        handleGatherConfig(selectedValue);
	}

    const handleGatherConfig = (agent) => {
        // Get config values for agent and stores selected
        axios.get("/api/getSNMPConfig", {params: {sName: selectedStore, aName: agent}})
            .then(function (res) {
                if (res.data && res.data.find(o => o["com.tgcs.retail.snmpDevices.count"])) {
                    var snmpDeviceCount = Object.entries(res.data.find(o => o["com.tgcs.retail.snmpDevices.count"]))[0][1];
                    if (snmpDeviceCount > 0) {
                        var devices = {};
                        for(let i = 1; i <= snmpDeviceCount; i++) {
                            var type = Object.entries(res.data.find(o => o[`com.tgcs.retail.snmpDevice.type${i}`]))[0][1];
                            var ip = Object.entries(res.data.find(o => o[`com.tgcs.retail.snmpDevice.networkName${i}`]))[0][1];
                            var device = {
                                "arguments": {
                                    "DeviceType": type,
                                    "ipaddress": ip
                                }
                            }
                            console.log(device);
                            devices[i] = device;
                        }
                        setSnmpRequests(devices);
                    }     
                }
            });
    }
    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="xl" className={classes.container} >
                < form onSubmit={handleSubmit} >
                        <Typography align="center" variant="h3" sx={{ marginBottom: 3 }}>Set SNMP Devices</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={4.5}/>
                            <Grid item>
                                <Autocomplete
                                disablePortal
                                options={stores}
                                onInputChange={handleSelectedStore}
                                value={selectedStore}
                                sx={{ width: 300, marginBottom: 3 }}
                                renderInput={(params) => <TextField {...params} label="Store" value={params} onChange={handleSelectedStore}/>}
                                />
                                <Autocomplete
                                disabled={agents == null}
                                disablePortal
                                options={agents}
                                value={selectedAgent}
                                onInputChange={handleSelectedAgent}
                                sx={{ width: 300, marginBottom: 3 }}
                                renderInput={(params) => <TextField {...params} label="Agent" value={params} onChange={handleSelectedAgent}/>}
                                />
                            </Grid>
                        </Grid>
                        {Object.keys(snmpRequests).map(function (idx) {
                            return (<SnmpCommand key={"cmd-" + idx} id={idx} st={snmpRequests[idx]} setst={setst} onRemove={removeCommand}/>)
                        })}

                        <Button variant="contained" color='secondary' sx={{ marginTop: 3, marginLeft: "25%", width: "50%" }} endIcon={<AddTaskIcon />} onClick={addCommand}>Add Another Device</Button>
                        <Button variant="contained" color='primary' sx={{ marginTop: 1, marginLeft: "25%", width: "50%" }} endIcon={<SaveIcon />} type="submit" >Push To Store</Button>
                    
                </form>

                <Box pt={4}>
                    <Copyright />
                </Box>

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openSuccess}
                    autoHideDuration={Success_Toast}
                    onClose={(event) => { setOpenSuccess(false) }}>
                    <Alert variant="filled" severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        {toastSuccess}
                    </Alert>
                </Snackbar>

                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={openFailure}
                    autoHideDuration={Fail_Toast}
                    onClose={(event) => { setOpenFailure(false) }}>
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Error!!!</AlertTitle>
                        {toastFailure}
                    </Alert>
                </Snackbar>

            </Container>
        </Root>
    );
}

