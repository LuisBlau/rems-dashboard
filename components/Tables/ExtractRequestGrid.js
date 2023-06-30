/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import UserContext from '../../pages/UserContext';
import { DataGrid } from '@mui/x-data-grid';

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

        for (let i = 0; i < agents.length; i++) {
            const x = agents[i];
            const obj = {
                id: i + 1, // Assigning a unique id based on the index
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
            // if (x.versions !== undefined) {
            //     for (let i = 0; i < x.versions.length; i++) {
            //         const objKeys = Object.values(x.status[i]);
            //         if (objKeys[1] === 'Toshiba Checkout Environment for Consumer-Service Lane') {
            //             obj.hasChec = true;
            //             break;
            //         }
            //     }
            // }
            if (x.status !== undefined) {
                if (x.status.hasChec !== undefined) {
                    obj.hasChec = x.status.hasChec.configured
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
        if (params.row && params.row.os === 'Sky' && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.row.dataCapture = 'SkyLogs';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                            .then((res) => {
                                processSuccessfulResponse(res, params.row.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.row.dataCapture);
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
        if (params.row && params.row.isRMA && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.row.dataCapture = 'RMA';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                            .then((res) => {
                                processSuccessfulResponse(res, params.row.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.row.dataCapture);
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
        if (params.row && params.row.hasEleraClient && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.row.dataCapture = 'EleraClient';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                            .then((res) => {
                                processSuccessfulResponse(res, params.row.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.row.dataCapture);
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
        if (params.row && params.row.hasEleraServices && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.row.dataCapture = 'EleraServices';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                            .then((res) => {
                                processSuccessfulResponse(res, params.row.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.row.dataCapture);
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
        if (params.row && params.row.hasChec && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.row.dataCapture = 'Chec';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                            .then((res) => {
                                processSuccessfulResponse(res, params.row.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.row.dataCapture);
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

    const checLogsButtonRenderer = function (params) {
        if (params.row && params.row.hasChec && context?.selectedRetailer) {
            return (
                <Button
                    variant="contained"
                    onClick={() => {
                        params.row.dataCapture = 'ChecInstall';
                        axios
                            .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                            .then((res) => {
                                processSuccessfulResponse(res, params.row.dataCapture);
                            })
                            .catch((res) => {
                                processFailedResponse(res, params.row.dataCapture);
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
            <DataGrid
                rows={agentsList}
                columns={[
                    { field: 'storeName', headerName: 'Store Name', sortable: true, filterable: true, width: 200 },
                    { field: 'agent', headerName: 'Agent', sortable: true, filterable: true, width: 200 },
                    {
                        field: 'skyButtonRenderer',
                        headerName: 'SKY Logs',
                        renderCell: skyButtonRenderer,
                        width: 150,
                    },
                    {
                        field: 'rmaButtonRenderer',
                        headerName: 'RMA Logs',
                        renderCell: rmaButtonRenderer,
                        width: 150,
                    },
                    {
                        field: 'eleraButtonRenderer',
                        headerName: 'Elera Client Logs',
                        renderCell: eleraButtonRenderer,
                        width: 150,
                    },
                    {
                        field: 'eleraServicesButtonRenderer',
                        headerName: 'Elera Services Logs',
                        renderCell: eleraServicesButtonRenderer,
                        width: 150,
                    },
                    {
                        field: 'checButtonRenderer',
                        headerName: 'CHEC Extract',
                        renderCell: checButtonRenderer,
                        width: 150,
                    },
                    {
                        field: 'checLogsButtonRenderer',
                        headerName: 'CHEC Install Logs',
                        renderCell: checLogsButtonRenderer,
                        width: 150,
                    },
                ]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection={false}
                disableSelectionOnClick
                autoHeight
                onGridReady={sortGrid}
            />


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
