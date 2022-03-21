// @ts-check

import React, { Component, useState } from 'react';
import { styled } from '@mui/material/styles';
import Container from "@mui/material/Container";
import Command from "../components/createCommands"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import AddTaskIcon from '@mui/icons-material/AddTask';

import axios from 'axios';



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

    const addCommand = () => {
        let id = Date.now();
        setCommands(commands => {
            let jasper = Object.assign({}, commands);   // creating copy of state variable jasper
            jasper[id] = {};                            // update the name property, assign a new value
            return jasper;
        })
    }
    const pushCommands = () => {
        let commandList = []
        for (let x in commands) {
            let y = commands[x]
            commandList.push(y)
        }
        //commandList.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0))
        let commandObj = {
            "name": name,
            "steps": commandList
        }
        console.log(commandObj)
        axios.post('/api/sendCommand', commandObj)
    }

    const removeCommand = (id) => {
        console.log(id)
        setCommands(commands => {
            let jasper = Object.assign({}, commands);  // creating copy of state variable jasper
            delete jasper[id];
            return jasper;
        })
        console.log(commands)
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
    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container} >
                <Grid container direction="column">

                    <Grid item >
                        <h1>Deployment Configuration Commands</h1>
                    </Grid>

                    <Grid item >
                        <TextField label="Deploy-Config Name" variant="filled" sx={{ marginBottom: 3 }} onChange={handleNameChange} value={name} />
                    </Grid>

                    {Object.keys(commands).map(function (idx) {
                        return (<Command id={idx} st={commands[idx]} setst={setst} onRemove={removeCommand} />)
                    })}

                    <Grid item >
                        <Button variant="contained" color='secondary' fullWidth sx={{ marginTop: 2 }} endIcon={<AddTaskIcon/>} onClick={addCommand}>Add Task to Deployment Config</Button>
                    </Grid>

                    <Grid>
                        <Button variant="contained" color='primary' fullWidth sx={{ marginTop: 2 }} endIcon={<SaveIcon/>} onClick={pushCommands}>Save Deployment Configuration</Button>
                    </Grid>

                </Grid>
            </Container>
        </Root>
    );
}