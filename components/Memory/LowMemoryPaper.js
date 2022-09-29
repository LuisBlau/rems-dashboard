/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { Grid, Typography } from '@mui/material'
import React from 'react'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

export default function LowMemoryPaper (props) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <Typography variant="h5">{Object.keys(props.data)[0]}</Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="subtitle1" align={'right'}>
          {/* {props.data.os_version} */}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <DriveTable data={props.data} />
      </Grid>
    </Grid>
  )
}

function DriveTable (props) {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Drive Name</TableCell>
            <TableCell>Free Memory</TableCell>
            <TableCell>Total Memory</TableCell>
            <TableCell>% Free</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data[Object.keys(props.data)].map((drive) => (
            <TableRow>
              <TableCell>{drive.drive}</TableCell>
              <TableCell>{drive.free_mem}</TableCell>
              <TableCell>{drive.total_mem}</TableCell>
              <TableCell>{drive.percent_free}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}
