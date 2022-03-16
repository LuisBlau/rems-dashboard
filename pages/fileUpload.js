import React, { Component, useState } from 'react';
import { styled } from '@mui/material/styles';

import Container from "@mui/material/Container";
import UploadGrid from "../components/UploadGrid";
import Copyright from "../src/Copyright";
import Box from "@mui/material/Box";

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

export default function Upload(props) {

	const [selectedFile,setSelectedFile] = useState(0)

	// On file select (from the pop up)
	const onFileChange = event => {

	// Update the state
	setSelectedFile(event.target.files[0]);

	};

	// On file upload (click the upload button)
	const onFileUpload = () => {

	// Create an object of formData
	const formData = new FormData();

	// Update the formData object
	formData.append(
		"file",
		selectedFile);

	// Details of the uploaded file
	console.log(selectedFile);

	// Request made to the backend api
	// Send formData object
	const requestOptions = {
        method: 'POST',
		body: formData
    };
    fetch('/api/REMS/uploadfile', requestOptions).then(response => alert("upload successful"))
	};

    return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container align="center" maxWidth="lg" className={classes.container} >
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}> Upload! </button>
                <UploadGrid/>
            </Container>

            <Box pt={4}>
                <Copyright />
            </Box>
        </Root>
    );
}