import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";
import Link from "@mui/material/Link";
import StoreIcon from '@mui/icons-material/Store';
import PieChart, {Connector, Label, Legend, Series, Size} from 'devextreme-react/pie-chart';
import Chart  from 'devextreme-react/chart';

const PREFIX = 'OverviewStorePaper';

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


function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " year" + ((Math.floor(interval)!=1)?"s":"")+" ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " month" + ((Math.floor(interval)!=1)?"s":"")+" ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " day" + ((Math.floor(interval)!=1)?"s":"")+" ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hour" + ((Math.floor(interval)!=1)?"s":"")+" ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minute" + ((Math.floor(interval)!=1)?"s":"")+" ago";
  }
  return Math.floor(seconds) + " second" + ((Math.floor(seconds)!=1)?"s":"")+" ago";
}

export default function OverviewStorePaper(props) {
  const store_link = "/storeStatus"

  var onlineAgents = [{ Type:"Online",Count:props.data.onlineAgents},{Type:"Offline", Count:props.data.totalAgents-props.data.onlineAgents}]
  var paletteCollection = ['Green', 'Red']

  function customizeText({argument, value}) {
    return `${argument}: ${value}`;
  }

  return (
    <Grid container>
      <Grid item container xs={2}>
        <StoreIcon fontSize="large"></StoreIcon>
      </Grid>
      <Grid item xs={5}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Link href={"/store/agentOverview?store="+props.data.storeName}>
            <Typography variant="h5">{props.data.storeName}</Typography></Link>
            <Typography>Updated: {timeSince(props.data.last_updated_sec*1000)}</Typography>
            <Typography>Online: {props.data.onlineAgents} of {props.data.totalAgents}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={3}>
        <PieChart id={"pie" + props.title} dataSource={onlineAgents}
                    palette={paletteCollection} title={props.title} >
            <Legend visible={false}/>
            <Series
              argumentField="Type"
              valueField="Count"
            >
              <Label visible={false} customizeText={customizeText}>
                <Connector visible={false} width={1}/>
              </Label>
            </Series>
            <Size width={200} height={75}/>
        </PieChart>
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
      
      <Grid item xs={16}>
        <Link target={"_blank"} href={props.store}>
          <Button variant="contained" size="large">
            Store Status
          </Button>
        </Link>
      </Grid>
      
    </Root>
  );
}
