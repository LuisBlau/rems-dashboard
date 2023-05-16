/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import UserContext from '../../pages/UserContext';

const PREFIX = 'VersionGrid';

const approvedVersions = [
    { "rems": "1.5.1", "rma": "4.3.1", "cf": "2.1.2" },
    { "rems": "1.4.1", "rma": "4.2.0", "cf": "2.1.0" },
    { "rems": "1.3", "rma": "4.1.1", "cf": "2.0.5" }
]
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
const colorRows = (params) => {
    var data = params.data
    for (let v in approvedVersions) {
        if (data["rems"] == v["rems"] && data["rma"] == v["rma"] && data["cf"] == v["cf"]) return { 'backgroundColor': 'green' };
    }
    return { 'backgroundColor': 'red' }
}

export default function VersionGrid({ height }) {
    const [versions, setVersions] = useState([]);
    const [showAllRetailers, setShowAllRetailers] = useState(false);
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const context = useContext(UserContext)

    const changeShownRetailers = (event) => {
        setShowAllRetailers(event.target.checked)
        setVersions([])
    }

    useEffect(() => {
        if (context) {
            if (context.selectedRetailer) {
                setSelectedRetailer(context.selectedRetailer)
            }
        }
    }, [context])

    useEffect(() => {
        let url = ''
        if (selectedRetailer !== '') {
            url = `/api/REMS/versionCombinations?retailerId=${selectedRetailer}`
        }
        if (showAllRetailers) {
            url = "/api/REMS/versionCombinations?allRetailers=true"
        }
        if (url !== '') {
            axios.get(url).then((x) => setVersions(x.data))
        }
    }, [showAllRetailers, selectedRetailer]);

    return (
        <div className="ag-theme-alpine" style={{ height: height, width: '100%' }}>
            <FormControlLabel control={<Checkbox onChange={changeShownRetailers} />} label="Show All Retailers" style={{ height: 30 }} />
            <AgGridReact style={{ width: '100%', height: (height - 30) }} rowData={versions} getRowStyle={colorRows}>
                <AgGridColumn sortable={true} filter={true} field="rems"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="rma"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="cf"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="count"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="retailer"></AgGridColumn>

            </AgGridReact>
        </div>
    );
}
