/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

import Container from '@mui/material/Container'
import UploadGrid from '../components/UploadGrid'
import Copyright from '../src/Copyright'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Stack } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import { green } from '@mui/material/colors'

import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'

const PREFIX = 'fileUpload'
const classes = {
  content: `${PREFIX}-content`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`
}

const Root = styled('main')((
  {
    theme
  }
) => ({
  [`&.${classes.content}`]: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },

  [`& .${classes.appBarSpacer}`]: {
    paddingTop: 50
  },

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(4)
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },

  [`& .${classes.fixedHeight}`]: {
    height: 240
  }
}))

const Input = styled('input')({
  display: 'none'
})

function UploadProgressIndicator ({ progress, uploading }) {
  if (progress !== 0) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={progress} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 12,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(progress)}%`}
          </Typography>
        </Box>
      </Box>
    )
  } else if (progress === 0 && uploading === true) {
    return <CircularProgress variant="indeterminate"/>
  } else {
    return null
  }
}

export default function Upload () {
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [description, setDescription] = useState('')
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState('')

  // On file select (from the pop up)
  const onFileChange = event => {
    // Update the state

    setSelectedFile(event.target.files[0])
    setFileName(event.target.files[0].name)
  }

  useEffect(() => {
    if (progress === 100) {
      setUploadSuccess(true)
      setUploading(false)
      alert('Upload successful and will be visible once the server has processed it.  Page will now refresh...')
      window.location.reload(false)
    }
  }, [progress])

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

    if (!uploading) {
      setUploading(true)
      // Create an object of formData
      const formData = new FormData()

      // Update the formData object
      formData.append('file', selectedFile)
      formData.append('description', description)
      // Send formData object
      axios.post('/api/REMS/uploadfile', formData, {
        onUploadProgress: function (e) {
          const totalLength = e.lengthComputable ? e.total : e.target.getResponseHeader('content-length') || e.target.getResponseHeader('x-decompressed-content-length')
          if (totalLength !== null) {
            setProgress(Math.round((e.loaded * 100) / totalLength))
          }
        }
      }).then(function (resp) {
        // webSocket.onmessage = (event) => {
        //   const data = JSON.parse(event.data)
        //   setProgress(data)
        //   if (data === 100) {
        //     webSocket.close()
        //   }
        // }
      })
    }
  }

  const updateDescription = (e) => {
    setDescription(e.target.value)
  }

  return (

    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container} >
        <Typography marginLeft={34} variant="h3">Upload a File</Typography>

        <Stack direction="row" spacing={1} marginTop={2} marginBottom={2}>
          <Box >
            <label htmlFor="contained-button-file">
              <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
              <Button variant="contained" color="secondary"
                component="span"
                endIcon={< FindInPageIcon />}
                sx={{ width: 175, height: '100%', marginRight: 0.5 }}
              >
                Choose File
              </Button>
            </label>
            <TextField disabled label="File Name" value={fileName} />
          </Box>

          <TextField label="Description" value={description} onChange={updateDescription} sx={{ width: 275 }} />
          <Button
            variant="contained"
            color="primary"
            disabled={description === '' || selectedFile == null || uploading}
            onClick={onFileUpload}
            endIcon={< CloudUploadIcon />}
            sx={uploadSuccess ? { width: 175, bgcolor: green[500], '&:hover': { bgcolor: green[700] } } : { width: 175 }}
          >
            Upload
          </Button>
          <UploadProgressIndicator progress={progress} uploading={uploading} />
        </Stack>
        <UploadGrid />

        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </Root>
  )
}
