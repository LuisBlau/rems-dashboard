import React, { useState } from "react";
import fetcher from "../lib/lib.js";
import Copyright from "../src/Copyright";
import axios from "axios"

import { styled } from '@mui/material/styles';
import useSWR from "swr";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel'
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PendingIcon from '@mui/icons-material/Pending';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StartIcon from '@mui/icons-material/Start';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusAlertIcon from '@mui/icons-material/BusAlert';


const PREFIX = 'deployStatus';

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

const Console = prop => (
    console[Object.keys(prop)[0]](...Object.values(prop))
    , null // ➜ React components must return something
)

function StatusBadge(props) {
    switch (props.itemStatus) {
        case "cancel":
        case "Cancel":
            return <Tooltip title="Canceling"><CancelScheduleSendIcon /></Tooltip>
        case "cancelled":
        case "Cancelled":
            return <Tooltip title="Cancelled"><CancelIcon /></Tooltip>
        case "Failed":
            return <Tooltip title={ props.itemDescription ? props.itemDescription :  "Failed"}><WarningIcon /></Tooltip>
        case "InProgress":
            return <Tooltip title="In Progress"><PendingIcon /></Tooltip>
        case "Pending":
            return <Tooltip title="Pending"><WatchLaterIcon /></Tooltip>
        case "Staged":
            return <Tooltip title="Staged"><WatchLaterIcon /></Tooltip>
        case "Success":
        //TODO: remove this after REMS CHANGE.
        case "Succeeded":
            return <Tooltip title="Success"><CheckCircleIcon /></Tooltip>
        case "initial":
        case "Initial":
            if (props.itemDescription)
                return <Tooltip title={props.itemDescription}><BusAlertIcon /></Tooltip>
            else
                return <Tooltip title="Initial"><StartIcon /></Tooltip>
        default:
            return <p>{props.itemStatus}</p>
    }
}

function StatusColor(status) {
    switch (status) {
        case "cancel":
        case "Cancel":
            return "#F2FAAB"
        case "cancelled":
        case "Cancelled":
            return "#FACAA4"
        case "Failed":
            return "#FCB3B1";
        case "InProgress":
            return "#B1E0FC";
        case "Pending":
        case "Staged":
            return "#D6EEFD";
        case "Success":
        //TODO: remove this after REMS CHANGE.
        case "Succeeded":
            return "#CDFEB6";
        case "initial":
        case "Initial":
            return "#FAF9F6";
        default:
            return "#FAF9F6";
    }
}

function StepCommands(step) {
    switch (step.type) {
        case "shell":
            return step.cmd + "--" + step.args;
        case "upload":
            return step.filename;
        case "unzip":
            return step.file;
        case "apply":
            return step.product;
    }
    return "";
}

export default function DeployStatus() {

    // Max number of records to pull from database. 0 = all records.
    const maxRecords = 20;

    const [storeFilter, setStoreFilter] = React.useState("");
    const [packageFilter, setPackageFilter] = React.useState(0);
    const [packageFilterItems, setPackageFilterItems] = React.useState(null);
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [statusFilterItems, setStatusFilterItems] = React.useState(null);

    if (packageFilterItems == null) {
        axios.get("/api/REMS/deploy-configs").then((resp) => setPackageFilterItems([{ id: 0, name: 'All Configs' }].concat(resp.data)))
        return <p>loading...</p>
    }

    if (statusFilterItems == null) {
        setStatusFilterItems([{ id: 'All', name: 'All Status'}, { id: 'Pending', name: 'Pending'}, { id: 'Failed', name: 'Failed'}, { id: 'Success', name: 'Success'}, { id: 'Cancelled', name: 'Cancelled'}])
        return <p>loading...</p>
    }
    
    const changeStoreFilter = (e) => {
        setStoreFilter(e.target.value)
    }
    const changePackageFilter = (e) => {
        setPackageFilter(e.target.value)
    }

    const changeStatusFilter = (e) => {
        setStatusFilter(e.target.value)
    }

    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Typography align="center" variant="h3">Deployment Status</Typography>
                <Box pt={2}>
                    <Grid container spacing={4}>
                        <Grid item xs={1} >
                        </Grid>
                        <Grid item xs={3} >
                            <TextField value={storeFilter} onChange={changeStoreFilter} label="store" />
                        </Grid>
                        <Grid item xs={2} >
                            <Select
                                value={statusFilter}
                                labelId="demo-simple-select-label-status"
                                id="demo-simple-select-status"
                                label="Type"
                                onChange={changeStatusFilter}
                            >
                                {statusFilterItems.map((i) => <MenuItem key={i} value={i["id"]}>{i["name"]}</MenuItem>)}
                            </Select>
                        </Grid>
                        <Grid item xs={4} >
                            <Select
                                value={packageFilter}
                                labelId="demo-simple-select-label-type"
                                id="demo-simple-select-type"
                                label="Type"
                                onChange={changePackageFilter}
                            >
                                {packageFilterItems.map((i) => <MenuItem key={"mi-" + i} value={i["id"]}>{i["name"]}</MenuItem>)}
                            </Select>
                        </Grid>
                    </Grid>
                </Box>

                <DeployTable
                    storeFilter={storeFilter}
                    packageFilter={packageFilter}
                    maxRecords={maxRecords}
                    statusFilter={statusFilter}
                />

                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}

