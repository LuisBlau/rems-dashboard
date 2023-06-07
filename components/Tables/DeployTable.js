/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import fetcher from '../../lib/lib.js';
import axios from 'axios';
import useSWR from 'swr';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PendingIcon from '@mui/icons-material/Pending';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StartIcon from '@mui/icons-material/Start';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../pages/UserContext.js';
import { useEffect } from 'react';

function StatusBadge(props) {
    switch (props.itemStatus) {
        case 'cancel':
        case 'Cancel':
            return (
                <Tooltip title="Canceling">
                    <CancelScheduleSendIcon />
                </Tooltip>
            );
        case 'cancelled':
        case 'Cancelled':
            return (
                <Tooltip title="Cancelled">
                    <CancelIcon />
                </Tooltip>
            );
        case 'Failed':
            return (
                <Tooltip title={props.itemDescription ? props.itemDescription : 'Failed'}>
                    <WarningIcon />
                </Tooltip>
            );
        case 'InProgress':
            return (
                <Tooltip title="In Progress">
                    <PendingIcon />
                </Tooltip>
            );
        case 'Pending':
            return (
                <Tooltip title="Pending">
                    <WatchLaterIcon />
                </Tooltip>
            );
        case 'Staged':
            return (
                <Tooltip title="Staged">
                    <WatchLaterIcon />
                </Tooltip>
            );
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return (
                <Tooltip title="Success">
                    <CheckCircleIcon />
                </Tooltip>
            );
        case 'initial':
        case 'Initial':
            if (props.itemDescription) {
                return (
                    <Tooltip title={props.itemDescription}>
                        <BusAlertIcon />
                    </Tooltip>
                );
            } else {
                return (
                    <Tooltip title="Initial">
                        <StartIcon />
                    </Tooltip>
                );
            }
        default:
            return <p>{props.itemStatus}</p>;
    }
}

function StatusColor(status) {
    switch (status) {
        case 'cancel':
        case 'Cancel':
            return '#F2FAAB';
        case 'cancelled':
        case 'Cancelled':
            return '#FACAA4';
        case 'Failed':
            return '#FCB3B1';
        case 'InProgress':
            return '#B1E0FC';
        case 'Pending':
        case 'Staged':
            return '#D6EEFD';
        case 'Success':
        // TODO: remove this after REMS CHANGE.
        case 'Succeeded':
            return '#CDFEB6';
        case 'initial':
        case 'Initial':
            return '#FAF9F6';
        default:
            return '#FAF9F6';
    }
}

function StepCommands(step) {
    switch (step.type) {
        case 'shell':
            return step.cmd + '--' + step.args;
        case 'upload':
            return step.filename;
        case 'unzip':
            return step.file;
        case 'apply':
            return step.product;
    }
    return '';
}

