/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Copyright from '../../src/Copyright'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import useSWR from 'swr'
import fetcher from '../../lib/lib.js'
import TextField from '@mui/material/TextField'
import VpdPaper from '../../components/VPD/VpdPaper'
const PREFIX = 'vpdOverview'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
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

export default function ConnectionOverview () {
  const [filterText, setFilterText] = useState('')

  const { data, error } = useSWR(
    '/REMS/vpd',
    fetcher
  )
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={8} />
          <Grid item xs={4}>
            <TextField
              id="outlined-basic"
              label="Filter"
              variant="outlined"
              onChange={(event) => setFilterText(event.target.value)}
            />
          </Grid>
          {data
            .filter((controller) =>
              (controller.store + '-' + controller.register).includes(filterText.toLowerCase())
            ).map((controller) => (
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <VpdPaper key={controller.id} data={controller} />
                </Paper>
              </Grid>
            ))}
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    </Root>
  )
}
