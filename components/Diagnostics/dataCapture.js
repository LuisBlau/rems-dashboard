import { styled } from '@mui/material/styles';
import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import ExtractRequestGrid from '../../components/Tables/ExtractRequestGrid';
import Typography from '@mui/material/Typography';
import UserContext from '../../pages/UserContext'
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import Copyright from '../../components/Copyright';
import RemsDataCaptureGrid from '../Tables/RemsDataCaptureGrid';
const PREFIX = 'dataCapture';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const successHideDuration = 2500;
const failHideDuration = 8000;

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingBottom: 4,
    },
}));

export default function DataCapture() {
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [selectedRetailerIsNotTenant, setSelectedRetailerIsNotTenant] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastFailure, setToastFailure] = useState('');
    const [remsDataCaptureEnabled, setRemsDataCaptureEnabled] = useState(false)

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

    useEffect(() => {
        if (context) {
            if (context.selectedRetailerIsTenant === false) {
                setSelectedRetailer(context.selectedRetailer)
                setSelectedRetailerIsNotTenant(true)
            } else {
                setSelectedRetailer(context.selectedRetailerParentRemsServerId)
            }
        }
    }, [context])

    useEffect(() => {
        if (selectedRetailerIsNotTenant === true || _.includes(context.userRoles, 'toshibaAdmin')) {
            setRemsDataCaptureEnabled(true)
        }
    }, [selectedRetailerIsNotTenant, context.userRoles])

    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h4" marginBottom={1}>
                Trigger Data Capture
            </Typography>
            {remsDataCaptureEnabled &&
                <Container className={classes.container}>
                    <RemsDataCaptureGrid selectedretailer={selectedRetailer} />
                </Container>
            }

            <Container className={classes.container}>
                <ExtractRequestGrid selectedRetailer={selectedRetailer} />
            </Container>

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
            <Copyright />
        </Root>
    );
}
