/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
const PREFIX = 'ExtractGrid';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

const azureRenderer = function (params) {
    return <a href={'javascript:fetch("' + params.value + '")'}>Request File</a>;
};

const linkRenderer = function (params) {
    if (params.value === undefined) return '';
    return <a href={params.value}>Download</a>;
};
const dateComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
    const DateA = moment(valueA, 'YYYY-MM-DD HH:mm:ss').toDate();
    const DateB = moment(valueB, 'YYYY-MM-DD HH:mm:ss').toDate();
    if (DateA === DateB) return 0;
    return DateA > DateB ? 1 : -1;
};

const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    const columnState = {
        state: [
            {
                colId: 'Timestamp',
                sort: 'desc',
            },
        ],
    };
    params.columnApi.applyColumnState(columnState);
};

export default function ExtractGrid({ store, height }) {
    const [storeExtracts, setStoreExtracts] = useState([]);
    useEffect(() => {
        if (store) {
            axios.get(`/api/registers/extractsForStore?storeName=${store.store}&retailerId=${store.retailer}`).then(function (res) {
                const extracts = [];
                res.data.forEach((v) => {
                    extracts.push(v);
                });
                setStoreExtracts(extracts);
            });
        } else {
            axios.get('/api/registers/extracts').then(function (res) {
                const extracts = [];
                res.data.forEach((v) => {
                    extracts.push(v);
                });
                setStoreExtracts(extracts);
            });
        }
    }, [store]);

    return (
        <div className="ag-theme-alpine" style={{ height, width: '100%', overflowX: 'hidden' }}>
            <AgGridReact style={{ width: '100%', height: '100%' }} rowData={storeExtracts} onGridReady={onGridReady}>
                <AgGridColumn
                    sortable={true}
                    filter={true}
                    comparator={dateComparator}
                    field="Timestamp"
                ></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="Store"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="RegNum"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="ExtractType"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="State"></AgGridColumn>
                <AgGridColumn
                    sortable={true}
                    filter={true}
                    cellRenderer={azureRenderer}
                    headerName="Azure"
                    field="SBreqLink"
                ></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} cellRenderer={linkRenderer} field="Download"></AgGridColumn>
            </AgGridReact>
        </div>
    );
}
