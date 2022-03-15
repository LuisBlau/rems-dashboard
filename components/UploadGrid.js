import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Copyright from "../src/Copyright";
import React from "react";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import useSWR from "swr";
import fetcher from "../lib/fetcherWithHeader";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { makeStyles } from '@mui/styles';
import { padding } from "@mui/system";


const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },
    appBarSpacer: {
        paddingTop: 60
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

const sortGrid = function (event) {
    const columnState = {
        state: [
            {
                colId: "id",
                sort: "asc"
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

export default function UploadGrid(props) {
    const { data, error } = useSWR([`/REMS/uploads`, props.state], fetcher);
    if (error) return <div>failed to load</div>;
    if (!data) return <div>loading...</div>;
    return (
        <div className="ag-theme-alpine" style={{ padding: 20, height: 400, width:"100%" }}>
            <AgGridReact style={{ width: "100%", height: "100%" }}
                rowData={data} onGridReady={sortGrid}>
                <AgGridColumn sortable={true} filter={true} field="id"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="filename"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="archived"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} comparator={dateComparator} field="timestamp"></AgGridColumn>
            </AgGridReact>
        </div>
    )
}