import React,{Component,useState} from 'react';
import fetcher from "../lib/lib.js";
import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Container from "@mui/material/Container";
import DraggableList from "react-draggable-list";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Command from "../components/Command"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: {
    paddingTop: 60
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));
  
export default function Upload(props) {
  const classes = useStyles();
  const [cInit,setcInit] = useState(false)
  const [name,setName] = useState("untitled Command List")
  const [commands,setCommands] = useState({})
  const handleRemoveCommand = (idx) => {
    console.log(commands)
	console.log(commands.filter((r) => r.id != idx))
    setCommands(commands.filter((r) => r.id != idx));
  };
  const addCommand = () => {
    let id=Date.now();
    setCommands(commands => {
      let jasper = Object.assign({}, commands);  // creating copy of state variable jasper
      jasper[id] = {};                     // update the name property, assign a new value                 
      return jasper;
    })
  }
  const pushCommands = () => {
    let commandList = []
    for(let x in commands) {
      let y = commands[x]
      commandList.push(y)
    }
    //commandList.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0))
    let commandObj = {
        "name":name,
        "steps":commandList
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
  const setst = (id,state) => {
    setCommands(commands => {
      let jasper = Object.assign({}, commands);  // creating copy of state variable jasper
      jasper[id] = state;                     // update the name property, assign a new value                 
      return jasper;
    })
  }
  const handleNameChange = (e) => {
    setName(e.target.value)
  }
  if(!cInit) {
    setcInit(true)
    addCommand()
  }
	return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
          <Container maxWidth="lg" className={classes.container} style={{margin:100}}>
		   <h2>Upload Commands</h2>
		   <TextField label="file" variant="standard" onChange={handleNameChange} value={name}/>
		   <div>
		      {Object.keys(commands).map(function(idx){
              return (<Command id={idx} st={commands[idx]} setst={setst} onRemove={removeCommand}/>)
          })}
		<Button variant="contained" onClick={addCommand}>Add Command</Button>
		<Button variant="contained" onClick={pushCommands}>Push Commands</Button>
             </div>
          </Container>
        </main>
	);
}