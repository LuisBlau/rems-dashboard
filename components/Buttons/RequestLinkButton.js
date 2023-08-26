import { Alert, AlertTitle, Box, Button, Snackbar } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";

const successHideDuration = 1500;
const errorHideDuration = 10000;

export default function RequestLinkButton({ link }) {
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [toastError, setToastError] = useState('');
    const [openError, setOpenError] = useState(false);

    function handleDownloadButtonClicked(e) {
        axios.get(link).then(function (res) {
            if (res.status === 200) {
                setToastSuccess(`File requested from Azure`);
                setOpenSuccess(true);
            }
        }).catch(function (error) {
            setToastError(`File not available, contact support with Store, Agent, and: ${error.message}`)
            setOpenError(true)
        })
    }

    return (
        <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="contained" onClick={handleDownloadButtonClicked}>
                Request File
            </Button>
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
                open={openError}
                autoHideDuration={errorHideDuration}
                onClose={(event) => {
                    setOpenError(false);
                }}
            >
                <Alert variant="filled" severity="error">
                    <AlertTitle>Error!</AlertTitle>
                    {toastError}
                </Alert>
            </Snackbar>
        </Box>
    )
}