import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { Component, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';


export default function SnmpCommand(props) {

    const _width = 150

    const [state, setArgs] = useState({"downloads": [], "arguments":{} })

    const setProp = props.setst;
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
    return (
        <Grid container direction='row' >
            <Grid item>
			  <Select
                labelId="Device Type"
                id="device-type"
                value={getval("DeviceType")}
                label="Type"
                onChange={setval("DeviceType")}
              >
                <MenuItem value={"Printer"}>Toshiba POS Printer</MenuItem>
                <MenuItem value={"Scale"}>Hobert Scale</MenuItem>
                <MenuItem value={"UPS"}>Spectra UPS</MenuItem>
              </Select>
			  <TextField value={getval("ipaddress")} onChange={setval("ipaddress")} label="IpAddress" variant="outlined" />
				  {/*<Select
                labelId="Reporting Agent"
                id="reporting-agent"
                value={getval("reportingAgent")}
                label="Type"
                onChange={setval("reportingAgent")}
              >
                <MenuItem value={"POSPrinter"}>POSPrinter</MenuItem>
                <MenuItem value={"Scale"}>Scale</MenuItem>
				  </Select> */}
            </Grid>
            <Button variant="contained" sx={{ margin: 1 }} endIcon={<RemoveDoneIcon />} onClick={() => props.onRemove(props.id)} > Remove Task </Button>
        </Grid>

    )
}