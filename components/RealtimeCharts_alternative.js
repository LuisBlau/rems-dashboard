import React from "react";
import useSWR from "swr";
import fetcher from "../lib/fetcherWithHeader";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import PieChart, {Connector, Label, Legend, Series, Size} from 'devextreme-react/pie-chart';
import Chart  from 'devextreme-react/chart';

export function RealtimeCharts(props) {
  return (
    <React.Fragment>
	<ReloadStatsChart hours={props.hours} setFilter={props.uiFilter} state={props.state} width="100%"/>
      <Grid container spacing={2}>
        <UIStateChart hours={props.hours} setFilter={props.uiFilter} state={props.state}/>
        <PinpadStateChart hours={props.hours} setFilter={props.pinpadFilter} state={props.state}/>
        <ItemSubstateChart hours={props.hours} setFilter={props.itemSubstateFilter} state={props.state}/>
        <TenderSubstateChart hours={props.hours} setFilter={props.tenderSubstateFilter} state={props.state}/>
      </Grid>
    </React.Fragment>
  );
}

function UIStateChart(props) {
  props.state["hours"] = props.hours
  console.log(props.hours)
  const {data, error} = useSWR([`/snapshots/uiState`, props.state], fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
      <GeneralChart setFilter={props.setFilter} data={data} title={"UI State"}/>
    </React.Fragment>
  );
}


function ItemSubstateChart(props) {

  const {data, error} = useSWR([`/snapshots/itemSubstate`, props.state], fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
      <GeneralChart setFilter={props.setFilter} data={data} title={"Item Substate"}/>
    </React.Fragment>
  );
}

function PinpadStateChart(props) {

  const {data, error} = useSWR([`/snapshots/pinpad`, props.state], fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
      <GeneralChart setFilter={props.setFilter} data={data} title={"Pinpad State"}/>
    </React.Fragment>
  );
}
function ReloadStatsChart(props) {

  const {data, error} = useSWR([`/snapshots/reloadstats`, props.state], fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
  <Paper>
  <Chart setFilter={props.setFilter} dataSource={data} title ={"Register Reloads"}>
       <Series
         valueField="count"
         argumentField="date_part"
         type="bar"
         name="Number of Reloads"/>
      </Chart>
      </Paper>
    </React.Fragment>
  );
}

function TenderSubstateChart(props) {
    
  const {data, error} = useSWR([`/snapshots/tenderSubstate`, props.state], fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <React.Fragment>
      <GeneralChart setFilter={props.setFilter} data={data} title={"Tender Substate"}/>
    </React.Fragment>
  );
}

function GeneralChart(props) {
  function customizeText({argument, value}) {
    return `${argument}: ${value}`;
  }

  function handlePointClick(e) {
    props.setFilter(e.target.data.name)
  }

  return (
    <Grid item xs={6}>
      <Paper>
        <PieChart id={"pie" + props.title} dataSource={props.data}
                  palette="Bright" title={props.title} onPointClick={handlePointClick}
        >
          <Legend visible={false}/>
          <Series
            argumentField="name"
            valueField="value"
          >
            <Label visible={true} customizeText={customizeText}>
              <Connector visible={true} width={1}/>
            </Label>
          </Series>
          <Size/>
        </PieChart>
      </Paper>
    </Grid>)
}
