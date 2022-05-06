import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Copyright from "../src/Copyright";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormControlLabel } from "@mui/material";



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


function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

const storeInformation = {
    "_id" : "",
    "id" : "",
    "retailer_id" : "",
    "list_name" : "",
    "agents": []
}

export default function agentSelect() {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [agents, setAgents] = useState([]);
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState("No Agents Selected!");
    const [onlyMasters, setOnlyMasters] = useState(false);
    const [listName, setListName] = useState("");
    const [storeFilter, setStoreFilter] = React.useState(0);
    const [storeFilterItems, setStoreFilterItems] = React.useState([]);


    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const changeStoreFilter = (e) => {
        setStoreFilter(e.target.value);
    };

    const handleListName = (e) => {
        setListName(e.target.value);
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        //setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        //setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        //setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        //setLeft(left.concat(right));
        setRight([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        var agentsText = "No Agents Selected!!";
        if (right && right.length > 0) {
            agentsText = agents[right[0]]
            right.forEach(val => {
                if (!agentsText.includes(agents[val])) {
                    agentsText += ", " + agents[val]
                }
            })
            navigator.clipboard.writeText(agentsText)

        }

        if(listName) {
            storeInformation.list_name = listName;
        }else {

            for (let i=0; i < storeFilterItems.length; i++) {
                if (storeFilterItems[i].id === storeFilter) {
                    storeInformation._id = storeFilterItems[i]._id;
                    storeInformation.id = storeFilterItems[i].id;
                    storeInformation.retailer_id = storeFilterItems[i].retailer_id;
                    storeInformation.list_name = storeFilterItems[i].list_name;
                    break;
                }
            }
        }

        storeInformation.agents = [];
        right.forEach(val => { 
            storeInformation.agents.push(agents[val]);
        });

        axios.post('/api/REMS/save-store-data', storeInformation)
            .then(function (response) {
                if (response.status != 200) {
                    setToast("Error Saving Store-list!!")
                    setOpen(false)
                    return
                }
            })
            .catch(function (error) {
                setToast("Error connecting to server!!")
                setOpen(false)
                return
            });

        setToast("Configuration Successfully Saved.")
        setOpen(true)

    };


    const handleMasterChange = (event) => {
        setOnlyMasters(event.target.checked)
    }

    useEffect(() => {

        setAgents([]);
        setLeft([]);
        setRight([]);
        setStoreFilterItems([]);

    
        const dbEndpoint = "/api/REMS/agents?onlyMasters=" + onlyMasters;
        console.log("database endpoint : ", dbEndpoint)
        var _index = -1;
        var agents = []

        axios.get(dbEndpoint).then(function (response) {
            var agentsIndex = []
            response.data.forEach(dbItem => {

                var listItem = dbItem.storeName;
                if (!onlyMasters) {
                    listItem = listItem + ":" + dbItem.agentName
                }

                agents.push(listItem)
                handleToggle(++_index)
                agentsIndex.push(_index)
            })

            // setAgents(agents);
            setLeft(agentsIndex)

        });
       
        axios.get("/api/REMS/store-list").then((resp) => setStoreFilterItems([{ id: 0, list_name: 'Select Store' }].concat(resp.data)));

        if(!listName) {
            const getAgentsDBPoint = "/api/REMS/specific-store-agent-names?storeId=" + storeFilter;
            console.log("database endpoint : ", getAgentsDBPoint)

            axios.get(getAgentsDBPoint).then(function (response) {
                // var agentsArray = []
                var agentsIndex = []
                // var _index = -1;
                response.data.forEach(dbItem => {

                    console.log("DB Item:"+dbItem);

                    agents.push(dbItem)
                    handleToggle(++_index)
                    agentsIndex.push(_index)
                })

                setAgents(agents);
                setRight(agentsIndex);

            });
        }
        

    }, [onlyMasters, storeFilter]);


    const customList = (title, items) => (
        <Card>
            <Divider />
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={
                            numberOfChecked(items) === items.length && items.length !== 0
                        }
                        indeterminate={
                            numberOfChecked(items) !== items.length &&
                            numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            "aria-label": "all items selected"
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 200,
                    height: 400,
                    overflow: "auto"
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        "aria-labelledby": labelId
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={agents[value]} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Typography marginTop={5} align='center' variant="h3">Select Agents for Deployment</Typography>

            <Grid container direction="column" align="center" spacing={3} justifyContent="center" alignItems="center">

                <Grid item xs={2} spacing={2} sx={{margin: 3 }}>
                    <Select
                        value={storeFilter}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Type"
                        onChange={changeStoreFilter}
                    >
                        {storeFilterItems.map((i) => <MenuItem key={i} value={i["id"]}>{i["list_name"]}</MenuItem>)}
                    </Select>
                </Grid>

                <Grid item sx={{ margin: 2 }} >
                    <TextField label="storeName" variant="standard" onChange={handleListName} value={listName} />
                </Grid>
                
                <Grid item sx={{ margin: 2 }} >
                    <FormControlLabel
                        checked={onlyMasters}
                        onChange={handleMasterChange}
                        control={<Checkbox />}
                        label="Show Only Master Agents" />
                </Grid>

                <Grid container align="center" spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>{customList("Choices", left)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 10 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllRight}
                                disabled={left.length === 0}
                                aria-label="move all right"
                            >
                                ≫
                            </Button>

                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>

                            <Button
                                sx={{ my: 10 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllLeft}
                                disabled={right.length === 0}
                                aria-label="move all left"
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList("Chosen", right)}</Grid>
                </Grid>
                <Button sx={{ my: 5 }} variant="contained" color="primary" type="submit" onClick={handleSubmit} >
                    Submit
                </Button>
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                autoHideDuration={6000}
                onClose={(event) => { setOpen(false) }}
                message={toast}
            />
            <Box pt={4}>
                <Copyright />
            </Box>
        </Root>

    );
}