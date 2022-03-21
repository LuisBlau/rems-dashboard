import Container from "@mui/material/Container";
import { styled } from '@mui/material/styles';
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
import { padding } from "@mui/system";


const PREFIX = 'UploadGrid';

const classes = {
    content: `${PREFIX}-content`,
    appBarSpacer: `${PREFIX}-appBarSpacer`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`
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

    [`& .${classes.appBarSpacer}`]: {
        paddingTop: 50
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    }
}));

const sortGrid = function (event) {
    const columnState = {
        state: [
            {
                colId: "timestamp",
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

export default function UploadGrid(props) {
    const { data, error } = useSWR([`/REMS/uploads`, props.state], fetcher);
    if (error) return <Root>failed to load</Root>;
    if (!data) return <div>loading...</div>;
    return (
        <div className="ag-theme-alpine" style={{ padding: 20, height: 400, width:"100%" }}>
            <AgGridReact style={{ width: "100%", height: "100%" }}
                rowData={data} onGridReady={sortGrid}>
                <AgGridColumn sortable={true} filter={true} field="description"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="filename"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="archived"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} comparator={dateComparator} field="timestamp"></AgGridColumn>
            </AgGridReact>
        </div>
    )
}