/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import UploadGrid from '../../components/Tables/UploadGrid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, Grid, InputLabel } from '@mui/material';
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
            setTimeout(() => {
                alert('Upload successful and will be visible once the server has processed it.  Page will now refresh...');
                window.location.reload(false);
            }, 1000);

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
            const retailerIdServer = fileType === 'RETAILER' ? context.selectedRetailerParentRemsServerId : fileType;

            setUploading(true);
            // Create an object of formData
            const formData = new FormData();

            // Update the formData object
            formData.append('file', selectedFile);
            formData.append('description', description);
            // Send formData object
            axios.post(`/api/REMS/uploadfile?retailerId=${retailerIdServer}&tenantId=${context.selectedRetailer}`, formData, {
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
                <Typography marginLeft={50} marginBottom={3} variant="h3">
                    Upload a File
                </Typography>
                <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                    <Grid item xs={2}>
                        <Box sx={{ width: '100%', height: '100%' }}>
                            <label htmlFor="contained-button-file">
                                <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component="span"
                                    endIcon={<FindInPageIcon />}
                                    size="large"
                                    sx={{ width: '100%', height: '100%' }}
                                // sx={{ width: 175, height: '100%', marginRight: 0.5 }}
                                >
                                    Choose File
                                </Button>
                            </label>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField disabled label="File Name" value={fileName}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Description"
                            value={description}
                            sx={{ width: '100%' }}
                            onChange={updateDescription}
                        // sx={{ width: 275 }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        {context?.userRoles?.includes('toshibaAdmin') &&
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="select-file-type-label">Upload Type</InputLabel>
                                <Select
                                    id="fileType"
                                    value={fileType}
                                    labelId='select-file-type-label'
                                    label="Upload Type  -"
                                    onChange={(e) => setFileType(e.target.value)}
                                    sx={{ width: '100%', fontFamily: 'Arial', fontSize: '12px ', fontWeight: 200 }}
                                >
                                    <MenuItem value={'RETAILER'} style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 200 }}>UPLOAD AS RETAILER DEPLOYMENT</MenuItem>
                                    <MenuItem value={'COMMON'} style={{ fontFamily: 'Arial', fontSize: '12px', fontWeight: 200 }}>UPLOAD AS COMMON DEPLOYMENT</MenuItem>
                                </Select>
                            </FormControl>
                        }
                    </Grid>
                    <Grid item xs={2}>
                        <div style={{ display: 'flex', height: '100%', width: '100%', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={description === '' || selectedFile == null || uploading}
                                onClick={onFileUpload}
                                endIcon={<CloudUploadIcon />}
                                size="large"
                                style={{ width: '90%' }}
                                sx={
                                    uploadSuccess
                                        ? { bgcolor: green[500], '&:hover': { bgcolor: green[700] } }
                                        : {}
                                }
                            >
                                Upload
                            </Button>
                            <ProgressIndicator progress={progress} inProgress={uploading} />
                        </div>
                    </Grid>
                </Grid>
                <UploadGrid selectedRetailer={context?.selectedRetailer} />
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
