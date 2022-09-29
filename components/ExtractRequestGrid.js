/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import React from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react'
import useSWR from 'swr'
import fetcher from '../lib/fetcherWithHeader'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import axios from 'axios'
const PREFIX = 'DumpGrid'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`
}

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
  }
}))

const skyButtonRenderer = function (params) {
  return (<Button onClick={() => {
    params.data.dataCapture = 'SkyLogs'
    axios.post('/api/registers/requestDump', params.data).catch()
  }}>Request</Button>)
}
const rmaButtonRenderer = function (params) {
  return (<Button onClick={() => {
    params.data.dataCapture = 'RMA'
    axios.post('/api/registers/requestDump', params.data).catch()
  }}>Request</Button>)
}
const eleraButtonRenderer = function (params) {
  return (<Button onClick={() => {
    params.data.dataCapture = 'EleraClient'
    axios.post('/api/registers/requestDump', params.data).catch()
  }}>Request</Button>)
}
const eleraServicesButtonRenderer = function (params) {
  return (<Button onClick={() => {
    params.data.dataCapture = 'EleraServices'
    axios.post('/api/registers/requestDump', params.data).catch()
  }}>Request</Button>)
}
const checButtonRenderer = function (params) {
  return (<Button onClick={() => {
    params.data.dataCapture = 'Chec'
    axios.post('/api/registers/requestDump', params.data).catch()
  }}>Request</Button>)
}

const sortGrid = function (event) {
  const columnState = {
    state: [
      {
        colId: 'Timestamp',
        sort: 'desc'
      }
    ]
  }
  event.columnApi.applyColumnState(columnState)
}
const dateComparator = (valueA, valueB, nodeA, nodeB, isInverted) => {
  const DateA = Date.parse(valueA)
  const DateB = Date.parse(valueB)
  if (DateA === DateB) return 0
  return (DateA > DateB) ? 1 : -1
}

export default function ExtractRequestGrid (props) {
  const { data, error } = useSWR(['/REMS/agents', props.state], fetcher)
  if (error) return <Root>failed to load</Root>
  if (!data) return <div>loading...</div>
  const registerlist = []
  for (const x of data) {
    registerlist.push({
      retailer_id: x.retailer_id,
      store_name: x.storeName,
      agent: x.agentName
    })
  }
  return <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact style="width: 100%; height: 100%;"
              rowData={registerlist} onGridReady={sortGrid}>
              <AgGridColumn sortable={ true } filter={ true } field="store_name"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } field="agent"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } cellRenderer={skyButtonRenderer} field="SKY Logs Capture"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } cellRenderer={rmaButtonRenderer} field="RMA Capture"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } cellRenderer={eleraButtonRenderer} field="EleraClient Capture"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } cellRenderer={eleraServicesButtonRenderer} field="EleraServices Capture"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } cellRenderer={checButtonRenderer} field="Chec Capture"></AgGridColumn>
          </AgGridReact>
      </div>
}
