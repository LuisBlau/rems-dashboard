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
    "country": "US, CA",
    "regOrSnap": "snapshots",
  })

  const [filters, setFilters] = useState({
    "uiState": "",
    "itemSubstate": "",
    "tenderSubstate": "",
    "pinpad": "",
  })

  //<editor-fold desc="state-setters">
  function setStore(store) {
    setState(prevState => ({...prevState, store}))
  }

  function setHours(hours) {
    setState(prevState => ({...prevState, hours}))
  }

  function setCountry(country) {
    setState(prevState => ({...prevState, country}))
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

  function setItemSubstate(itemSubstate) {
    setFilters(prevFilters => ({...prevFilters, "itemSubstate": itemSubstate}))
  }

  function setTenderSubstate(tenderSubstate) {
    setFilters(prevFilters => ({...prevFilters, "tenderSubstate": tenderSubstate}))
  }
  function resetFilters() {
    setFilters({
      "uiState": "",
      "itemSubstate": "",
      "tenderSubstate": "",
      "pinpad": "",
    })
  }

  //</editor-fold>


  console.log(state)
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Store</InputLabel>
              <Input id="component-simple" onChange={(e) => setStore(e.target.value)}/>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Hours (Default: {state.hours})</InputLabel>
              <Input id="component-simple" onChange={e => setHours(e.target.value)}/>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Country (Default: {state.country})</InputLabel>
              <Input id="component-simple" onChange={e => setCountry(e.target.value)}/>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={resetFilters} variant={"contained"} color={"secondary"}>Clear Filters</Button>
          </Grid>

          <ReloadObjects filters={filters} uiFilter={setUIState} pinpadFilter={setPinpad}
                         itemSubstateFilter={setItemSubstate}
                         tenderSubstateFilter={setTenderSubstate}
                         state={state}/>

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
                        itemSubstateFilter={props.itemSubstateFilter}
                        tenderSubstateFilter={props.tenderSubstateFilter}
                        state={props.state}/>
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
function exportTableToCSV() {
  var filename = "TableData.csv";
  var csv = []
  var rows = document.querySelectorAll("tr");
  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++)
          row.push(cols[j].innerText);
     csv.push(row.join(","));
  }
  var finaltext = csv.join("\n")
  var csvFile = new Blob([finaltext], {type: "octet/stream"});
  var downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  }

function ReloadTable(props) {

  const {data, error} = useSWR('/snapshots/properties', fetcher);

  if (error) return <div>failed to load property data</div>;
  if (!data) return <div>loading property data...</div>;


  return (
    <React.Fragment>
      <Button onClick={exportTableToCSV} variant={"contained"} color={"secondary"}>Download as CSV</Button>
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

  return (
    props.properties.map((property) => (
      <TableCell>{property.property_id}:{property.property_name}</TableCell>
    ))
  )
}

function ReloadTableBody(props) {
  function ignoreCaseEqual(a, b) {
    return a.toLowerCase() === b.toLowerCase()
  }

  return (
    <React.Fragment>
    {props.data
        .filter(reload => (ignoreCaseEqual(reload["props"]["1"], props.filters.uiState) || props.filters.uiState === ""))
        .filter(reload => (ignoreCaseEqual(reload["props"]["2"], props.filters.itemSubstate) || props.filters.itemSubstate === ""))
        .filter(reload => (ignoreCaseEqual(reload["props"]["3"], props.filters.tenderSubstate) || props.filters.tenderSubstate === ""))
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
