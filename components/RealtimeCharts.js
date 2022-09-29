/* eslint-disable react/prop-types */
import React from 'react'
import useSWR from 'swr'
import fetcher from '../lib/fetcherWithHeader'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import PieChart, { Connector, Label, Legend, Series, Size } from 'devextreme-react/pie-chart'

export function RealtimeCharts (props) {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <UIStateChart state={props.state} />
        <PinpadStateChart state={props.state} />
        <ScannerStateChart state={props.state} scannerNumber={'1'} />
        <ScannerStateChart state={props.state} scannerNumber={'2'} />
      </Grid>
    </React.Fragment>
  )
}

function UIStateChart (props) {
  const { data, error } = useSWR([`/${props.state.regOrSnap}/uiState`, props.state], fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <React.Fragment>
      <GeneralChart data={data} title={'UI State'} />
    </React.Fragment>
  )
}

function ScannerStateChart (props) {
  const { data, error } = useSWR([`/${props.state.regOrSnap}/scanner` + props.scannerNumber, props.state], fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <React.Fragment>
      <GeneralChart data={data} title={'Scanner' + props.scannerNumber + ' State'} />
    </React.Fragment>
  )
}

function PinpadStateChart (props) {
  const { data, error } = useSWR([`/${props.state.regOrSnap}/pinpad`, props.state], fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <React.Fragment>
      <GeneralChart data={data} title={'Pinpad State'} />
    </React.Fragment>
  )
}

function GeneralChart (props) {
  function customizeText ({ argument, value }) {
    return `${argument}: ${value}`
  }

  return (
    <Grid item xs={6}>
      <Paper>
        <PieChart id={'pie' + props.title} dataSource={props.data}
          palette="Bright" title={props.title}
        >
          <Legend visible={false} />
          <Series
            argumentField="name"
            valueField="value"
          >
            <Label visible={true} customizeText={customizeText}>
              <Connector visible={true} width={1} />
            </Label>
          </Series>
          <Size />
        </PieChart>
      </Paper>
    </Grid>)
}
