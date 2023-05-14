/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import UserContext from '../../pages/UserContext';

const azureRenderer = function (params) {
    return <a href={'javascript:fetch("' + params.value + '")'}>Request File</a>;
};

const linkRenderer = function (params) {
    if (params.value === undefined) return '';
    return <a href={params.value}>Download</a>;
};
const sortGrid = function (event) {
    const columnState = {
        state: [
            {
                colId: 'Timestamp',
                sort: 'desc',
            },
        ],
    };
    event.columnApi.applyColumnState(columnState);
};
const dateComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
    const DateA = Date.parse(valueA);
    const DateB = Date.parse(valueB);
    if (DateA === DateB) return 0;
    return DateA > DateB ? 1 : -1;
};

export default function DumpGrid({ store, height }) {
    const [storeDumps, setStoreDumps] = useState([]);
    const [loading, setLoading] = useState(true)
    const context = useContext(UserContext)
    useEffect(() => {
        if (context) {
            if (store) {
                axios.get(`/api/registers/dumpsForStore?storeName=${store.storeName}&retailerId=${store.retailerId}`).then(function (res) {
                    const dumps = [];
                    res.data.forEach((v) => {
                        dumps.push(v);
                    });
                    setLoading(false)
                    setStoreDumps(dumps);
                });
            } else {
                if (context.selectedRetailer) {
                    axios.get('/api/registers/dumps?retailerId=' + context.selectedRetailer).then(function (res) {
                        const dumps = [];
                        res.data.forEach((v) => {
                            dumps.push(v);
                        });
                        setLoading(false)
                        setStoreDumps(dumps);
                    });
                }
            }
        }
    }, [store, context]);

    if (loading) {
        return <div>loading...</div>;
    } else {
        return (
            <div className="ag-theme-alpine" style={{ height, width: '100%', overflowX: 'hidden' }}>
                <AgGridReact style="width: 100%; height: 100%;" rowData={storeDumps} onGridReady={sortGrid}>
                    <AgGridColumn
                        flex="3"
                        sortable={true}
                        filter={true}
                        comparator={dateComparator}
                        field="Timestamp"
                        headerName="Dump Timestamp"
                    ></AgGridColumn>
                    <AgGridColumn flex="2" sortable={true} filter={true} field="Store"></AgGridColumn>
                    <AgGridColumn flex="2" sortable={true} filter={true} field="System"></AgGridColumn>
                    <AgGridColumn flex="8" sortable={true} filter={true} field="Reason"></AgGridColumn>
                    <AgGridColumn
                        flex="2"
                        sortable={true}
                        filter={true}
                        cellRenderer={azureRenderer}
                        headerName="Azure"
                        field="SBreqLink"
                    ></AgGridColumn>
                    <AgGridColumn
                        flex="2"
                        sortable={true}
                        filter={true}
                        cellRenderer={linkRenderer}
                        field="Download"
                    ></AgGridColumn>
                </AgGridReact>
            </div>
        );
    }
}
