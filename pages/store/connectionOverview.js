/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import useSWR from 'swr'
import { styled } from '@mui/material/styles'
import fetcher from '../../lib/lib'
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Copyright from '../../src/Copyright'
import OverviewStorePaper from '../../components/Connection/OverviewStorePaper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import CellTowerIcon from '@mui/icons-material/CellTower'
import SignalWifiConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiConnectedNoInternet4'
import HandymanIcon from '@mui/icons-material/Handyman'
import { FormControlLabel } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'

const PREFIX = 'connectionOverview'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`,
  tinySpace: `${PREFIX}-tinySpace`
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

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },

  [`& .${classes.appBarSpacer}`]: {
    paddingTop: 80
  },
  [`& .${classes.tinySpace}`]: {
    paddingTop: 20
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

const drawerWidth = 240

function timeSince (date) {
  const seconds = Math.floor((new Date() - date) / 1000)

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

function RemsConnected (props) {
  if (props.up) {
    return <Tooltip title="Rems Server Up"><CellTowerIcon fontSize="large"/></Tooltip>
  } else {
    return <Tooltip title="Rems Server Down"><SignalWifiConnectedNoInternet4Icon fontSize="large"/></Tooltip>
  }
}

function CloudConnected (props) {
  if (props.up) {
    return <Tooltip title="Cloud Forwarder Up"><CloudQueueIcon fontSize="large"/></Tooltip>
  } else {
    return <Tooltip title="Cloud Forwarder Down"><CloudOffIcon fontSize="large"/></Tooltip>
  }
}
function PasConnected (props) {
  if (props.up) {
    return <Tooltip title="PAS Assistance On"><HandymanIcon fontSize="large"/></Tooltip>
  } else {
    return <Typography></Typography>
  }
}

function RemsStatus (props) {
  const { data, error } = useSWR(
    '/REMS/rems',
    fetcher
  )

  if (error) return <div>failed to load </div>
  if (!data) return <div>loading...</div>
  return (
    <Root>
      <Paper elevation={3} className={classes.paper} >
      <Grid container spacing={1}>
        <Grid item xs={2.5}>
          <RemsConnected up={data.rems}/>
        </Grid>
        <Grid item xs={2.5}>
          <CloudConnected up={data.cloud}/>
        </Grid>
        <Grid item xs={2.5}>
          <PasConnected up={data.pas}/>
        </Grid>
        <Grid item xs={4.5}>
          <Typography>
            Last Update:
          </Typography>
          <Typography>
            {timeSince(data.last_update_sec * 1000)}
          </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Root>
  )
}

function FilterStores (props) {
  let data = props.data

  if (props.disconnectedFilter) {
    data = data.filter((store) => store.online === false)
  }

  if (props.downFilter) {
    data = data.filter((store) => store.totalAgents > store.onlineAgents)
  }

  return data.filter((store) =>
    (store.storeName.toLowerCase()).includes(props.filterText.toLowerCase())
  )
    .map((store, index) => (
  <Grid key={index} item xs={6}>
    <Paper className={classes.paper}>
      <OverviewStorePaper data={store} />
    </Paper>
  </Grid>
    ))
}

export default function ConnectionOverview () {
  const [filterText, setFilterText] = useState('')
  const [disconnectedFilter, setDisconnectedFilter] = useState(false)
  const [downFilter, setDownFilter] = useState(false)

  const handleDisconnectedChange = (event) => {
    setDisconnectedFilter(event.target.checked)
  }

  const handleDownChange = (event) => {
    setDownFilter(event.target.checked)
  }

  const { data, error } = useSWR(
    '/REMS/stores',
    fetcher
  )
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={1}>
          <Grid item xs={8.5}>
            <Typography variant="h3">Enterprise Overview</Typography>
          </Grid>
          <Grid item xs={3.5}>
            <RemsStatus/>
          </Grid>
          </Grid>
          <Grid></Grid>
          <div className={classes.tinySpace} />
          <Grid container spacing={3}>
            <Grid item xs={3} />
            <Grid item xs={3} >
            <FormControlLabel control={<Checkbox defaultChecked={false} onChange={handleDisconnectedChange} />} label="Disconnected Sites" />
            </Grid>
            <Grid item xs={3} >
            <FormControlLabel control={<Checkbox defaultChecked={false} onChange={handleDownChange} />} label="Down Agents" />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="outlined-basic"
                label="Site Name"
                variant="outlined"
                onChange={(event) => setFilterText(event.target.value)}
              />
          </Grid>
          <FilterStores data={data} filterText={filterText} disconnectedFilter={disconnectedFilter} downFilter={downFilter}/>
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </Root>
  )
}
