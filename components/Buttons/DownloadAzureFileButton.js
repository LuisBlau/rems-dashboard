import { Alert, AlertTitle, Box, Button, Snackbar } from "@mui/material";
import React from "react";
import { useState } from "react";

const successHideDuration = 1500;

export default function DownloadAzureFileButton({ link }) {
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);

    function handleDownloadButtonClicked() {
        setToastSuccess(`File requested from Azure`);
        setOpenSuccess(true);
    }

    return (
        link !== undefined && <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <a href={link}>
                <Button variant="contained" onClick={handleDownloadButtonClicked}>
                    Download
                </Button>
            </a>
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
        </Box>
    )
}