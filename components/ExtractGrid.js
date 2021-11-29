import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Copyright from "../src/Copyright";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import useSWR from "swr";
import fetcher from "../lib/fetcherWithHeader";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

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
}));
const linkRenderer = function(params) {
	return '<a href=' + params.value + '>click me</a>';
}
export default function ExtractGrid(props) {
  const {data, error} = useSWR([`/registers/extracts`, props.state], fetcher);
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
            return <div className="ag-theme-alpine" style={{height: 400, width: "100%"}}>
			   <AgGridReact style="width: 100%; height: 100%;"
               rowData={data}>
               <AgGridColumn sortable={ true } filter={ true } field="Retailer"></AgGridColumn>
               <AgGridColumn sortable={ true } filter={ true } field="Store"></AgGridColumn>
               <AgGridColumn sortable={ true } filter={ true } field="RegNum"></AgGridColumn>
			   <AgGridColumn sortable={ true } filter={ true } field="Timestamp"></AgGridColumn>
			   <AgGridColumn sortable={ true } filter={ true } field="InStore"></AgGridColumn>
			   <AgGridColumn sortable={ true } filter={ true } cellRenderer={linkRenderer} field="SBreqLink"></AgGridColumn>
			   <AgGridColumn sortable={ true } filter={ true } field="ExtractType"></AgGridColumn>
           </AgGridReact>
		   </div>
}