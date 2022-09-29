/* eslint-disable no-unused-vars */
import useSWR from 'swr'
import { styled } from '@mui/material/styles'
import fetcher from '../../lib/lib'
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import ExtractGrid from '../../components/ExtractGrid'
import Typography from '@mui/material/Typography'

const PREFIX = 'extractTable'

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

export default function ExtractTableComponent () {
  const [filterText, setFilterText] = useState('')

  const { data, error } = useSWR('/REMS/release', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Typography align="center" variant="h3">Chec Extracts</Typography>
      <Container maxWidth="xl" className={classes.container}>
      <ExtractGrid/>
      </Container>
    </Root>
  )
}
