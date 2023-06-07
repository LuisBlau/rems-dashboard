/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import UploadGrid from '../../components/Tables/UploadGrid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { green } from '@mui/material/colors';
import axios from 'axios';
import ProgressIndicator from '../../components/ProgressIndicator';
import Copyright from '../../components/Copyright';
import { useContext } from 'react';
import UserContext from '../UserContext';

const PREFIX = 'deploymentFileUpload';
const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(4),
    },
}));

const Input = styled('input')({
    display: 'none',
});
export default function DeploymentFileUpload() {
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('RETAILER');
    const context = useContext(UserContext)


    // On file select (from the pop up)
    const onFileChange = (event) => {
        // Update the state

        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    useEffect(() => {
        if (progress === 100) {
            setUploadSuccess(true);
            setUploading(false);
            alert('Upload successful and will be visible once the server has processed it.  Page will now refresh...');
            window.location.reload(false);
        }
    }, [progress]);

    // On file upload (click the upload button)
    const onFileUpload = () => {
        // let websocketUrl = ''
        // if (process.env.NODE_ENV === 'development') {
        //   websocketUrl = 'localhost'
        // } else if (process.env.NODE_ENV === 'production') {
        //   websocketUrl = 'rems-dashboard.azurewebsites.net'
        // } else {
        //   websocketUrl = 'rems-dashboard-test.azurewebsites.net'
        // }
        // const webSocket = new WebSocket(`ws://${websocketUrl}:448/`)
        const retailerId = fileType === 'RETAILER' ? context.selectedRetailer : fileType;
        if (!uploading && retailerId && context.selectedRetailerIsTenant === false) {
            setUploading(true);
            // Create an object of formData
            const formData = new FormData();

            // Update the formData object
            formData.append('file', selectedFile);
            formData.append('description', description);
            // Send formData object
            axios.post(`/api/REMS/uploadfile?retailerId=${retailerId}`, formData, {
                onUploadProgress: function (e) {
                    const totalLength = e.lengthComputable
                        ? e.total
                        : e.target.getResponseHeader('content-length') ||
                        e.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength !== null) {
                        setProgress(Math.round((e.loaded * 100) / totalLength));
                    }
                },
            })
                .then(function (resp) {
                    // webSocket.onmessage = (event) => {
                    //   const data = JSON.parse(event.data)
                    //   setProgress(data)
                    //   if (data === 100) {
                    //     webSocket.close()
                    //   }
                    // }
                });
        } else if (!uploading && retailerId && context.selectedRetailerParentRemsServerId) {
            setUploading(true);
            // Create an object of formData
            const formData = new FormData();

            // Update the formData object
            formData.append('file', selectedFile);
            formData.append('description', description);
            // Send formData object
            axios.post(`/api/REMS/uploadfile?retailerId=${context.selectedRetailerParentRemsServerId}&tenantId=${retailerId}`, formData, {
                onUploadProgress: function (e) {
                    const totalLength = e.lengthComputable
                        ? e.total
                        : e.target.getResponseHeader('content-length') ||
                        e.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength !== null) {
                        setProgress(Math.round((e.loaded * 100) / totalLength));
                    }
                },
            })
                .then(function (resp) {
                    // webSocket.onmessage = (event) => {
                    //   const data = JSON.parse(event.data)
                    //   setProgress(data)
                    //   if (data === 100) {
                    //     webSocket.close()
                    //   }
                    // }
                });
        } else {
            console.log('context is probably not loaded?')
        }
    };
    const updateDescription = (e) => {
        setDescription(e.target.value);
    };

    return (
        <Root className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
                <Typography marginLeft={34} variant="h3">
                    Upload a File
                </Typography>
                <Stack direction="row" spacing={1} marginTop={2} marginBottom={2}>
                    <Box>
                        <label htmlFor="contained-button-file">
                            <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
                            <Button
                                variant="contained"
                                color="secondary"
                                component="span"
                                endIcon={<FindInPageIcon />}
                                sx={{ width: 175, height: '100%', marginRight: 0.5 }}
                            >
                                Choose File
                            </Button>
                        </label>
                        <TextField disabled label="File Name" value={fileName} />
                    </Box>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={updateDescription}
                        sx={{ width: 275 }}
                    />
                    {context?.userRoles?.includes('toshibaAdmin') &&
                        <FormControl>
                            <InputLabel id="select-file-type-label">Upload Type</InputLabel>
                            <Select
                                id="fileType"
                                value={fileType}
                                labelId='select-file-type-label'
                                label="Upload Type  -"
                                onChange={(e) => setFileType(e.target.value)}
                                sx={{ width: 300, fontFamily: 'Arial', fontSize: '12px', fontWeight: 200 }}
                            >
                                <MenuItem value={'RETAILER'} style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 200 }}>UPLOAD AS RETAILER DEPLOYMENT</MenuItem>
                                <MenuItem value={'COMMON'} style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 200 }}>UPLOAD AS COMMON DEPLOYMENT</MenuItem>
                            </Select>
                        </FormControl>
                    }
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={description === '' || selectedFile == null || uploading}
                        onClick={onFileUpload}
                        endIcon={<CloudUploadIcon />}
                        sx={
                            uploadSuccess
                                ? { width: 175, bgcolor: green[500], '&:hover': { bgcolor: green[700] } }
                                : { width: 175 }
                        }
                    >
                        Upload
                    </Button>
                    <ProgressIndicator progress={progress} inProgress={uploading} />
                </Stack>
                <UploadGrid selectedRetailer={context?.selectedRetailer} />
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
