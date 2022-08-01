import useSWR from "swr";
import fetcher from "../../lib/lib";
import { Button, Grid, Container, LinearProgress, Typography, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';
import { StarIcon, StarHalfIcon } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import CachedIcon from '@mui/icons-material/Cached';
import DirtyLensIcon from '@mui/icons-material/DirtyLens';
import PhotoIcon from '@mui/icons-material/Photo';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Backdrop from '@mui/material/Backdrop';
import React from "react";
import Link from "@mui/material/Link";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { data } from "jquery";
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
function DumpAgent(props) {
  var jsonCommand = { Retailer:props.data.retailer_id, Store:props.data.storeName, Agent:props.data.agentName, Command:"Dump"};
  const dump_link='javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'
  return (
    <Tooltip title="Dump">
      <Link href={dump_link}>
        <IconButton>
          <DirtyLensIcon fontSize="large"/>
        </IconButton>
      </Link>
    </Tooltip>
);
}
function ReloadAgent(props) {
  var jsonCommand = { Retailer:props.data.retailer_id, Store:props.data.storeName, Agent:props.data.agentName, Command:"Reload"};
  const reload_link='javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace("/\s\g","")))) + '")'
  return (
    <Tooltip title="Reload">
      <Link href={reload_link}>
        <IconButton>
          <CachedIcon fontSize="large"/>
        </IconButton>
      </Link>
    </Tooltip>

);
}
function DisplayScreenShot(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    maxWidth: "100%",
    maxHeight: "100%",
  };

  return (
    <div>
      <Tooltip title="Screenshot">
          <IconButton onClick={handleClickOpen}>
            <PhotoIcon fontSize="large"/>
          </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={style}
      >
        <DialogContent>
          <ScreenCapture data={props.data} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScreenCapture(props) {
  
  const {data, error} = useSWR(
    "/REMS/agentScreenShot?storeName="+props.data.storeName+"&agentName="+props.data.agentName
    ,fetcher);

  if (error) return <div>No screenshot </div>;
  if (!data) return <div>loading...</div>;
  return (
    <Root>
      <Typography align="center">
            Screenshot
          </Typography>
      <Typography align="center">
            {data.last_updated}
          </Typography>
      <img class="card-img-top" src={"data:image/png;base64," + data.image} style={{ maxWidth: "100%", maxHeight: "calc(100vh - 64px)" }} alt="Card image cap" />
    </Root>
  );
}
function timeSince(date) {
  var seconds = ((new Date() - new Date(date)) / 1000)

  var interval = seconds / 31536000;
  console.log(String(interval))

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function DisplayMasterStar(props) {
  if (props.data.is_master) {
    return (
      <Grid item xs={12}>
        <Typography>Master</Typography>
      </Grid>
    )
  }
  return (
    <Grid item xs={12}>
        &nbsp;
    </Grid>
  )
}
function DisplayOnOffStatus(props) {
  if (props.data.online) {
    return (
      <Grid item xs={4}>
        <Typography>Online</Typography>
      </Grid>
    )
  }
  return (
    <Grid item xs={4}>
      <Typography>Offline</Typography>
    </Grid>
  )
}

function DisplaySalesApplication(props) {
  const {data, error} = useSWR(
    "/REMS/agents?store="+props.data.storeName+"&agentName="+props.data.agentName,
    fetcher
  );

  if (error) return <div>failed to load </div>;
  if (!data) return <div>loading...</div>;

  var displayData = data[0]?.status
  const isElmo = displayData?.ELMO
  var date = displayData?.snapshot

  if (isElmo) {
    return (
      <grid item xs={12}>
        <Typography>Costl online: {String(timeSince(date=date))}</Typography>
      </grid>
    );
  }
  return (
    <grid item xs={12}>
        <Typography>Unknown application</Typography>
    </grid>
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
    <Grid container>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5">{props.data.agentName}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DisplayMasterStar data={props.data} />
          </Grid>
        </Grid>
        <Grid className={classes.barHeight} container spacing={1}>
          <Grid item xs={4}>
            <DisplayOnOffStatus data={props.data} />
          </Grid>
          <Grid item xs={4}>
            <Typography>OS: {props.data.os}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DisplaySalesApplication data={props.data} />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid className={classes.barHeight} item xs={12}>
            <Typography>Last Update: {timeSince(props.data.last_updated)}</Typography>
          </Grid>
        </Grid>
  {/*
        <Grid container spacing={1}>
          <Grid item xs={12}>
              <Button variant="contained" href={reload_link} size="medium">
                Reload
              </Button>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Link href={dump_link}>
              <Button variant="contained" size="medium">
                Dump
              </Button>
            </Link>
          </Grid>
        </Grid>
  
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Button variant="contained" href={sleep_link} size="medium">
              Sleep
            </Button>
          </Grid>
        </Grid>
*/}
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DumpAgent data={props.data}/>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ReloadAgent data={props.data}/>
            </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DisplayScreenShot data={props.data} />
          </Grid>
        </Grid>
    </Grid>
  );
}
/*
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
*/
