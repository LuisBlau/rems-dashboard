import Container from "@mui/material/Container";
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Copyright from "../src/Copyright";
import React, {useState} from "react";
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import useSWR from "swr";
import fetcher from "../lib/fetcherWithHeader";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
const PREFIX = 'DumpGrid';
import axios from 'axios';

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.content}`]: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  }
}));

const rmaButtonRenderer = function(params) {
	return (<Button onClick={() => {
    params.data['dataCapture']='RMA'
		axios.post('/api/registers/requestDump', params.data).catch()
	}}>Click Me!</Button>);
}
const eleraButtonRenderer = function(params) {
	return (<Button onClick={() => {
    params.data['dataCapture']='EleraClient'
		axios.post('/api/registers/requestDump', params.data).catch()
	}}>Click Me!</Button>);
}

const sortGrid = function(event) {
  const columnState = {
    state: [
      {
        colId: "Timestamp",
        sort: "desc"
      }
    ]
  }
  event.columnApi.applyColumnState(columnState);
}
const dateComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
	let DateA = Date.parse(valueA)
	let DateB = Date.parse(valueB)
    if (DateA == DateB) return 0;
    return (DateA > DateB) ? 1 : -1;
};

export default function ExtractRequestGrid(props) {
  const {data, error} = useSWR([`/REMS/agents`, props.state], fetcher);
  if (error) return <Root>failed to load</Root>;
  if (!data) return <div>loading...</div>;
            var registerlist = []
			for(var x of data) {
        console.log(JSON.stringify(x))
					registerlist.push({
					"retailer_id": x["retailer_id"],
					"store_name": x["storeName"],
					"agent": x["agentName"],
					})
			}
            return <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
			   <AgGridReact style="width: 100%; height: 100%;"
               rowData={registerlist} onGridReady={sortGrid}>
                 <AgGridColumn sortable={ true } filter={ true } field="retailer_id"></AgGridColumn>
               <AgGridColumn sortable={ true } filter={ true } field="store_name"></AgGridColumn>
               <AgGridColumn sortable={ true } filter={ true } field="agent"></AgGridColumn>
			         <AgGridColumn sortable={ true } filter={ true } cellRenderer={rmaButtonRenderer} field="RMA Capture"></AgGridColumn>
               <AgGridColumn sortable={ true } filter={ true } cellRenderer={eleraButtonRenderer} field="ElereClient Capture"></AgGridColumn>
           </AgGridReact>
		   </div>
}