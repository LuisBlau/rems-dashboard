/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import Copyright from '../src/Copyright'
import axios from 'axios'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { DeployTable } from '../components/DeployTable'

const PREFIX = 'deployStatus'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
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

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },

  [`& .${classes.appBarSpacer}`]: {
    paddingTop: 50
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

export default function DeployStatus () {
  // Max number of records to pull from database. 0 = all records.
  const maxRecords = 20

  const [storeFilter, setStoreFilter] = React.useState('')
  const [packageFilter, setPackageFilter] = React.useState(0)
  const [packageFilterItems, setPackageFilterItems] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState('All')
  const [statusFilterItems, setStatusFilterItems] = React.useState(null)
  useEffect(() => {
    axios.get('/api/REMS/deploy-configs').then((resp) => setPackageFilterItems([{ id: 0, name: 'All Configs' }].concat(resp.data)))
    setStatusFilterItems([{ id: 'All', name: 'All Status' }, { id: 'Pending', name: 'Pending' }, { id: 'Failed', name: 'Failed' }, { id: 'Success', name: 'Success' }, { id: 'Cancel', name: 'Cancelled' }])
  }, [])
  if (packageFilterItems == null) {
    return 'loading . . .'
  }
  const changeStoreFilter = (e) => {
    setStoreFilter(e.target.value)
  }
  const changePackageFilter = (e) => {
    setPackageFilter(e.target.value)
  }

  const changeStatusFilter = (e) => {
    setStatusFilter(e.target.value)
  }
  if (packageFilter == null) { return <p>loading...</p> }

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Typography align="center" variant="h3">Deployment Status</Typography>
        <Box pt={2}>
          <Grid container spacing={4}>
            <Grid item xs={1} >
            </Grid>
            <Grid item xs={3} >
              <TextField value={storeFilter} onChange={changeStoreFilter} label="store" />
            </Grid>
            <Grid item xs={2} >
              <Select
                value={statusFilter}
                labelId="demo-simple-select-label-status"
                id="demo-simple-select-status"
                label="Type"
                onChange={changeStatusFilter}
              >
                {statusFilterItems.map((i, index) => <MenuItem key={index} value={i.id}>{i.name}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={4} >
              <Select
                value={packageFilter}
                labelId="demo-simple-select-label-type"
                id="demo-simple-select-type"
                label="Type"
                onChange={changePackageFilter}
              >
                {packageFilterItems.map((i, index) => <MenuItem key={'mi-' + index} value={i.id}>{i.name}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </Box>

        <DeployTable
          storeFilter={storeFilter}
          packageFilter={packageFilter}
          maxRecords={maxRecords}
          statusFilter={statusFilter}
        />

        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </Root>
  )
}
