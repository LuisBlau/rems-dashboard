import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";
import Link from "@mui/material/Link";
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


export default function OverviewStorePaper(props) {


  const store_link = "/storeStatus"
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Link href={"/store/agentOverview?store="+props.data.storeName}>
          <Typography variant="h5">{props.data.storeName}</Typography></Link>
      </Grid>
      <Grid className={classes.barHeight} item xs={8}>
        <ColoredProgressBar percent={(100 * props.data.onlineAgents / props.data.totalAgents) }/>
      </Grid>
      <Grid item xs={4}>
        <Typography>Last Check: {props.data.last_updated}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Online Agents: {props.data.onlineAgents} of {props.data.totalAgents}</Typography>
      </Grid>
      {/*<Buttons
        store={store_link}
      />*/}
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
