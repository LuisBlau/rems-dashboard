/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import React, { useContext, useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import useSWR from 'swr';
import fetcher from '../../lib/fetcherWithHeader';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import UserContext from '../../pages/UserContext';

const PREFIX = 'DumpGrid';

const successHideDuration = 1500;
const failHideDuration = 8000;

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

export default function ExtractRequestGrid(props) {
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastFailure, setToastFailure] = useState('');
    const [agents, setAgents] = useState([])
    const [agentsList, setAgentsList] = useState([])
    const context = useContext(UserContext)

    useEffect(() => {
        if (context.selectedRetailer) {
            if (context.selectedRetailerIsTenant === false) {
                axios.get(`/api/REMS/agents?retailer=${context.selectedRetailer}`).then(function (res) {
                    setAgents(res.data)
                })
            } else if (context.selectedRetailerParentRemsServerId) {
                axios.get(`/api/REMS/agents?retailer=${context.selectedRetailerParentRemsServerId}&tenant=${context.selectedRetailer}`).then(function (res) {
                    setAgents(res.data)
                })
            }
        }
    }, [context])

    useEffect(() => {
        const list = [];

        for (const x of agents) {
            const obj = {
                retailerId: x.retailer_id,
                storeName: x.storeName,
                agent: x.agentName,
                os: x.os,
                isRMA: x.deviceType !== 3,
                hasEleraServices: x.status !== undefined && x.status.EleraServices !== undefined,
                hasEleraClient: x.status !== undefined && x.status.EleraClient !== undefined,
                hasChec: false,
            };

            // Checking to see if 'CHEC' is mentioned in the versions list.
            // If it is, I assume that we can request a chec capture
            // Probably not right so should check with Brent
            if (x.versions !== undefined) {
                for (let i = 0; i < x.versions.length; i++) {
                    const objKeys = Object.keys(x.versions[i]);
                    if (objKeys[0] === 'Toshiba Checkout Environment for Consumer-Service Lane') {
                        obj.hasChec = true;
                        break;
                    }
                }
            }

            list.push(obj);
        }
        setAgentsList(list)
    }, [agents])


    const processSuccessfulResponse = function (res, type) {
        if (res.status !== 200) {
            setToastFailure(`Logs capture failed with a status code ${res.status}`);
            setOpenFailure(true);
        } else {
            setToastSuccess(`Successfully requested ${type} capture`);
            setOpenSuccess(true);
        }
    };

    const processFailedResponse = function (res, type) {
        setToastFailure(`Failed ${type} capture with message: ${res.message}`);
        setOpenFailure(true);
    };

    const skyButtonRenderer = function (params) {
        if (params.data.os === 'Sky' && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.data.dataCapture = 'SkyLogs';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.data)
                            .then((res) => {
                                processSuccessfulResponse(res, params.data.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.data.dataCapture);
                            });
                    }}
                >
                    Request
                </Button>
            );
        } else {
            return null;
        }
    };

    const rmaButtonRenderer = function (params) {
        if (params.data.isRMA && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.data.dataCapture = 'RMA';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.data)
                            .then((res) => {
                                processSuccessfulResponse(res, params.data.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.data.dataCapture);
                            });
                    }}
                >
                    Request
                </Button>
            );
        } else {
            return null;
        }
    };
    const eleraButtonRenderer = function (params) {
        if (params.data.hasEleraClient && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.data.dataCapture = 'EleraClient';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.data)
                            .then((res) => {
                                processSuccessfulResponse(res, params.data.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.data.dataCapture);
                            });
                    }}
                >
                    Request
                </Button>
            );
        } else {
            return null;
        }
    };
    const eleraServicesButtonRenderer = function (params) {
        if (params.data.hasEleraServices && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.data.dataCapture = 'EleraServices';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.data)
                            .then((res) => {
                                processSuccessfulResponse(res, params.data.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.data.dataCapture);
                            });
                    }}
                >
                    Request
                </Button>
            );
        } else {
            return null;
        }
    };
    const checButtonRenderer = function (params) {
        if (params.data.hasChec && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.data.dataCapture = 'Chec';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.data)
                            .then((res) => {
                                processSuccessfulResponse(res, params.data.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.data.dataCapture);
                            });
                    }}
                >
                    Request
                </Button>
            );
        } else {
            return null;
        }
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 800, width: '100%' }}>
            <AgGridReact rowData={agentsList} onGridReady={sortGrid}>
                <AgGridColumn
                    sortable={true}
                    filter={true}
                    floatingFilter={true}
                    suppressMenu={true}
                    resizable={true}
                    field="storeName"
                ></AgGridColumn>
                <AgGridColumn
                    sortable={true}
                    filter={true}
                    floatingFilter={true}
                    suppressMenu={true}
                    resizable={true}
                    field="agent"
                ></AgGridColumn>
                <AgGridColumn
                    cellRenderer={skyButtonRenderer}
                    resizable={true}
                    field="SKY Logs Capture"
                    headerName={'SKY Logs'}
                ></AgGridColumn>
                <AgGridColumn
                    cellRenderer={rmaButtonRenderer}
                    resizable={true}
                    field="RMA Capture"
                    headerName={'RMA'}
                ></AgGridColumn>
                <AgGridColumn
                    cellRenderer={eleraButtonRenderer}
                    resizable={true}
                    field="EleraClient Capture"
                    headerName={'Elera Client'}
                ></AgGridColumn>
                <AgGridColumn
                    cellRenderer={eleraServicesButtonRenderer}
                    resizable={true}
                    field="EleraServices Capture"
                    headerName={'Elera Services'}
                ></AgGridColumn>
                <AgGridColumn
                    cellRenderer={checButtonRenderer}
                    resizable={true}
                    field="Chec Capture"
                    headerName={'CHEC'}
                ></AgGridColumn>
            </AgGridReact>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSuccess}
                autoHideDuration={successHideDuration}
                onClose={(event) => {
                    setOpenSuccess(false);
                }}
            >
                <Alert variant="filled" severity="success">
                    <AlertTitle>Success!</AlertTitle>
                    {toastSuccess}
                </Alert>
            </Snackbar>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openFailure}
                autoHideDuration={failHideDuration}
                onClose={(event) => {
                    setOpenFailure(false);
                }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle>Error!!!</AlertTitle>
                    {toastFailure}
                </Alert>
            </Snackbar>
        </div>
    );
}
