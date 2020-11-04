import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Copyright from "../../src/Copyright";
import Box from "@material-ui/core/Box";
import {RealtimeCharts} from "../../components/RealtimeCharts";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import {Button} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useSWR from "swr";
import fetcher from "../../lib/fetcherWithHeader";

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

export default function Realtime() {
  const [state, setState] = useState({
    "store": 0,
    "hours": 0,
    "regOrSnap": "registers"
  })

  function setStore(store) {
    setState(prevState => ({ ...prevState, store }))
    console.log("new state: " + JSON.stringify(state))
  }

  function setHours(hours) {
    setState(prevState => ({ ...prevState, hours }))
    console.log("new state: " + JSON.stringify(state))
  }

  function setRegOrSnap() {
    let result = state["regOrSnap"] === 'snapshots' ? 'registers':'snapshots'
    setState(prevState => ({ ...prevState, "regOrSnap" : result }))
    console.log("new state: " + JSON.stringify(state))
  }

  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Store</InputLabel>
              <Input id="component-simple" onChange={(e) => setStore(e.target.value)}/>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Hours</InputLabel>
              <Input id="component-simple" onChange={(e) => setHours(e.target.value)}/>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel label={state.regOrSnap}
              control={<Switch onChange={setRegOrSnap} color="primary"/>}
            />
          </Grid>
          <Grid item xs={3}>
            <ReloadCount state={state}></ReloadCount>
          </Grid>

          <Grid item xs={12}>
            <RealtimeCharts state={state}/>
          </Grid>

        </Grid>
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </main>
  );
}

function ReloadCount(props) {

  const {data, error} = useSWR(
    [`/${props.state.regOrSnap}/reloads/`, props.state],
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
      {data.count}
    </React.Fragment>
  );
}