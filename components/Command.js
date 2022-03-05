import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React,{Component,useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import fetcher from "../lib/fetcherWithHeader"
import useSWR from "swr";
export default function Command(props) {
  const state = props.st
  const {data, error} = useSWR("/REMS/uploads",fetcher)
  const setState = props.setst
  const handlechange = (event) => {
    state["command"] = event.target.value
    state["arguments"] = {}
    setState(props.id,state)
  };
  const setval = (name) => {
    return function(x) {
		console.log(x)
		state.arguments[name] = x.target.value
		setState(props.id,state)
	}
  }
  const getval = (name,def) => {
	return state.arguments[name] == undefined ? (def == undefined ? "": def) : state.arguments[name]
  }
  const commands = {
    "": function() { return (<div/>) }, // this is the default when no command is selected
    "command": function() { return (
	<div style={{display:"flex", gap:"20px"}}>
      <Select
        value={getval("type","type")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("type")}>
       <MenuItem value="python">python</MenuItem>
       <MenuItem value="shell">shell</MenuItem>
    </Select>
    <TextField label="command" variant="standard" onChange={setval("command")} value={getval("command")}/>
    </div>
    )
	},
    "Unpack": function() { return (
	<div style={{display:"flex", gap:"20px"}}>
    <TextField label="file" variant="standard" onChange={setval("file")} value={getval("file")}/>
	<TextField label="destination" variant="standard" onChange={setval("destination")} value={getval("destination")}/>
    </div>
    )
	},
	"Apply": function() { return (
	<div style={{display:"flex", gap:"20px"}}>
      <Select
        value={getval("type","type")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("type")}>
       <MenuItem value="python">Apply</MenuItem>
       <MenuItem value="shell">Backoff</MenuItem>
    </Select>
    <TextField label="product" variant="standard" onChange={setval("product")} value={getval("product")}/>
    </div>
    )
	},
    "Download": function() { 
	if (error) return <div>error</div>;
    if (!data) return <div>loading...</div>;
	return (<div style={{display:"flex", gap:"20px"}}>
      <Select
        value={getval("file","type")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("file")}>
		{data.map((c) => <MenuItem value={c.filename}>{c.filename}</MenuItem>)};
      </Select>
	  <TextField label="destination" variant="standard" onChange={setval("destination")} value={getval("destination")}/>
      </div>)},
  }
  const listItems = Object.keys(commands).map((c) =>    <MenuItem value={c}>{c}</MenuItem>  );
  let comman = commands[state.command === undefined ? "" : state.command]()
  return (
<div style={{display:"flex", gap:"20px"}}>
  <Select
    value={state.command === undefined ? "" : state.command}
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Command"
	onChange={handlechange}>
  {listItems}
  </Select>
  {comman}
  <Button variant="contained" onClick={() => props.onRemove(props.id)}>Remove</Button>
  </div>
		)
}