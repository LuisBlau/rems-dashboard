/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-self-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import useSWR from 'swr'
import fetcher from '../../lib/lib'
import { Button, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import React, { useContext, useState, useEffect } from 'react'
import Link from '@mui/material/Link'
import UserContext from '../../pages/UserContext'
import { BrokenImage } from '@mui/icons-material'
import { Container } from '@mui/system'

const PREFIX = 'OverviewAgentPaper'

const classes = {
  barHeight: `${PREFIX}-barHeight`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.barHeight}`]: {
    height: 50
  }
}))

function timeSince (date) {
  const seconds = ((new Date() - new Date(date)) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years ago'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months ago'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days ago'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}

function DisplayMasterStar (props) {
  if (props.data.is_master) {
    return (
      <Grid item xs={12}>
        <Typography>Master</Typography>
      </Grid>
    )
  }
  return (
    <Grid item xs={12}>
      &nbsp;
    </Grid>
  )
}
function DisplayOnOffStatus (props) {
  if (props.data.online) {
    return (
      <Grid item xs={4}>
        <Typography>Online</Typography>
      </Grid>
    )
  }
  return (
    <Grid item xs={4}>
      <Typography>Offline</Typography>
    </Grid>
  )
}

function DisplaySalesApplication (props) {
  const { data, error } = useSWR(
    '/REMS/agents?store=' + props.data.storeName + '&agentName=' + props.data.agentName,
    fetcher
  )

  if (error) return <div>failed to load </div>
  if (!data) return <div>loading...</div>

  const displayData = data[0]?.status
  let date = displayData?.snapshot
  const isElmo = displayData?.ELMO
  const isDB = displayData?.DeviceBroker

  if (isElmo) {
    return (
      <Grid item xs={12}>
        <Typography>Costl online: {String(timeSince(date = date))}</Typography>
      </Grid>
    )
  } else if (isDB) {
    return (
      <Grid item xs={12}>
        <Typography>WebPos</Typography>
        <Typography>{props.data.isUIstate}</Typography>
      </Grid>
    )
  }
  return (
    <Grid item xs={12}>
      <Typography>Unknown application</Typography>
    </Grid>
  )
}

function ScreenshotModal ({ data, open, handleOpen, handleClose }) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 625,
    height: 625,
    bgcolor: '#ffffff',
    border: '2px solid #000',
    outline: '#7c70b3',
    boxShadow: 24,
    p: 4
  }
  return (
    <Grid item xs={12}>
      <Button variant="contained" size="medium" onClick={handleOpen} >Screenshot</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <ScreenCaptureDisplay agentData={data} width={600} height={600} refreshInterval={5000} />
        </Box>
      </Modal>
    </Grid>
  )
}

function ScreenCaptureDisplay ({ agentData, refreshInterval, width, height }) {
  const style = {
    marginTop: 3,
    position: 'relative',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
  const screenCaptureCommand = { Retailer: agentData.retailer_id, Store: agentData.storeName, Agent: agentData.agentName, Command: 'ScreenCapture' }
  const [screenshotData, setScreenshotData] = useState({})
  fetch('/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(screenCaptureCommand).replace('/\s\g', '')))))

  const { data, error } = useSWR(
    '/REMS/agentScreenShot?storeName=' + agentData.storeName + '&agentName=' + agentData.agentName
    , fetcher, { refreshInterval })

  useEffect(() => {
    if (error) return <div>No screenshot </div>
    if (data === undefined || screenshotData === undefined) return <div>loading...</div>
    if (data) {
      if (data.image !== screenshotData.image || data.last_updated !== screenshotData.lastUpdated) {
        setScreenshotData({ lastUpdated: data.last_updated, image: data.image })
      }
    }
    const interval = setInterval(() => {
      fetch('/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(screenCaptureCommand).replace('/\s\g', '')))))

      if (data.last_updated && data.image) {
        if (data.image !== screenshotData.image || data.last_updated !== screenshotData.lastUpdated) {
          setScreenshotData({ lastUpdated: data.last_updated, image: data.image })
        }
      }
    }, refreshInterval - 2500)

    return () => clearInterval(interval)
  })
  if (Object.keys(screenshotData).length !== 0) {
    return (
      <Root>
        <img className="card-img-top" src={'data:image/png;base64,' + screenshotData.image} width={width} height={height} alt="Fetching image data..." />
        <Typography>
          Last Updated: {screenshotData.lastUpdated ? screenshotData.lastUpdated : 'Unknown'}
        </Typography>
      </Root>
    )
  } else {
    return (
      <Root>
        <Container sx={style}>
          <BrokenImage fontSize='large'/>
        </Container>
        <Typography>
          Cannot retrieve image for: {agentData.agentName}
        </Typography>
        <Typography marginTop={3}>
          Check system configuration or try again later.
        </Typography>
      </Root>
    )
  }
}

export default function OverviewAgentPaper ({ data, useScreenshotView }) {
  const context = useContext(UserContext)
  let disableReload = true
  if (context.userRoles.includes('admin')) {
    disableReload = false
  }

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const jsonCommand = { Retailer: data.retailer_id, Store: data.storeName, Agent: data.agentName, Command: 'Reload' }
  const reload_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'Dump'
  const dump_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'Wake'
  const wake_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'Sleep'
  const sleep_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'

  let hasStatus = false
  let statusType = ''
  if (data.hasOwnProperty('status')) {
    if (data.status.hasOwnProperty('ELMO')) {
      hasStatus = true
      statusType = 'ELMO'
    }
    if (data.status.hasOwnProperty('DeviceBroker')) {
      hasStatus = true
      statusType = 'DeviceBroker'
    }
  }

  if (useScreenshotView === false) {
    return (
      <Grid container>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5">{data.agentName}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DisplayMasterStar data={data} />
          </Grid>
        </Grid>
        <Grid className={classes.barHeight} container spacing={1}>
          <Grid item xs={4}>
            <DisplayOnOffStatus data={data} />
          </Grid>
          <Grid item xs={4}>
            <Typography>OS: {data.os}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DisplaySalesApplication data={data} />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid className={classes.barHeight} item xs={12}>
            <Typography>Last Update: {timeSince(data.last_updated)}</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid className={classes.barHeight} item xs={12}>
            <Typography>Status:</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid className={classes.barHeight} item xs={12}>
            {
              (hasStatus && statusType === 'ELMO') && <Typography>ui_state:"{data.status.ELMO.ui_state}"</Typography>
            }
            {
              (hasStatus && statusType === 'DeviceBroker') && <Typography>ui_state:"{data.status.DeviceBroker.ui_state}"</Typography>
            }
            {
              (hasStatus && statusType === 'ELMO') && <Typography>ui_substate:"{data.status.ELMO.ui_substate}"</Typography>
            }
            {
              (hasStatus && statusType === 'DeviceBroker') && <Typography>ui_substate:"{data.status.DeviceBroker.ui_substate}"</Typography>
            }
            {
              (hasStatus && statusType === 'ELMO') && <Typography>pinpad_stage:"{data.status.ELMO.pinpad_stage}"</Typography>
            }
            {
              (hasStatus && statusType === 'DeviceBroker') && <Typography>pinpad_stage:"{data.status.DeviceBroker.pinpad_stage}"</Typography>
            }
            {
              (!hasStatus) && <Typography>No Status Found</Typography>
            }
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={4} sx={{ margin: 1 }}>
            <Link href={dump_link}>
              <Button variant="contained" size="medium">
                Dump
              </Button>
            </Link>
          </Grid>
          <Grid item xs={4} sx={{ margin: 1 }}>
            {disableReload
              ? null
              : <Link disabled={disableReload} href={reload_link}>
                <Button disabled={disableReload} variant="contained" size="medium">
                  Reload
                </Button>
              </Link>}
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ margin: 1 }}>
            <ScreenshotModal data={data} open={open} handleOpen={handleOpen} handleClose={handleClose} />
          </Grid>
        </Grid>
      </Grid>
    )
  } else {
    return (
      <ScreenCaptureDisplay agentData={data} height={200} width={200} refreshInterval={30000}></ScreenCaptureDisplay>
    )
  }
}
