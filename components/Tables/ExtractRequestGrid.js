/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import UserContext from '../../pages/UserContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useDebounce } from '../../src/hooks/useDebounce';

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
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(50);

    const [filter, setFilter] = useState(null);
    const [sort, setSort] = useState({ Timestamp: -1 })
    const filterQuery = useDebounce(filter, 3000)

    const onFilterChange = useCallback((filterModel) => {
        const filter = filterModel.items?.[0];
        if (filter) {
            const f = { [filter.field]: filter.value };
            setFilter(f);
        }
    }, []);

    const onSortChange = useCallback((model) => {
        if (model.length > 0) {
            let localSort = { [model[0].field]: model[0].sort === 'asc' ? 1 : -1 }
            setSort(localSort)
        }
    }, []);

    useEffect(() => {
        if (filterQuery || sort) {
            getAgentApiCall(page, pageSize, filterQuery, sort)
        }
    }, [filterQuery, sort])

    useEffect(() => {
        setLoading(true)
        if (context.selectedRetailer) {
            getAgentApiCall(page, pageSize, filter, sort)
        }
    }, [context])


    function getAgentApiCall(pages = 0, limit = 100, filter, sort) {
        let params = {
            retailer: context?.selectedRetailer,
            page: pages,
            limit: limit,
            filter,
            sort
        };

        if (context.selectedRetailerIsTenant === true && context?.selectedRetailerParentRemsServerId) {
            // gets all agents for the selected retailer
            params = {
                retailer: context?.selectedRetailerParentRemsServerId,
                tenant: context?.selectedRetailer,
                page: pages,
                limit: limit,
                filter,
                sort
            }
        }

        axios.get(`/api/REMS/agents`, { params }).then(function (res) {
            setLoading(false)
            setTotalItems(res.data.pagination.totalItem);
            setAgents(res.data.items);
        });

    }

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
                hasEleraServices: x.status !== undefined && x.status.EleraServer !== undefined,
                hasEleraClient: x.status !== undefined && x.status.EleraClient !== undefined,
                hasChec: false,
            };

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
                        if (context.selectedRetailerIsTenant === false) {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        } else {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        }
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
                        if (context.selectedRetailerIsTenant === false) {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        } else {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        }
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
                        if (context.selectedRetailerIsTenant === false) {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        } else {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        }
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
                        if (context.selectedRetailerIsTenant === false) {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        } else {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        }
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
                        if (context.selectedRetailerIsTenant === false) {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        } else {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        }
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
                        if (context.selectedRetailerIsTenant === false) {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        } else {
                            axios
                                .post(`/api/registers/requestDump?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`, params.row)
                                .then((res) => {
                                    processSuccessfulResponse(res, params.row.dataCapture);
                                })
                                .catch((res) => {
                                    processFailedResponse(res, params.row.dataCapture);
                                });
                        }
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
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                loading={loading}
                rows={agentsList}
                columns={[
                    { field: 'storeName', headerName: 'Store Name', sortable: true, filterable: true, width: 200 },
                    { field: 'agent', headerName: 'Agent', sortable: true, filterable: true, width: 200 },
                    {
                        field: 'skyButtonRenderer',
                        headerName: 'SKY Logs',
                        renderCell: skyButtonRenderer,
                        width: 150,
                        sortable: false,
                        filterable: false
                    },
                    {
                        field: 'rmaButtonRenderer',
                        headerName: 'RMA Logs',
                        renderCell: rmaButtonRenderer,
                        width: 150,
                        sortable: false,
                        filterable: false
                    },
                    {
                        field: 'eleraButtonRenderer',
                        headerName: 'Elera Client Logs',
                        renderCell: eleraButtonRenderer,
                        width: 150,
                        sortable: false,
                        filterable: false
                    },
                    {
                        field: 'eleraServicesButtonRenderer',
                        headerName: 'Elera Services Logs',
                        renderCell: eleraServicesButtonRenderer,
                        width: 150,
                        sortable: false,
                        filterable: false
                    },
                    {
                        field: 'checButtonRenderer',
                        headerName: 'CHEC Extract',
                        renderCell: checButtonRenderer,
                        width: 150,
                        sortable: false,
                        filterable: false
                    },
                    {
                        field: 'checLogsButtonRenderer',
                        headerName: 'CHEC Install Logs',
                        renderCell: checLogsButtonRenderer,
                        width: 150,
                        sortable: false,
                        filterable: false
                    },
                ]}
                initialState={{
                    pagination: { paginationModel: { pageSize } },
                }}
                paginationModel={{
                    page: page,
                    pageSize: pageSize
                }}
                pageSizeOptions={[25, 50, 100]}
                checkboxSelection={false}
                disableSelectionOnClick
                onGridReady={sortGrid}
                onPaginationModelChange={({ page, pageSize }) => { setPageSize(pageSize); setPage(page); getAgentApiCall(page, pageSize, filter, sort) }}
                paginationMode="server"
                rowCount={totalItems}
                sortMode="server"
                filterMode="server"
                onFilterModelChange={onFilterChange}
                onSortModelChange={onSortChange}
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
        </Box>
    );
}
