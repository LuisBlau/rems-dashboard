import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { Component, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import FormControl from '@mui/material/FormControl';

import axios from 'axios';


export default function Command(props) {

    const _width = 150

    let [state, setArgs] = useState({ ...props.st, "downloads": [] })

    const setProp = props.setst;

    const handlechange = (event) => {
        state["type"] = event.target.value
        state["arguments"] = {}
        setProp(props.id, state)
    };
    const setval = (name) => {
        return function (x) {
            state["arguments"][name] = x.target.value
            setArgs(state)
            console.log("After")
            console.log(state)
            setProp(props.id, state)
        }
    }
    const getval = (name) => {
        // console.log("Getvalue:" + state["arguments"][name])
        return state["arguments"][name]
    }
    const commands = {
        "": function (props) { return (<div />) }, // this is the default when no command is selected
        "shell": function (props) {
            return (
                <div style={{ display: "flex", gap: "20px" }}>
                    <FormControl required={true} >
                        <Select sx={{ margin: 1, width: _width }}
                            value={getval("cmd", "cmd")}
                            label="Type"
                            labelId="demo-simple-select-label"
                            onChange={setval("cmd")}>
                            <MenuItem value="python">python</MenuItem>
                            <MenuItem value="shell">shell</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="command" variant="standard" onChange={setval("args")} value={getval("args")} required={true} />
                </div>
            )
        },
        "unzip": function (props) {
            return (
                <div style={{ display: "flex", gap: "20px" }}>
                    <TextField sx={{ marginLeft: 1, width: _width, marginRight: 1 }} label="file" variant="standard" onChange={setval("file")} value={getval("file")} required={true} />
                    <TextField label="destination" variant="standard" onChange={setval("directory")} value={getval("directory")} required={true} />
                    <TextField label="distribution" variant="standard" onChange={setval("distribute")} value={getval("distribute")} required={true} />
                </div>
            )
        },
        "apply": function (props) {
            return (
                <div style={{ display: "flex", gap: "20px" }}>
                    <FormControl required={true} >
                        <Select sx={{ margin: 1, width: _width }}
                            value={getval("command", "command")}
                            label="Type"
                            labelId="demo-simple-select-label"
                            onChange={setval("command")}>
                            <MenuItem value="apply">Apply</MenuItem>
                            <MenuItem value="backout">Backoff</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="product" variant="standard" onChange={setval("product")} value={getval("product")} required={true} />
                    <TextField variant="standard" sx={{ visibility: "hidden" }} />
                </div>
            )
        },
        "upload": function (props) {
            console.log("Checked downloads");
            if (state.downloads.length == 0) {
                console.log("Nope!");
                axios.get("/api/REMS/uploads").then(function (response) {
                    console.log("downloads:");
                    console.log(response);
                    console.log(state);
                    setArgs({
                        ...state,
                        "downloads": response
                    });
                });
                return <p>loading</p>
            }

            return (
                <div style={{ display: "flex", gap: "20px" }}>
                    <FormControl required={true} >
                        <Select sx={{ margin: 1, width: _width }}
                            value={getval("file")}
                            label="Type"
                            labelId="demo-simple-select-label"
                            onChange={setval("file")}>
                            {state.downloads.data.map((down, index) => <MenuItem key={"dn-" + index} value={down.id}>{down.description}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label="Destination Folder" variant="standard" onChange={setval("to_location")} value={getval("to_location")} required={true} />
                    <TextField label="Destination Filename" variant="standard" onChange={setval("filename")} value={getval("filename")} required={true} />
                </div>
            )
        }
    }
    const listItems = Object.keys(commands).map((c, index) => <MenuItem key={"c-" + index} value={c}>{c}</MenuItem>);
    let command = commands[(!state.type || state.type === undefined) ? "" : state.type]()
    return (
        <Grid container direction='row' >
            <Grid item>
                <Select sx={{ margin: 1, width: 120 }}
                    value={state.type === undefined ? "" : state.type}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handlechange}>
                    {listItems}
                </Select>
            </Grid>
            {command}
            <Button variant="contained" sx={{ margin: 1 }} endIcon={<RemoveDoneIcon />} onClick={() => props.onRemove(props.id)} > Remove Task </Button>
        </Grid>

    )
}