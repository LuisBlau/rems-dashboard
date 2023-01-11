/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-self-assign */
/* eslint-disable no-useless-escape */
/* eslint-disable camelcase */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import useSWR from 'swr'
import fetcher from '../../lib/lib'
import { Button, Dialog, DialogActions, DialogTitle, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import React, { useContext, useState, useEffect } from 'react'
import Link from '@mui/material/Link'
import UserContext from '../../pages/UserContext'
import { BrokenImage, PhotoCamera, PowerSettingsNew, SyncProblem } from '@mui/icons-material'
import { Container } from '@mui/system'
import EleraInfoModal from './InformationModals/EleraInfoModal'
import RmqInfoModal from './InformationModals/RmqInfoModal'
import DockerInfoModal from './InformationModals/DockerInfoModal'
import Image from 'next/image'

// TODO: Move reusable modals out of this file into their own components
const PREFIX = 'OverviewAgentPaper'
const bytesPerMegabyte = 1048576

const classes = {
  barHeight: `${PREFIX}-barHeight`,
  paper: `${PREFIX}-paper`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('main')((
  {
    theme
  }
) => ({
  [`& .${classes.barHeight}`]: {
    height: 50
  },
  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  }
}))

function timeSince (date) {
  const seconds = ((new Date() - new Date(date)) / 1000)
  return prettifyTime(seconds) + ' ago'
}

function prettifyTime (seconds) {
  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes'
  }
  return -1 * Math.floor(seconds) + ' seconds'
}

