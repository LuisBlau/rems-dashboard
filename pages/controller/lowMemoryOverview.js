/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import useSWR from 'swr'
import fetcher from '../../lib/lib.js'
import LowMemoryPaper from '../../components/Memory/LowMemoryPaper'
import OverviewLayout from '../../components/OverviewLayout'
import TextField from '@mui/material/TextField'
const PREFIX = 'lowMemoryOverview'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`
}

const StyledOverviewLayout = styled(OverviewLayout)((
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
  }
}))

const drawerWidth = 240

export default function ConnectionOverview (props) {
  const [filterText, setFilterText] = useState(props.filter)

  const { data, error } = useSWR(
    '/REMS/low-mem',
    fetcher
  )
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <StyledOverviewLayout>
      <Grid item xs={8}/>
      <Grid item xs={4}>
        <TextField
          defaultValue={props.filter}
          id="outlined-basic"
          label="Filter"
          variant="outlined"
          onChange={(event) => setFilterText(event.target.value)}
        />
      </Grid>
      { data.filter((controller) =>
        Object.keys(controller)[0].includes(filterText.toLowerCase())
      ).map((controller) => (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <LowMemoryPaper data={controller}/>
            </Paper>
          </Grid>
      ))
      }
    </StyledOverviewLayout>
  )
}

ConnectionOverview.defaultProps = {
  filter: ''
}
