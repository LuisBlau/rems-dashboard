import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
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
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider"


const PREFIX = 'agents';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    appBarSpacer: `${PREFIX}-appBarSpacer`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`
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
    }
}));

export default function deployScheule() {


    const [_agents, setAgents] = useState([]);
    const [_index, setIndex] = useState([]);
    const [_checked, setChecked] = useState([]);
    const [_open, setOpen] = useState(false);
    const [_toast, setToast] = useState("No Agents Selected!")


    useEffect(() => {
        axios.get("/api/REMS/agents").then(function (response) {
            var agents = []
            var agentsIndex = []
            var index = -1;
            response.data.forEach(v => {
                agents.push(v.storeName + ":" + v.agentName)
                handleToggle(++index)
                agentsIndex.push(index)
            })
            setAgents(agents);
            setIndex(agentsIndex)
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
        if (_checked && _checked.length > 0) {
            agentsText = _agents[_checked[0]]
            _checked.forEach(val => {
                if (!agentsText.includes(_agents[val])) {
                    agentsText += ", " + _agents[val]
                }
            })
        }

        navigator.clipboard.writeText(agentsText)

        if (agentsText && agentsText.length > 0) {
            setToast(agentsText)
        }
        else {
            setToast("No Agents Selected!!")
        }
        setOpen(true)
    };

    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container align="center" maxWidth="xs" className={classes.container} >

                <List dense padding={10}>
                    {_index.map((value) => {
                        const labelId = `checkbox-list-label`;
                        return (
                            <ListItem divider={true} key={value}>
                                <ListItemButton onClick={handleToggle(value)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={_checked.indexOf(value) !== -1}
                                            tabIndex={-1}
                                            inputProps={{ 'aria-labelledby': labelId }} />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={_agents[value]} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Button sx={{ margin: 2}} variant="contained" color="primary" type="submit" onClick={handleSubmit} >
                    Copy Selected Agents to Clip Board
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={_open}
                    autoHideDuration={6000}
                    onClose={(event) => { setOpen(false) }}
                    message={_toast}
                />
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}