function DeployTable(props) {

    const { data, error } = useSWR("/REMS/deploys?store=" + props.storeFilter +
        "&package=" + props.packageFilter +
        "&records=" + props.maxRecords + 
        "&status=" + props.statusFilter, fetcher);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;


    const handelCancel = (event) => {
        //If we use these much we can install 'http-status-codes'
        const INTERNAL_SERVER_ERROR = 500;
        const NOT_FOUND = 404;
        const NOT_MODIFIED = 304;
        const OK = 200;

        const deployInfo = event.currentTarget.id.split("_")
        const deployUpdate = {
            storeName: deployInfo[0],
            id: deployInfo[1]
        }

        axios.post('api/deploy-cancel', deployUpdate)
            .then((response) => {
                console.log("cancel response : ", response)
                // This worked so reload the page to show the new status.
                window.location.reload(true);
            })
            .catch((error) => {
                console.log("cancel error message: ", error.response.data.message)
                console.log("cancel error status : ", error.response.request.status)
                console.log("cancel error statusText : ", error.response.request.statusText)
                switch (error.response.request.status) {
                    case NOT_MODIFIED:
                    case NOT_FOUND:
                        alert("Unable to cancel.")
                        break;
                    case INTERNAL_SERVER_ERROR:
                        alert("Internal Server Error")
                        break;
                    default:
                        alert("Cancel Error.")
                        break;
                }
            });
    }

    return (
        data.map((deploy, index) => (
            <Grid key={"gc1-" + index} container alignItems={"center"} spacing={1} >
                <Grid item xs={10}>
                    <Accordion key={"a-deploy-" + index} sx={{ "margin": 1 }}>
                        <AccordionSummary
                            key={"as-deploy-" + index}
                            style={{ "backgroundColor": StatusColor(deploy.status) }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={"panel" + deploy.id + "bh-content"}
                            id={"panel" + deploy.id + "bh-header"}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={1} >
                                    <StatusBadge itemStatus={deploy.status} itemDescription={deploy.reason} />
                                </Grid>
                                <Grid item xs={2} >
                                    <Typography sx={{ flexShrink: 0 }}>
                                        Store: {deploy.storeName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} >
                                    <Typography sx={{ flexShrink: 0 }}>
                                        Package: {deploy.package}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} >
                                    <Typography sx={{ flexShrink: 0 }}>
                                        Status: {deploy.status}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                    <Typography sx={{ flexShrink: 0 }}>
                                        Apply Time: {deploy.apply_time}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            {
                                deploy.steps.map((step, index) => (
                                    < Accordion key={index} style={{ "margin": "15px", "backgroundColor": StatusColor(step.status) }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={"panel" + deploy.id + ":" + index + "bh-content"}
                                            id={"panel" + deploy.id + ":" + index + "bh-header"} >
                                            <Grid container spacing={3}>
                                                <Grid item xs={1} >
                                                    <StatusBadge itemStatus={step.status} />
                                                </Grid>
                                                <Grid item xs={4} >
                                                    <Typography sx={{ flexShrink: 0 }}>
                                                        {step.type == "apply" ? step.command : step.type} -- {StepCommands(step)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ bgcolor: "#FFEBE0" }}>
                                            {step.output.map((line, idx) => (<p key={"l-" + index + "-" + idx} >{line}</p>))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            }
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid item xs={2}>
                    <Button
                        // Do not change this. We use it to know which deployment to cancel
                        id={deploy.storeName + "_" + deploy.id}
                        variant="contained"
                        sx={{ height: "55px", width: "155px" }}
                        disabled={
                            deploy.status != "initial" &&
                            deploy.status != "Initial" &&
                            deploy.status != "Pending" &&
                            deploy.status != "pending"
                        }
                        onClick={handelCancel}
                    >
                        Cancel
                    </Button>
                </Grid>
            </Grid >
        ))
    )
};