export function DeployTable(props) {
    const [open, setOpen] = useState(false);
    const [submitInformation, setSubmitInformation] = useState(null);
    const context = useContext(UserContext)
    const [data, setData] = useState([])

    useEffect(() => {
        if (context.selectedRetailer !== 'null' && context.selectedRetailerIsTenant === false) {
            axios.get('/api/REMS/deploys?retailerId=' + context.selectedRetailer +
                '&store=' + props.storeFilter +
                '&package=' + props.packageFilter +
                '&records=' + props.maxRecords +
                '&status=' + props.statusFilter)
                .then((resp) => setData(resp.data))
        } else if (context.selectedRetailerParentRemsServerId) {
            axios.get('/api/REMS/deploys?retailerId=' + context.selectedRetailerParentRemsServerId +
                '&store=' + props.storeFilter +
                '&package=' + props.packageFilter +
                '&records=' + props.maxRecords +
                '&status=' + props.statusFilter +
                '&tenantId=' + context.selectedRetailer)
                .then((resp) => setData(resp.data))
        }

    }, [context.selectedRetailer, context.selectedRetailerIsTenant])

    const handleClickOpen = (event) => {
        setOpen(true);
        setSubmitInformation(event.currentTarget.id);
    };

    const handleClose = () => {
        setOpen(false);
        setSubmitInformation(null);
    };

    const handleCancel = () => {
        setOpen(false);
        // If we use these much we can install 'http-status-codes'
        const INTERNAL_SERVER_ERROR = 500;
        const NOT_FOUND = 404;
        const NOT_MODIFIED = 304;
        const OK = 200;

        const deployInfo = submitInformation.split('_');
        const deployUpdate = {
            storeName: deployInfo[0],
            id: deployInfo[1],
        };

        let filters = `retailerId=${context.selectedRetailer}`
        if (context.selectedRetailerIsTenant === true) {
            filters = `retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${context.selectedRetailer}`
        }
        axios.post(`/api/REMS/deploy-cancel?${filters}`, deployUpdate)
            .then((response) => {
                console.log('cancel response : ', response);
                // This worked so reload the page to show the new status.
                window.location.reload(true);
            })
            .catch((error) => {
                console.log('cancel error message: ', error.response.data.message);
                console.log('cancel error status : ', error.response.request.status);
                console.log('cancel error statusText : ', error.response.request.statusText);
                switch (error.response.request.status) {
                    case NOT_MODIFIED:
                    case NOT_FOUND:
                        alert('Unable to cancel.');
                        break;
                    case INTERNAL_SERVER_ERROR:
                        alert('Internal Server Error');
                        break;
                    default:
                        alert('Cancel Error.');
                        break;
                }
            });
    };

    function renderMessage(item) {
        if (item.status == 'Failed')
            return 'Deployment FAILED.';
        else if (item.status == 'Pending')
            return 'Deployment PENDING';
        else if (item.status == 'Success')
            return 'Deployment SUCCESS';
        return '';
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'Are you sure, you want to cancel this deployment?'}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCancel} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {data.map((deploy, index) => (
                <Grid key={'gc1-' + index} container alignItems={'center'} spacing={1}>
                    <Grid item xs={10}>
                        <Accordion key={'a-deploy-' + index} sx={{ margin: 1 }}>
                            <AccordionSummary
                                key={'as-deploy-' + index}
                                style={{ backgroundColor: StatusColor(deploy.status) }}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={'panel' + deploy.id + 'bh-content'}
                                id={'panel' + deploy.id + 'bh-header'}
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={1}>
                                        <StatusBadge itemStatus={deploy.status} itemDescription={deploy.reason} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography sx={{ flexShrink: 0 }}>Agent: {deploy.agentName}</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ flexShrink: 0 }}>Package: {deploy.package}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography sx={{ flexShrink: 0 }}>Status: {deploy.status}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography sx={{ flexShrink: 0 }}>Apply Time: {deploy.apply_time}</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                {deploy.steps.map((step, index) => (
                                    <Accordion
                                        key={index}
                                        style={{ margin: '15px', backgroundColor: StatusColor(step.status) }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={'panel' + deploy.id + ':' + index + 'bh-content'}
                                            id={'panel' + deploy.id + ':' + index + 'bh-header'}
                                        >
                                            <Grid container spacing={3}>
                                                <Grid item xs={1}>
                                                    <StatusBadge itemStatus={step.status} />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography sx={{ flexShrink: 0 }}>
                                                        {step.type === 'apply' ? step.command : step.type} --{' '}
                                                        {StepCommands(step)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ bgcolor: '#FFEBE0' }}>
                                            {(step.output?.filter(x => x)?.length > 0) ? step.output.map((line, idx) => (
                                                <p key={'l-' + index + '-' + idx}>{line}</p>
                                            )) : <p>{renderMessage(step)}</p>}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            // Do not change this. We use it to know which deployment to cancel
                            id={deploy.storeName + '_' + deploy.id}
                            variant="contained"
                            sx={{ height: '55px', width: '155px' }}
                            disabled={
                                deploy.status.toUpperCase() !== 'INITIAL' && deploy.status.toUpperCase() !== 'PENDING'
                            }
                            onClick={handleClickOpen}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
}
