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
import React, { useContext } from 'react'
import Link from '@mui/material/Link'
import UserContext from '../../pages/UserContext'

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

function DisplayScreenShot (props) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f75777',
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
          <ScreenCapture data={props.data} />
        </Box>
      </Modal>
    </Grid>
  )
}
function ScreenCapture (props) {
  const { data, error } = useSWR(
    '/REMS/agentScreenShot?storeName=' + props.data.storeName + '&agentName=' + props.data.agentName
    , fetcher)

  if (error) return <div>No screenshot </div>
  if (!data) return <div>loading...</div>
  return (
    <Root>
      <Typography>
        Screenshot
      </Typography>
      <Typography>
        {data.last_updated}
      </Typography>
      <img className="card-img-top" src={'data:image/png;base64,' + data.image} width={300} height={300} alt="Card image cap" />
    </Root>
  )
}
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

export default function OverviewAgentPaper (props) {
  const context = useContext(UserContext)
  let disableReload = true
  if (context.userRoles.includes('admin')) {
    disableReload = false
  }

  const jsonCommand = { Retailer: props.data.retailer_id, Store: props.data.storeName, Agent: props.data.agentName, Command: 'Reload' }
  const reload_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'Dump'
  const dump_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'ScreenCapture'
  const screencapture_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'Wake'
  const wake_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'
  jsonCommand.Command = 'Sleep'
  const sleep_link = 'javascript:fetch("/api/registers/commands/' + btoa(unescape(encodeURIComponent(JSON.stringify(jsonCommand).replace('/\s\g', '')))) + '")'

  let hasStatus = false
  let statusType = ''
  if (props.data.hasOwnProperty('status')) {
    if (props.data.status.hasOwnProperty('ELMO')) {
      hasStatus = true
      statusType = 'ELMO'
    }
    if (props.data.status.hasOwnProperty('DeviceBroker')) {
      hasStatus = true
      statusType = 'DeviceBroker'
    }
  }

  return (
    <Grid container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h5">{props.data.agentName}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DisplayMasterStar data={props.data} />
        </Grid>
      </Grid>
      <Grid className={classes.barHeight} container spacing={1}>
        <Grid item xs={4}>
          <DisplayOnOffStatus data={props.data} />
        </Grid>
        <Grid item xs={4}>
          <Typography>OS: {props.data.os}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DisplaySalesApplication data={props.data} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid className={classes.barHeight} item xs={12}>
          <Typography>Last Update: {timeSince(props.data.last_updated)}</Typography>
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
            (hasStatus && statusType === 'ELMO') && <Typography>ui_state:"{props.data.status.ELMO.ui_state}"</Typography>
          }
          {
            (hasStatus && statusType === 'DeviceBroker') && <Typography>ui_state:"{props.data.status.DeviceBroker.ui_state}"</Typography>
          }
          {
            (hasStatus && statusType === 'ELMO') && <Typography>ui_substate:"{props.data.status.ELMO.ui_substate}"</Typography>
          }
          {
            (hasStatus && statusType === 'DeviceBroker') && <Typography>ui_substate:"{props.data.status.DeviceBroker.ui_substate}"</Typography>
          }
          {
            (hasStatus && statusType === 'ELMO') && <Typography>pinpad_stage:"{props.data.status.ELMO.pinpad_stage}"</Typography>
          }
          {
            (hasStatus && statusType === 'DeviceBroker') && <Typography>pinpad_stage:"{props.data.status.DeviceBroker.pinpad_stage}"</Typography>
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
            : <Link disabled={disableReload} href={wake_link}>
              <Button disabled={disableReload} variant="contained" size="medium">
                Reload
              </Button>
            </Link>}
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ margin: 1 }}>
          <DisplayScreenShot data={props.data} />
        </Grid>
      </Grid>
    </Grid>
  )
}
