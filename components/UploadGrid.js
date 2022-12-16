/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles'
import React from 'react'
import { AgGridColumn, AgGridReact } from 'ag-grid-react'
import useSWR from 'swr'
import fetcher from '../lib/fetcherWithHeader'
import Button from '@mui/material/Button'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
import axios from 'axios'
const PREFIX = 'UploadGrid'

const classes = {
  content: `${PREFIX}-content`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`
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

  [`& .${classes.appBarSpacer}`]: {
    paddingTop: 50
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

const sortGrid = function (event) {
  const columnState = {
    state: [
      {
        colId: 'timestamp',
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

export default function UploadGrid (props) {
  const { data, error, mutate } = useSWR(['/REMS/uploads?archived=true', props.state], fetcher)

  const archiveRenderer = (rprops) => {
    const [archived, setArchived] = React.useState(rprops.value)
    const changeArchiveStatus = (e) => {
      axios.get('/api/REMS/setArchive?id=' + rprops.data._id.toString() + '&archived=' + (!archived).toString()).then((x) => {
        setArchived((!archived))
        mutate()
      })
    }
    if (archived) {
      return (
        <Button variant="contained" onClick={changeArchiveStatus}>Unarchive</Button>
      )
    } else {
      return (
        <Button variant="contained" onClick={changeArchiveStatus}>Archive</Button>
      )
    }
  }
  if (error) return <Root>failed to load</Root>
  if (!data) return <div>loading...</div>
  return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '75%' }}>
            <AgGridReact
                paginationAutoPageSize={true}
                pagination={true}
                style={{ width: '100%', height: '100%' }}
                rowData={data}
                onGridReady={sortGrid}>

                <AgGridColumn sortable={true} filter={true} field="description"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="filename"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} comparator={dateComparator} field="timestamp"></AgGridColumn>
                <AgGridColumn sortable={true} filter={true} field="archived" cellRenderer={archiveRenderer}></AgGridColumn>

            </AgGridReact>
        </div>
  )
}
