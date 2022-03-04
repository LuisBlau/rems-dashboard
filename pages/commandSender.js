import React,{Component,useState} from 'react';
import fetcher from "../lib/lib.js";
import { createTheme } from '@material-ui/core/styles';
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import DraggableList from "react-draggable-list";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Command from "../components/Command"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
const { v4: uuidv4 } = require('uuid');
const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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
      y["id"] = x
      commandList.push(y)
    }
    commandList.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0))
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commandList)
    };
    fetch('http://127.0.0.1:3001/sendCommand', requestOptions)
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
  if(!cInit) {
    setcInit(true)
    addCommand()
  }
	return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer}/>
          <Container maxWidth="lg" className={classes.container}>
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