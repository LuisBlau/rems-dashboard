import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Copyright from "../../src/Copyright";
import Box from "@material-ui/core/Box";
import {RealtimeCharts} from "../../components/RealtimeCharts";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import useSWR from "swr";
import fetcher from "../../lib/fetcherWithHeader";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

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
    setState(prevState => ({...prevState, store}))
    console.log("new state: " + JSON.stringify(state))
  }

  function setHours(hours) {
    setState(prevState => ({...prevState, hours}))
    console.log("new state: " + JSON.stringify(state))
  }

  function setRegOrSnap() {
    let result = state["regOrSnap"] === 'snapshots' ? 'registers' : 'snapshots'
    setState(prevState => ({...prevState, "regOrSnap": result}))
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
          <Grid>
            <ReloadTable/>
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

function ReloadTable(props) {

  const {data, error} = useSWR('/snapshots/properties', fetcher);

  if (error) return <div>failed to load property data</div>;
  if (!data) return <div>loading property data...</div>;


  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Register</TableCell>
            <TableCell>Store</TableCell>
            <ReloadTableHeader properties={data}/>
          </TableRow>
        </TableHead>
        <TableBody>
          <ReloadTableBody properties={data}/>
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

function ReloadTableHeader(props) {

  return ((
    props.properties.map((property) => (
      <TableCell>{property.property_id}:{property.property_name}</TableCell>
    ))
  ))
}

function ReloadTableBody(props) {
  const {data, error} = useSWR('/snapshots/snaptime', fetcher);

  if (error) return <div>failed to load property data</div>;
  if (!data) return <div>loading property data...</div>;

  console.log(data)
  // useEffect(
  //   () => {
  //     console.log("in init effect")
  //     const loadData = async () => {
  //       await fetch("http://localhost:3001/snapshots/snaptime").then(res => setData(res.json()))
  //     }
  //     loadData()
  //     console.log("close init effect")
  //
  //   }, []
  // )

  // useEffect(
  //   () => {
  //     console.log("in data effect")
  //     console.log(data)
  //     console.log("close data effect")
  //   }, [data]
  // )

  return (
    <React.Fragment>
      {Object.keys(data).map((reload_key) => (
        <TableRow>
          <TableCell>{reload_key}</TableCell>
          <TableCell>{data[reload_key]["country"]}</TableCell>
          <TableCell>{data[reload_key]["register"]}</TableCell>
          <TableCell>{data[reload_key]["store"]}</TableCell>
          {Object.keys(data[reload_key]["props"]).map((prop_key) => (
            <TableCell>{data[reload_key]["props"][prop_key]}</TableCell>
          ))}
        </TableRow>
      ))}
    </React.Fragment>
  )
}