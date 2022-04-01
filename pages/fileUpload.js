import React, { Component, useState } from 'react';
import { styled } from '@mui/material/styles';

import Container from "@mui/material/Container";
import UploadGrid from "../components/UploadGrid";
import Copyright from "../src/Copyright";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField"
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import { Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FindInPageIcon from '@mui/icons-material/FindInPage';


import axios from "axios"
import CircularProgress from '@mui/material/CircularProgress';


const PREFIX = 'fileUpload';
const classes = {
    content: `${PREFIX}-content`,
    appBarSpacer: `${PREFIX}-appBarSpacer`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`
};

const Root = styled('main')((
    {
        theme
    }
) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },

    [`& .${classes.appBarSpacer}`]: {
        paddingTop: 50
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(4),
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },

    [`& .${classes.fixedHeight}`]: {
        height: 240,
    }
}));

const Input = styled("input")({
    display: "none"
});

export default function Upload(props) {

    const [selectedFile, setSelectedFile] = useState(null)
    const [description, setDescription] = useState("")
    const [progress, setProgress] = useState(0)
    const [fileName, setFileName] = useState("")

    // On file select (from the pop up)
    const onFileChange = event => {

        // Update the state

        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name)

    };

    // On file upload (click the upload button)
    const onFileUpload = () => {

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append("file", selectedFile);
        formData.append("description", description)
        // Details of the uploaded file
        console.log(selectedFile);

        // Request made to the backend api
        // Send formData object
        axios.post('/api/REMS/uploadfile', formData,{onUploadProgress:function(e) {
                const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) {
                    setProgress(Math.round((e.loaded * 100) / totalLength));
                }
            }
        }).then(function (resp) {
            alert("upload successful");
            window.location.reload(false);
        })
    };

    const updateDescription = (e) => {
        setDescription(e.target.value)
    }

    return (

        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container} >
                <Typography marginLeft={34} variant="h3">Upload a File</Typography>

                <Stack direction="row" spacing={1} marginTop={2}>
                    <Box >
                        <label htmlFor="contained-button-file">
                            <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
                            <Button variant="contained" color="secondary"
                                component="span"
                                endIcon={< FindInPageIcon />}
                                sx={{ width: 175, height: "100%", marginRight: 0.5 }}
                            >
                                Choose File
                            </Button>
                        </label>
                        <TextField disabled label="File Name" value={fileName} />
                    </Box>

                    <TextField label="Description" value={description} onChange={updateDescription} sx={{ width: 275 }} />
                    <Button variant="contained" color="primary" disabled={description == "" || selectedFile == null}
                        onClick={onFileUpload} endIcon={< CloudUploadIcon />}
                        sx={{ width: 175 }}
                    >
                        Upload
                    </Button>

                </Stack>
                <CircularProgress variant="determinate" value={progress} />
                <UploadGrid />

                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}