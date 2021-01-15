import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Copyright from "../../src/Copyright";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import useSWR from "swr";
import fetcher from "../../lib/fetcherWithHeader";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {RealtimeCharts} from "../../components/RealtimeCharts_alternative";
import {Button} from "@material-ui/core";

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
  const classes = useStyles();

  const [state, setState] = useState({
    "store": 0,
    "hours": 12,
    "regOrSnap": "snapshots",
  })

  const [filters, setFilters] = useState({
    "uiState": "",
    "scanner1": "",
    "scanner2": "",
    "pinpad": "",
  })

  //<editor-fold desc="state-setters">
  function setStore(store) {
    setState(prevState => ({...prevState, store}))
  }

  function setHours(hours) {
    setState(prevState => ({...prevState, hours}))
  }

  function setRegOrSnap() {
    let result = state["regOrSnap"] === 'snapshots' ? 'registers' : 'snapshots'
    setState(prevState => ({...prevState, "regOrSnap": result}))
    console.log("new state: " + JSON.stringify(state))
  }

  function setUIState(uiState) {
    setFilters(prevFilters => ({...prevFilters, "uiState": uiState}))
  }

  function setPinpad(pinpad) {
    setFilters(prevFilters => ({...prevFilters, "pinpad": pinpad}))
  }

  function setScanner1(scanner1) {
    setFilters(prevFilters => ({...prevFilters, "scanner1": scanner1}))
  }

  function setScanner2(scanner2) {
    setFilters(prevFilters => ({...prevFilters, "scanner2": scanner2}))
  }

  function resetFilters() {
    setFilters({
      "uiState": "",
      "scanner1": "",
      "scanner2": "",
      "pinpad": "",
    })
  }

  //</editor-fold>


  console.log(state)
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
              <InputLabel htmlFor="component-simple">Hours (Default: {state.hours})</InputLabel>
              <Input id="component-simple" onChange={e => setHours(e.target.value)}/>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={resetFilters} variant={"contained"} color={"secondary"}>Clear Filters</Button>
          </Grid>

          <ReloadObjects filters={filters} uiFilter={setUIState} pinpadFilter={setPinpad}
                         scanner1Filter={setScanner1}
                         scanner2Filter={setScanner2} state={state}/>

        </Grid>
        <Box pt={4}>
          <Copyright/>
        </Box>
      </Container>
    </main>
  );
}

function ReloadObjects(props) {
  const {data, error} = useSWR(['/snapshots/snaptime', props.state], fetcher);
  if (error) return <div>failed to load property data</div>;
  if (!data) return <div>loading property data...</div>;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <RealtimeCharts filters={props.filters} uiFilter={props.uiFilter} pinpadFilter={props.pinpadFilter}
                        scanner1Filter={props.scanner1Filter}
                        scanner2Filter={props.scanner2Filter} state={props.state}/>
      </Grid>
      <Grid>
        <ReloadTable data={data} filters={props.filters}/>
      </Grid>
    </React.Fragment>
  )
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
          <ReloadTableBody data={props.data} filters={props.filters} properties={data}/>
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
  function ignoreCaseEqual(a, b) {
    return a.toLowerCase() === b.toLowerCase()
  }

  return (
    <React.Fragment>
      {props.data
        .filter(reload => (ignoreCaseEqual(reload["props"]["1"], props.filters.uiState) || props.filters.uiState === ""))
        .filter(reload => (ignoreCaseEqual(reload["props"]["2"], props.filters.scanner1) || props.filters.scanner1 === ""))
        .filter(reload => (ignoreCaseEqual(reload["props"]["3"], props.filters.scanner2) || props.filters.scanner2 === ""))
        .filter(reload => (ignoreCaseEqual(reload["props"]["9"], props.filters.pinpad) || props.filters.pinpad === ""))
        .map((reload) => (
          <TableRow>
            <TableCell>{reload["datetime"]}</TableCell>
            <TableCell>{reload["country"]}</TableCell>
            <TableCell>{reload["register"]}</TableCell>
            <TableCell>{reload["store"]}</TableCell>
            {Object.keys(reload["props"]).map((prop_key) => (
              <TableCell>{reload["props"][prop_key]}</TableCell>
            ))}
          </TableRow>
        ))}
    </React.Fragment>
  )
}