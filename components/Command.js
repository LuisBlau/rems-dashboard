import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React,{Component,useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import fetcher from "../lib/fetcherWithHeader"
import axios from 'axios';


export default function Command(props) {

  let [state,setArgs] = useState( {...props.st, "downloads":[] })

  const setProp = props.setst;

  //state["downloads"]= [];
  //setArgs(state);

  const handlechange = (event) => {
    state["type"] = event.target.value
    state["arguments"] = {}
    setProp(props.id,state)
  };
  const setval = (name) => {
    return function(x) {
		state["arguments"][name] = x.target.value
    setArgs(state)
    console.log("After")
		console.log(state)
		setProp(props.id,state)
	}
  }
  const getval = (name) => {
    console.log("Getvalue:"+state["arguments"][name])
	return state["arguments"][name]
  }
  const commands = {
    "": function(props ) { return (<div/>)}, // this is the default when no command is selected
    "shell": function(props) { return (
	<div style={{display:"flex", gap:"20px"}}>
      <Select
        value={getval("cmd","cmd")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("cmd")}>
       <MenuItem value="python">python</MenuItem>
       <MenuItem value="shell">shell</MenuItem>
    </Select>
    <TextField label="command" variant="standard" onChange={setval("command")} value={getval("command")}/>
    <TextField label="path" variant="standard" onChange={setval("path")} value={getval("path")}/>
    </div>
    )
	},
    "unzip": function(props) { return (
	<div style={{display:"flex", gap:"20px"}}>
    <TextField label="file" variant="standard" onChange={setval("file")} value={getval("file")}/>
	<TextField label="destination" variant="standard" onChange={setval("destination")} value={getval("destination")}/>
  <TextField label="distribution" variant="standard" onChange={setval("distribution")} value={getval("distribution")}/>
    </div>
    )
	},
	"apply": function(props) { return (
	<div style={{display:"flex", gap:"20px"}}>
      <Select
        value={getval("type","type")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("type")}>
       <MenuItem value="apply">Apply</MenuItem>
       <MenuItem value="backoff">Backoff</MenuItem>
    </Select>
    <TextField label="product" variant="standard" onChange={setval("product")} value={getval("product")}/>
    </div>
    )
	},
    "upload": function(props) {
	//const [downloads,setDownloads] = useState([])
  console.log("Checked downloads");
    if( state.downloads.length == 0) {
      console.log("Nope!");
    axios.get("/api/REMS/uploads").then(function(response) 
      { console.log("downloads:"); 
        console.log(response); 
        console.log(state);
        setArgs( {...state,
                 "downloads": response });
        });
	return <p>loading</p>
	}
  
	return (<div style={{display:"flex", gap:"20px"}}>
        <Select
        value={getval("file")}
        label="Type"
		labelId="demo-simple-select-label"
        onChange={setval("file")}>
			{state.downloads.data.map((down) =><MenuItem value={down.id}>{down.filename}</MenuItem>)}
      </Select>
	  <TextField label="destination" variant="standard" onChange={setval("destination")} value={getval("destination")}/>
	  </div>)
	}
  }
  const listItems = Object.keys(commands).map((c) =>    <MenuItem value={c}>{c}</MenuItem>  );
  let comman = commands[state.type === undefined ? "" : state.type]()
  return (
<div style={{display:"flex", gap:"20px"}}>
  <Select
    value={state.type === undefined ? "" : state.type}
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Type"
	onChange={handlechange}>
  {listItems}
  </Select>
  {comman}
  <Button variant="contained" onClick={() => props.onRemove(props.id)}>Remove</Button>
  </div>
		)
}