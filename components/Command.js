import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React,{Component,useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import fetcher from "../lib/fetcherWithHeader"
import axios from 'axios';
export default function Command(props) {
  const state = props.st
  const setState = props.setst
  state["arguments"] = {}
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
  const getval = (name) => {
	return state.arguments[name]
  }
  const commands = {
    "": function(props ) { return (<div/>)}, // this is the default when no command is selected
    "command": function(props) { return (
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
    "Unpack": function(props) { return (
	<div style={{display:"flex", gap:"20px"}}>
    <TextField label="file" variant="standard" onChange={setval("file")} value={getval("file")}/>
	<TextField label="destination" variant="standard" onChange={setval("destination")} value={getval("destination")}/>
    </div>
    )
	},
	"Apply": function(props) { return (
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
    "Download": function(props) {
	const [downloads,setDownloads] = useState([])
    if(downloads.length == 0) {
    axios.get("http://127.0.0.1:3001/REMS/uploads").then(function(response) { setDownloads(response) })
	return <p>loading</p>
	}
  
	return (<div style={{display:"flex", gap:"20px"}}>
        <Select
        value={getval("file")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("file")}>
			{downloads.data.map((down) =><MenuItem value={down.filename}>{down.filename}</MenuItem>)}
      </Select>
	  <TextField label="destination" variant="standard" onChange={setval("destination")} value={getval("destination")}/>
	  </div>)
	}
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