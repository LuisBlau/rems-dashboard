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

export default function deployStatus() {

    const [expanded, setExpanded] = React.useState(false);
    const { data, error } = useSWR("/REMS/deploys", fetcher);

    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                {
                    data.map((deploy) => (
                        <Accordion key={deploy.id} sx={{ "margin": "15px", "bgcolor": "#FAF9F6" }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={"panel" + deploy.id + "bh-content"}
                                id={"panel" + deploy.id + "bh-header"} >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Store: {deploy.storeName + " " + deploy.apply_time}
                                </Typography><StatusBadge itemStatus={deploy.status} />
                            </AccordionSummary>
                            <AccordionDetails>
                                {
                                    deploy.steps.map((step, index) => (
                                        <Accordion key={index} style={{ "margin": "15px" }}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={"panel" + deploy.id + ":" + index + "bh-content"}
                                                id={"panel" + deploy.id + ":" + index + "bh-header"}
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    Type:{step.type}
                                                </Typography><StatusBadge itemStatus={step.status} />
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {
                                                    step.output.map((line) => (
                                                        line
                                                    ))
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    ))
                                }
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