function DisplaySystemType (props) {
  if (props.data.status) {
    if (props.data.status.EleraClient) {
      if (props.data.status.EleraClient.configured === 'true') {
        return (
          <Grid item xs={12}>
            <Typography>Elera Client</Typography>
          </Grid>
        )
      }
    }
    if (props.data.status.Controller) {
      return (
        <Grid item xs={12}>
          <Typography>Controller</Typography>
        </Grid>
      )
    }
    if (props.data.status.SIGui) {
      if (props.data.status.SIGui.configured === 'true') {
        return (
          <Grid item xs={12}>
            <Typography>SI Gui</Typography>
          </Grid>
        )
      }
    }
    // TODO: investigate if this boolean is being used properly, and adjust here.
    if (props.data.is_master) {
      return (
        <Grid item xs={12}>
          <Typography>Controller - Master</Typography>
        </Grid>
      )
    }
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

function ModalDisplayButtonsComponentTitle ({ data, eleraServicesAvailable, rmqInfoAvailable }) {
  if (data.status) {
    if (data.status.docker || eleraServicesAvailable || rmqInfoAvailable) {
      return (
        <Typography>
          Service Information:
        </Typography>
      )
    } else {
      return null
    }
  } else {
    return null
  }
}

function ModalDisplayButtonsComponent ({ data, dockerModalOpen, handleDockerModalClose, handleDockerModalOpen, rmqInfoAvailable, setRmqInfoAvailable, eleraModalOpen, eleraServicesAvailable, setEleraServicesAvailable, handleEleraModalClose, handleEleraModalOpen, rmqModalOpen, handleRmqModalClose, handleRmqModalOpen }) {
  if (data.status) {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={1} sx={{ margin: 1 }}>
            <DockerInfoModal modalData={data.status} dockerModalOpen={dockerModalOpen} handleDockerModalClose={handleDockerModalClose} handleDockerModalOpen={handleDockerModalOpen} />
          </Grid>
          <Grid item xs={1} sx={{ margin: 1 }}>
            <EleraInfoModal modalData={data.status} eleraModalOpen={eleraModalOpen} eleraServicesAvailable={eleraServicesAvailable} setEleraServicesAvailable={setEleraServicesAvailable} handleEleraModalClose={handleEleraModalClose} handleEleraModalOpen={handleEleraModalOpen} />
          </Grid>
          <Grid item xs={1} sx={{ margin: 1 }}>
            <RmqInfoModal modalData={data.status} rmqModalOpen={rmqModalOpen} rmqInfoAvailable={rmqInfoAvailable} setRmqInfoAvailable={setRmqInfoAvailable} handleRmqModalClose={handleRmqModalClose} handleRmqModalOpen={handleRmqModalOpen} prettifyTime={prettifyTime} />
          </Grid>
        </Grid>
      </>
    )
  }
  return null
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
  return null
}

function ScreenshotModal ({ data, screenshotOpen, handleScreenshotOpen, handleScreenshotClose }) {
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
      <Tooltip arrow title="Agent Screenshot">
        <IconButton>
          <PhotoCamera style={{ color: '#484848' }} cursor={'pointer'} onClick={handleScreenshotOpen} />
        </IconButton>
      </Tooltip>
      <Modal
        open={screenshotOpen}
        onClose={handleScreenshotClose}
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
        <Image className="card-img-top" src={'data:image/png;base64,' + screenshotData.image} width={width} height={height} alt="Fetching image data..." />
        <Typography>
          Last Updated: {screenshotData.lastUpdated ? screenshotData.lastUpdated : 'Unknown'}
        </Typography>
      </Root>
    )
  } else {
    return (
      <Root>
        <Container sx={style}>
          <BrokenImage fontSize='large' />
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

function DumpWithConfirmationModal ({ data, link, dumpConfirmationOpen, handleDumpConfirmationOpen, handleDumpConfirmationClose }) {
  const confirmationString = 'Are you sure you want to dump agent: ' + data.agentName.replace(data.storeName + '-', '') + '?'

  return (
    <Grid item xs={12}>
      <Tooltip arrow title="Dump">
        <IconButton>
          <SyncProblem style={{ color: '#484848' }} cursor={'pointer'} onClick={handleDumpConfirmationOpen} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dumpConfirmationOpen}
        onClose={handleDumpConfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmationString}
        </DialogTitle>
        <DialogActions>
          <Button style={{ marginRight: 12 }} variant='contained' onClick={handleDumpConfirmationClose}>Cancel</Button>
          <Link href={link}>
            <Button style={{ marginRight: 12 }} variant='contained' onClick={handleDumpConfirmationClose}>Yes</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

function ReloadWithConfirmationModal ({ disableReload, data, link, reloadConfirmationOpen, handleReloadConfirmationOpen, handleReloadConfirmationClose }) {
  const confirmationString = 'Are you sure you want to reload agent: ' + data.agentName.replace(data.storeName + '-', '') + '?'

  return (
    <Grid item xs={12}>
      {disableReload
        ? null
        : <Tooltip arrow title="Reload">
          <IconButton>
            <PowerSettingsNew style={{ color: '#484848' }} cursor={'pointer'} onClick={handleReloadConfirmationOpen} />
          </IconButton>
        </Tooltip>
      }

      <Dialog
        open={reloadConfirmationOpen}
        onClose={handleReloadConfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmationString}
        </DialogTitle>
        <DialogActions>
          <Button style={{ marginRight: 12 }} variant='contained' onClick={handleReloadConfirmationClose}>Cancel</Button>
          <Link href={link}>
            <Button style={{ marginRight: 12 }} variant='contained' onClick={handleReloadConfirmationClose}>Yes</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default function OverviewAgentPaper ({ data, useScreenshotView }) {
  const context = useContext(UserContext)
  let disableReload = true
  if (context.userRoles.includes('admin')) {
    disableReload = false
  }

  const [screenshotOpen, setScreenshotOpen] = useState(false)
  const [dumpConfirmationOpen, setDumpConfirmationOpen] = useState(false)
  const [reloadConfirmationOpen, setReloadConfirmationOpen] = useState(false)
  const [dockerModalOpen, setDockerModalOpen] = useState(false)
  const [eleraModalOpen, setEleraModalOpen] = useState(false)
  const [rmqModalOpen, setRmqModalOpen] = useState(false)
  const [eleraServicesAvailable, setEleraServicesAvailable] = useState(false)
  const [rmqInfoAvailable, setRmqInfoAvailable] = useState(false)
  const handleReloadConfirmationClose = () => setReloadConfirmationOpen(false)
  const handleReloadConfirmationOpen = () => setReloadConfirmationOpen(true)
  const handleDumpConfirmationClose = () => setDumpConfirmationOpen(false)
  const handleDumpConfirmationOpen = () => setDumpConfirmationOpen(true)
  const handleScreenshotOpen = () => setScreenshotOpen(true)
  const handleScreenshotClose = () => setScreenshotOpen(false)
  const handleDockerModalOpen = () => setDockerModalOpen(true)
  const handleDockerModalClose = () => setDockerModalOpen(false)
  const handleEleraModalOpen = () => setEleraModalOpen(true)
  const handleEleraModalClose = () => setEleraModalOpen(false)
  const handleRmqModalOpen = () => setRmqModalOpen(true)
  const handleRmqModalClose = () => setRmqModalOpen(false)

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

  // Docker or Elera status checker for background
  const [agentBackgroundColorStyle, setAgentBackgroundColorStyle] = useState('#ffffff')
  if (data.status) {
    if (data.status.docker) {
      const arr = Object.values(data.status.docker)
      for (let i = 0; i < arr.length; i++) {
        arr[i] = JSON.parse(arr[i])
        // if any of the docker containers are _not_ running, change to red
        if (arr[i].State !== 'running' && agentBackgroundColorStyle !== '#ffc2cd') {
          setAgentBackgroundColorStyle('#ffc2cd')
        }
      }
    }
    if (data.status.EleraServices) {
      const eleraServicesProp = JSON.parse(Object.values(data.status.EleraServices)[0])
      let isServiceOnline = false
      for (let i = 0; i < eleraServicesProp.length; i++) {
        if (eleraServicesProp[i].name === 'status' && eleraServicesProp[i].value === 'ONLINE') {
          isServiceOnline = true
          break
        }
      }

      // if elera status on the first (default) container isn't online, make it REDDDDDD
      if (isServiceOnline && agentBackgroundColorStyle !== '#ffc2cd') {
        setAgentBackgroundColorStyle('#ffc2cd')
      }
    }
  }
  if (useScreenshotView === false) {
    return (
      <Paper className={classes.paper}>
        <Grid container style={{ backgroundColor: agentBackgroundColorStyle, padding: 12 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h5">{(data.agentName).replace(data.storeName + '-', '')}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <DisplaySystemType data={data} />
            </Grid>
          </Grid>
          <Grid className={classes.barHeight} container spacing={1}>
            <Grid item xs={4}>
              <DisplayOnOffStatus data={data} />
            </Grid>
            <Grid item xs={7}>
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
          <Grid container spacing={1} marginBottom={1.5}>
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
          <Typography>
            Agent Actions:
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={1} sx={{ margin: 1 }}>
              <DumpWithConfirmationModal data={data} link={dump_link} dumpConfirmationOpen={dumpConfirmationOpen} handleDumpConfirmationOpen={handleDumpConfirmationOpen} handleDumpConfirmationClose={handleDumpConfirmationClose} />
            </Grid>
            <Grid item xs={1} sx={{ margin: 1 }}>
              <ReloadWithConfirmationModal disableReload={disableReload} data={data} link={reload_link} reloadConfirmationOpen={reloadConfirmationOpen} handleReloadConfirmationOpen={handleReloadConfirmationOpen} handleReloadConfirmationClose={handleReloadConfirmationClose} />
            </Grid>
            <Grid item xs={1} sx={{ margin: 1 }}>
              <ScreenshotModal data={data} screenshotOpen={screenshotOpen} handleScreenshotOpen={handleScreenshotOpen} handleScreenshotClose={handleScreenshotClose} />
            </Grid>
          </Grid>
          <ModalDisplayButtonsComponentTitle data={data} eleraServicesAvailable={eleraServicesAvailable} rmqInfoAvailable={rmqInfoAvailable}></ModalDisplayButtonsComponentTitle>
          <ModalDisplayButtonsComponent data={data} dockerModalOpen={dockerModalOpen} handleDockerModalClose={handleDockerModalClose} rmqInfoAvailable={rmqInfoAvailable} setRmqInfoAvailable={setRmqInfoAvailable} handleDockerModalOpen={handleDockerModalOpen} eleraModalOpen={eleraModalOpen} handleEleraModalOpen={handleEleraModalOpen} setEleraServicesAvailable={setEleraServicesAvailable} eleraServicesAvailable={eleraServicesAvailable} handleEleraModalClose={handleEleraModalClose} rmqModalOpen={rmqModalOpen} handleRmqModalClose={handleRmqModalClose} handleRmqModalOpen={handleRmqModalOpen} />
        </Grid>
      </Paper >
    )
  } else {
    return (
      <ScreenCaptureDisplay agentData={data} height={200} width={200} refreshInterval={30000}></ScreenCaptureDisplay>
    )
  }
}
