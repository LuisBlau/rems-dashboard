import useSWR from "swr";
import fetcher from "../lib/lib";
import React, {useState} from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Copyright from "../src/Copyright";
import {makeStyles} from "@material-ui/core/styles";
import OverviewReleasePaper from "../components/Release/OverviewReleasePaper";
import TextField from "@material-ui/core/TextField";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';


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

const Console = prop => (
    console[Object.keys(prop)[0]](...Object.values(prop))
    ,null // ➜ React components must return something 
  )

export default function deployStatus() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const {data, error} = useSWR("/REMS/deploys", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  console.log(data);
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>

            
          {
          data
            //.filter((store) => store.store_number.includes(filterText))
            .map((deploy) => (
              <Accordion expanded={expanded === "panel"+deploy.id} onChange={handleChange('panel'+deploy.id)}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel"+deploy.id+"bh-content"}
                id={"panel"+deploy.id+"bh-header"}
                >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {deploy.storeName}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{deploy.apply_time}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                {
                    deploy.steps.map((step,index) => (
                        <Accordion expanded={expanded === "panel"+deploy.id+":"+index} onChange={handleChange('panel'+deploy.id+":"+index)}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={"panel"+deploy.id+":"+index+"bh-content"}
                            id={"panel"+deploy.id+":"+index+"bh-header"}
                            >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Type:{step.type}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Status:{step.status}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {step.output}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
                </AccordionDetails>
              </Accordion>
            ))}
      
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </main>
  );
}
