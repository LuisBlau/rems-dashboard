/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Copyright from '../../src/Copyright'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import useSWR from 'swr'
import fetcher from '../../lib/fetcherWithHeader'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import { RealtimeCharts } from '../../components/RealtimeCharts_alternative'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useQueryState } from 'use-location-state'
const PREFIX = 'realtime_alternative'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.content}`]: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },

  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
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

export default function Realtime () {
  const [state, setState] = useState({
    store: 0,
    hours: 12,
    country: 'US, CA',
    regOrSnap: 'snapshots',
    version: ''
  })
  const [hoursFilter, sethoursFilter] = useQueryState('hours', 12)
  const [filters, setFilters] = useState({
    uiState: '',
    itemSubstate: '',
    tenderSubstate: '',
    pinpad: ''
  })

  // <editor-fold desc="state-setters">
  function setVersionState (version) {
    const d = document.getElementById('cpc_id')
    const temp = d.options[d.selectedIndex].text
    setState(prevState => ({ ...prevState, version: temp }))
  }

  function setStore (store) {
    setState(prevState => ({ ...prevState, store }))
  }

  function setHours (hours) {
    sethoursFilter(hours)
    window.location.reload()
  }

  function setCountry (country) {
    setState(prevState => ({ ...prevState, country }))
  }

  function setRegOrSnap () {
    const result = state.regOrSnap === 'snapshots' ? 'registers' : 'snapshots'
    setState(prevState => ({ ...prevState, regOrSnap: result }))
    console.log('new state: ' + JSON.stringify(state))
  }

  function setUIState (uiState) {
    setFilters(prevFilters => ({ ...prevFilters, uiState }))
  }

  function setPinpad (pinpad) {
    setFilters(prevFilters => ({ ...prevFilters, pinpad }))
  }

  function setItemSubstate (itemSubstate) {
    setFilters(prevFilters => ({ ...prevFilters, itemSubstate }))
  }

  function setTenderSubstate (tenderSubstate) {
    setFilters(prevFilters => ({ ...prevFilters, tenderSubstate }))
  }
  function resetFilters () {
    setFilters({
      uiState: '',
      itemSubstate: '',
      tenderSubstate: '',
      pinpad: ''
    })
  }

  const { data, error } = useSWR('/snapshots/versions', fetcher)

  if (error) return <div>failed to load CPC Versions</div>
  if (!data) return <div>loading CPC Versions...</div>
  // </editor-fold>

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Store</InputLabel>
              <Input id="component-simple" onChange={(e) => setStore(e.target.value)} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <TextField defaultValue={hoursFilter} label="Hours Default: 12" htmlFor="component-simple" onChange={e => setHours(e.target.value)}>Hours (Default: {12})</TextField>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <InputLabel htmlFor="component-simple">Country (Default: US,CA)</InputLabel>
              <Input id="component-simple" onChange={e => setCountry(e.target.value)} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={resetFilters} variant={'contained'} color={'secondary'}>Clear Filters</Button>
          </Grid>
          <Grid item xs={3}>
            <select onChange={e => setVersionState(e.target.value)} id="cpc_id">
              <option value="CPCVersions"> -- CPC Versions --</option>
              { }
              {data.map((item) => <option value {...item}>{item}</option>)};
            </select>
          </Grid>
          <ReloadObjects hours={hoursFilter} filters={filters} uiFilter={setUIState} pinpadFilter={setPinpad}
            itemSubstateFilter={setItemSubstate}
            tenderSubstateFilter={setTenderSubstate}
            state={state} />
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </main>
  )
}

function ReloadObjects (props) {
  props.state.hours = props.hours
  console.log(props.state)
  const { data, error } = useSWR(['/snapshots/snaptime', props.state], fetcher)
  if (error) return <div>failed to load property data</div>
  if (!data) return <div>loading property data...</div>

  return (
    <Root>
      <Grid item xs={12}>
        <RealtimeCharts hours={props.hours} filters={props.filters} uiFilter={props.uiFilter} pinpadFilter={props.pinpadFilter}
          itemSubstateFilter={props.itemSubstateFilter}
          tenderSubstateFilter={props.tenderSubstateFilter}
          state={props.state} />
      </Grid>
      <Grid>
      </Grid>
    </Root>
  )
}

function ReloadCount (props) {
  const { data, error } = useSWR(
    [`/${props.state.regOrSnap}/reloads/`, props.state],
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <React.Fragment>
      {data.count}
    </React.Fragment>
  )
}
function exportTableToCSV () {
  const filename = 'TableData.csv'
  const csv = []
  const rows = document.querySelectorAll('tr')
  for (let i = 0; i < rows.length; i++) {
    const row = []; const cols = rows[i].querySelectorAll('td, th')
    for (let j = 0; j < cols.length; j++) { row.push(cols[j].innerText) }
    csv.push(row.join(','))
  }
  const finaltext = csv.join('\n')
  const csvFile = new Blob([finaltext], { type: 'octet/stream' })
  const downloadLink = document.createElement('a')
  downloadLink.download = filename
  downloadLink.href = window.URL.createObjectURL(csvFile)
  downloadLink.style.display = 'none'
  document.body.appendChild(downloadLink)
  downloadLink.click()
}

function ReloadTable (props) {
  const { data, error } = useSWR('/snapshots/properties', fetcher)
  if (error) return <div>failed to load property data</div>
  if (!data) return <div>loading property data...</div>

  return (
    <React.Fragment>
      <Button onClick={exportTableToCSV} variant={'contained'} color={'secondary'}>Download as CSV</Button>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Register</TableCell>
            <TableCell>Store</TableCell>
            <ReloadTableHeader properties={data} />
          </TableRow>
        </TableHead>
        <TableBody>
          <ReloadTableBody data={props.data} filters={props.filters} properties={data} />
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

function ReloadTableHeader (props) {
  return (
    props.properties.map((property) => (
      <TableCell>{property.property_id}:{property.property_name}</TableCell>
    ))
  )
}

function ReloadTableBody (props) {
  function ignoreCaseEqual (a, b) {
    return a.toLowerCase() === b.toLowerCase()
  }

  return (
    <React.Fragment>
      {props.data
        .filter(reload => (ignoreCaseEqual(reload.props['1'], props.filters.uiState) || props.filters.uiState === ''))
        .filter(reload => (ignoreCaseEqual(reload.props['2'], props.filters.itemSubstate) || props.filters.itemSubstate === ''))
        .filter(reload => (ignoreCaseEqual(reload.props['3'], props.filters.tenderSubstate) || props.filters.tenderSubstate === ''))
        .filter(reload => (ignoreCaseEqual(reload.props['9'], props.filters.pinpad) || props.filters.pinpad === ''))
        .map((reload) => (
          <TableRow>
            <TableCell>{reload.datetime}</TableCell>
            <TableCell>{reload.country}</TableCell>
            <TableCell>{reload.register}</TableCell>
            <TableCell>{reload.store}</TableCell>
            {Object.keys(reload.props).map((prop_key) => (
              <TableCell>{reload.props[prop_key]}</TableCell>
            ))}
          </TableRow>
        ))}
    </React.Fragment>
  )
}
