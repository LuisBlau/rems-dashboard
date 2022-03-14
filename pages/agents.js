import React, { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import Copyright from "../src/Copyright";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText"



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
        paddingTop: 50
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

export default function deployScheule() {
    const classes = useStyles();

    const [_agents, setAgents] = useState([]);
    const [_index, setIndex] = useState([]);
    const [_checked, setChecked] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/REMS/agents").then(function (response) {
            console.log("agents response is", response)

            var agents = []
            var agentsIndex = []
            var index = -1;
            response.data.forEach(v => {
                agents.push(v.storeName + ":" + v.agentName)
                handleToggle(++index)
                agentsIndex.push(index)
            })

            console.log("num agents is", _agents.length)
            setAgents(agents);
            setIndex(agentsIndex)
            // alert(agents)

        });
    }, []); //Second opption [] means only run effect on the first render


    const handleToggle = (value) => () => {
        const currentIndex = _checked.indexOf(value);
        const newChecked = [..._checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        var agentsText = "";
        var toastText = "No agents selected!";
        if (_checked && _checked.length > 0) {
            agentsText = _agents[_checked[0]]
            _checked.forEach(val => {
                if (!agentsText.includes(_agents[val])) {

                    agentsText += ", " + _agents[val]
                }
            })
            toastText = "copied : " + agentsText
        }

        navigator.clipboard.writeText(agentsText)
        alert(toastText);
    };

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            <Container sx={{ paddingTop: 10 }} maxWidth="sm" className={classes.container} >
                <Box sx={{}}>
                    <List dense={'true'} disablePadding sx={{ maxWidth: 350 }} >

                        {_index.map((value) => {
                            const labelId = `checkbox-list-label`;
                            return (
                                <ListItem key={value} disablePadding divider={'false'} >
                                    <ListItemButton role={undefined} onClick={handleToggle(value)} >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={_checked.indexOf(value) !== -1}
                                                tabIndex={-1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={_agents[value]} />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}

                    </List>
                </Box>

                <Button variant="contained" color="primary" type="submit" onClick={handleSubmit} >
                    Copy Selected Agents to Clip Board
                </Button>
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </main>
    )
};