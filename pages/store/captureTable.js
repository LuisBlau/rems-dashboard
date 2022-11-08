/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles'
import React from 'react'
import Container from '@mui/material/Container'
import CaptureGrid from '../../components/CaptureGrid'
import Typography from '@mui/material/Typography'

const PREFIX = 'captureTable'

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

export default function DocCollectionComponent () {
  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer}/>
      <Typography align="center" variant="h3">Data Captures</Typography>
      <Container maxWidth="xl" className={classes.container}>
      <CaptureGrid/>
      </Container>
    </Root>
  )
}
