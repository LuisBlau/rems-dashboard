import useSWR from "swr";
import fetcher from "../../lib/lib";
import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";
import Link from "@mui/material/Link";
const PREFIX = 'OverviewAgentPaper';

const classes = {
  barHeight: `${PREFIX}-barHeight`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.barHeight}`]: {
    height: 50
  }
}));



function ScreenCapture(props) {
  const {data, error} = useSWR(
    "/REMS/agentScreenShot?storeName="+props.data.storeName+"&agentName="+props.data.agentName 
    ,fetcher);


  if (error) return <div>No screenshot </div>;
  if (!data) return <div>loading...</div>;
  return (
    <Root>
          <Typography>
            Screenshot
          </Typography>
          <Typography>
            {data.last_updated}
          </Typography>
          <img class="card-img-top" src={"data:image/png;base64," + data.image} width={300} height={300} alt="Card image cap" />
    </Root>
  );
}

export default function OverviewAgentPaper(props) {

  var jsonCommand = { Retailer:props.data.retailer_id, Store:props.data.storeName, Agent:props.data.agentName, Command:"Reload"};
  const reload_link='javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'
  jsonCommand.Command = "Dump";
  const dump_link=         'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'
  jsonCommand.Command = "ScreenCapture";
  const screencapture_link='javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'
  jsonCommand.Command = "Wake";
  const wake_link='javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'
  jsonCommand.Command = "Sleep";
  const sleep_link='javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'



  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
          <Typography variant="h5">{props.data.agentName}</Typography>
      </Grid>
      <Grid className={classes.barHeight} item xs={3}>
        <Typography>OS: {props.data.os}</Typography>
      </Grid>
      <Grid className={classes.barHeight} item xs={3}>
        <Typography>Online: {String(props.data.online)}</Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography>Last Check: {props.data.last_updated}</Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography>Master: {String(props.data.is_master)}</Typography>
      </Grid>
      <Grid item xs={3}>
      </Grid>
      
      <Grid item xs={2}>
        <Link href={reload_link}>
          <Button variant="contained" size="medium">
            Reload
          </Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link href={dump_link}>
          <Button variant="contained" size="medium">
            Dump
          </Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link href={sleep_link}>
          <Button variant="contained" size="medium">
            Sleep
          </Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link href={wake_link}>
          <Button variant="contained" size="medium">
            Reload
          </Button>
        </Link>
      </Grid>
      <Grid item xs={2}>
        <Link href={screencapture_link}>
          <Button variant="contained" size="medium">
            Screen Shot
          </Button>
        </Link>
      </Grid>
      <Grid item xs={10}>
        <ScreenCapture data={props.data} />
      </Grid>
    </Grid>
  );
}

function ColoredProgressBar(props) {
  const color = props.percent > 50 ? "primary" : "secondary";
  return (
    <LinearProgress
      style={{height: "7px" }}
      height={100}
      variant={"determinate"}
      value={props.percent}
      color={color}
    />
  );
}

function Buttons(props) {
  return (
    <Root>
      
      <Grid item xs={4}>
        <Link href={props.reload}>
          <Button variant="contained" size="large">
            Reload
          </Button>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link href={props.dump}>
          <Button variant="contained" size="large">
            Dump
          </Button>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link href={props.sleep}>
          <Button variant="contained" size="large">
            Sleep
          </Button>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link href={props.wake}>
          <Button variant="contained" size="large">
            Reload
          </Button>
        </Link>
      </Grid>
      <Grid item xs={4}>
        <Link href={props.screenshot}>
          <Button variant="contained" size="large">
            Screen Shot
          </Button>
        </Link>
      </Grid>
      
    </Root>
  );
}
