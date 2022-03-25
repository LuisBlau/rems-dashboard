import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import useSWR from "swr";
import fetcher from "../lib/lib.js";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Copyright from "../src/Copyright";
import OverviewReleasePaper from "../components/Release/OverviewReleasePaper";
import TextField from "@mui/material/TextField";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import axios from "axios"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import CardContent from '@mui/material/CardContent';
import WarningIcon from '@mui/icons-material/Warning';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import PendingIcon from '@mui/icons-material/Pending';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StartIcon from '@mui/icons-material/Start';
import Tooltip from '@mui/material/Tooltip';

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
        case "Failed":
            return <Tooltip title="Failed"><WarningIcon /></Tooltip>
        case "InProgress":
            return <Tooltip title="In Progress"><PendingIcon /></Tooltip>
        case "Pending":
            return <Tooltip title="Pending"><WatchLaterIcon /></Tooltip>
        case "Succeeded":
            return <Tooltip title="Succeeded"><CheckCircleIcon /></Tooltip>
        case "initial":
        case "Initial":
            return <Tooltip title="Initial"><StartIcon /></Tooltip>
        default:
            return <p>{props.itemStatus}</p>
    }
}

function StatusColor(status) {
    switch (status) {
        case "Failed":
            return "#FCB3B1";
        case "InProgress":
            return "#B1E0FC";
        case "Pending":
            return "#D6EEFD";
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

export default function deployStatus() {

    const [storeFilter, setStoreFilter] = React.useState("");
    const [packageFilter, setPackageFilter] = React.useState(0);
    const [packageFilterItems, setPackageFilterItems] = React.useState(null);

    if (packageFilterItems == null) {
        axios.get("/api/REMS/deploy-configs").then((resp) => setPackageFilterItems([{ id: 0, name: 'All Configs' }].concat(resp.data)))
        return <p>loading...</p>
    }
    const changeStoreFilter = (e) => {
        setStoreFilter(e.target.value)
    }
    const changePackageFilter = (e) => {
        setPackageFilter(e.target.value)
    }

    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <Typography align="center" variant="h3">Deployment Status</Typography>
                <Box pt={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={3} >
                        </Grid>
                        <Grid item xs={3} >
                            <TextField value={storeFilter} onChange={changeStoreFilter} label="store" />
                        </Grid>
                        <Grid item xs={1} ></Grid>
                        <Grid item xs={4} >
                            <Select
                                value={packageFilter}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Type"
                                onChange={changePackageFilter}
                            >
                                {packageFilterItems.map((i) => <MenuItem key={"mi-" + i} value={i["id"]}>{i["name"]}</MenuItem>)}
                            </Select>
                        </Grid>
                    </Grid>
                </Box>

                <DeployTable storeFilter={storeFilter} packageFilter={packageFilter} />
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}


function DeployTable(props) {
    const [expanded, setExpanded] = React.useState(false);
    const { data, error } = useSWR("/REMS/deploys?store=" + props.storeFilter + "&package=" + props.packageFilter, fetcher);
    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;

    return (<div>
        {
            data.map((deploy, index) => (
                <Accordion key={"a-deploy-" + index} style={{ "margin": "15px" }}>
                    <AccordionSummary
                        key={"as-deploy-" + index}
                        style={{ "backgroundColor": StatusColor(deploy.status) }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel" + deploy.id + "bh-content"}
                        id={"panel" + deploy.id + "bh-header"}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={1} >
                                <StatusBadge itemStatus={deploy.status} />
                            </Grid>
                            <Grid item xs={2} >
                                <Typography sx={{ flexShrink: 0 }}>
                                    Store: {deploy.storeName}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} >
                                <Typography sx={{ flexShrink: 0 }}>
                                    Config Name: {deploy.package}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} >
                                <Typography sx={{ flexShrink: 0 }}>
                                    Status: {deploy.status}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} >
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
                                        {step.output.map((line) => (line + "\n"))}
                                    </AccordionDetails>
                                </Accordion>
                            )

                            )
                        }
                    </AccordionDetails>
                </Accordion>
            ))}
    </div>)
}