import React, { Component, useState,useEffect,useReducer } from 'react';
import { styled } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Command from "../components/createCommands"
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Box from "@mui/material/Box";
import Copyright from "../src/Copyright";
import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import AlertTitle from "@mui/material/AlertTitle";
import Typography from '@mui/material/Typography';

import axios from 'axios';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const Success_Toast = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const Fail_Toast = 10000;

const PREFIX = 'deployCreate';

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

export default function Upload(props) {

    const [cInit, setcInit] = useState(false)
    const [name, setName] = useState("")
    const [commands, setCommands] = useState({})

    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState("")
    const [openFailure, setOpenFailure] = useState(false);
    const [deploys, setDeploys] = useState(null)
	const [selectedDeploy,setSelectedDeploy] = useState(null)
	const [toastFailure, setToastFailure] = useState("")
	const [deploySelected, setDeploySelected] = useState("")
    useEffect(() => {
        axios.get("/api/REMS/deploy-configs").then(function (res) {
            console.log("axios response", res)
            var packages = []
            res.data.forEach(v => {
                packages.push(v)
            })
            setDeploys(packages);
        })
    }, []);
    const addCommand = () => {
        let id = Date.now();
        setCommands(commands => {
            var jasper = Object();
            Object.assign(jasper, commands);   // creating copy of state variable jasper
            jasper[id] = {};                   // update the name property, assign a new value
            return jasper;
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        let commandList = []
        for (let x in commands) {
            let y = commands[x]
            commandList.push(y)
        }

        let commandObj = {
            "name": name,
            "steps": commandList
        }

        axios.post('/api/sendCommand', commandObj)
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

        setCommands(commands => {

            var jasper = Object();

            Object.assign(jasper, commands);  // creating copy of state variable jasper
            delete jasper[id];
            return jasper;
        })

    }

    const setst = (id, state) => {
        setCommands(commands => {
            let jasper = Object.assign({}, commands);  // creating copy of state variable jasper
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
	if(deploys == null) {
		return "loading . . ."
	}
	const handleSelectedDeploy = (e,selectedValue) => {
		setCommands({})
		console.log(selectedValue)
		setSelectedDeploy(selectedValue)
		let dep = deploys.filter(d => {return d.name == selectedValue})[0]
		console.log(dep)
		let steps = dep.steps.map(function(s,idx) {
			let obj = {}
			obj["id"] = idx
			obj["type"] = s["type"]
			delete s["type"]
			obj["arguments"] = s
			return obj
		})
		let stepsobj = {}
		for(let v of steps) {
			stepsobj[v["id"]] = v
		}
		console.log(stepsobj)
		setName(selectedValue)
		setCommands(stepsobj)
		setDeploySelected(true)
	}
    const listItems = deploys.map(function(c, index) {
		return { "label": c.name, "id":c.name}
		});
    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container} >
                < form onSubmit={handleSubmit} >
                    <Grid container direction="column">
                        <Typography align="center" variant="h3">Create Deployment Configuration</Typography>
                        <Autocomplete
                          disablePortal
                          options={listItems}
						  disabled={deploySelected}
						  onInputChange={handleSelectedDeploy}
                          sx={{ width: 300 }}
                          renderInput={(params) => <TextField {...params} label="Load From" disabled={deploySelected} value={params} onChange={handleSelectedDeploy}/>}
                        />
                        <Grid item >
                            <TextField label="Deploy-Config Name" variant="filled" sx={{ marginBottom: 3 }} onChange={handleNameChange} value={name} required={true}/>
                        </Grid>

                        {Object.keys(commands).map(function (idx) {

                            return (<Command key={"cmd-" + idx} id={idx} st={commands[idx]} setst={setst} onRemove={removeCommand} />)
                        })}

                        <Button variant="contained" color='secondary' sx={{ marginTop: 3, marginLeft: "16%", width: "50%" }} endIcon={<AddTaskIcon />} onClick={addCommand}>Add Task to Deployment Config</Button>
                        <Button variant="contained" color='primary' sx={{ marginTop: 1, marginLeft: "16%", width: "50%" }} endIcon={<SaveIcon />} type="submit" >Save Deployment Configuration</Button>
                    </Grid>
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