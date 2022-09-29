/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles'
import React from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react'
import useSWR from 'swr'
import moment from 'moment'
import fetcher from '../lib/fetcherWithHeader'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
const PREFIX = 'ExtractGrid'

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

const azureRenderer = function (params) {
  return (<a href={'javascript:fetch("' + params.value + '")'}>Request File</a>)
}

const linkRenderer = function (params) {
  if (params.value === undefined) return ''
  return (<a href={params.value}>Download</a>)
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
  const DateA = moment(valueA, 'YYYY-MM-DD HH:mm:ss').toDate()
  const DateB = moment(valueB, 'YYYY-MM-DD HH:mm:ss').toDate()
  if (DateA === DateB) return 0
  return (DateA > DateB) ? 1 : -1
}

export default function ExtractGrid (props) {
  const { data, error } = useSWR(['/registers/extracts', props.state], fetcher)
  if (error) return <Root>failed to load</Root>
  if (!data) return <div>loading...</div>
  return <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact style="width: 100%; height: 100%;"
              rowData={data} onGridReady={sortGrid}>
        <AgGridColumn sortable={ true } filter={ true } field="Version"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } field="Retailer"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } field="Store"></AgGridColumn>
              <AgGridColumn sortable={ true } filter={ true } field="RegNum"></AgGridColumn>
        <AgGridColumn sortable={ true } filter={ true } comparator={dateComparator} field="Timestamp"></AgGridColumn>
        <AgGridColumn sortable={ true } filter={ true } field="InStore"></AgGridColumn>
        <AgGridColumn sortable={ true } filter={ true } cellRenderer={azureRenderer} headerName="Azure" field="SBreqLink"></AgGridColumn>
        <AgGridColumn sortable={ true } filter={ true } field="ExtractType"></AgGridColumn>
        <AgGridColumn sortable={ true } filter={ true } cellRenderer={linkRenderer} field="Download"></AgGridColumn>
        <AgGridColumn sortable={ true } filter={ true } field="State"></AgGridColumn>
          </AgGridReact>
      </div>
}
