import React, {useState} from "react";
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
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';


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

const Console = prop => (
    console[Object.keys(prop)[0]](...Object.values(prop))
    ,null // ➜ React components must return something 
  )

export default function deployStatus() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  
  const {data, error} = useSWR("/REMS/deploys", fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  console.log(data);
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>
      <div>
            
          {
          data
            //.filter((store) => store.store_number.includes(filterText))
            .map((deploy) => (
              <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel"+deploy.id+"bh-content"}
                id={"panel"+deploy.id+"bh-header"}
                >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {deploy.storeName} {deploy.apply_time} -- {deploy.status}
                </Typography>
                </AccordionSummary>
                <AccordionDetails>
                {
                    deploy.steps.map((step,index) => (
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={"panel"+deploy.id+":"+index+"bh-content"}
                            id={"panel"+deploy.id+":"+index+"bh-header"}
                            >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Type:{step.type} Status:{step.status}
                            </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                    {
                                    step.output.map((line) => (
                                        <div>{line}</div>
                                    ))}   
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
                </AccordionDetails>
              </Accordion>
            ))}
      </div>
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </main>
  );
}
