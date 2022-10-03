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
import OverviewAgentPaper from '../../components/Connection/OverviewAgentPaper'
import Typography from '@mui/material/Typography'
const PREFIX = 'agentOverview'

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
    paddingTop: 80
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

export default function AgentOverview (props) {
  let par = ''
  if (typeof window !== 'undefined') {
    par = window.location.search
  }
  const params = new URLSearchParams(par)
  const [filterText, setFilterText] = useState('')
  const { data, error } = useSWR('/REMS/agents?store=' + params.get('store'), fetcher)

  if (error) return <Root> <div className={classes.appBarSpacer} /><div>failed to load</div></Root>
  if (!data) return <Root> <div className={classes.appBarSpacer} /><div>loading...</div></Root>

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid item xs={8.5}>
            <Typography align="center" variant="h4">Store Overview</Typography>
            <Typography align="center" variant="h6">Store: {params.get('store')}</Typography>
          </Grid>
        </Container>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {data
              .filter((agent) =>
                (agent.agentName).includes(filterText.toLowerCase())
              )
              .map((agent, index) => (
                <Grid key={index} item xs={3}>
                  <Paper className={classes.paper}>
                    <OverviewAgentPaper data={agent} />
                  </Paper>
                </Grid>
              ))}
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </Container>
    </Root>
  )
}
