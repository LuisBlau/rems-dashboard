import { styled } from '@mui/material/styles'
import React from 'react'
import Container from '@mui/material/Container'
import ExtractRequestGrid from '../../components/ExtractRequestGrid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import axios from 'axios'
import Cookies from 'universal-cookie'
const PREFIX = 'dumpTable'

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
    paddingBottom: 4
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
  },
  [`& .${classes.triggerButton}`]: {
    float: 'right',
    padding: '10px'
  }
}))

export default function DataCaptureComponent () {
  const cookies = new Cookies()
  const retailerId = cookies.get('retailerId')
  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Typography align="center" variant="h3">Trigger Data Capture</Typography>
      <Button
        style={{ float: 'right', marginRight: 60, padding: 10 }}
        variant="contained"
        onClick={() => { axios.post('/api/registers/requestRemsDump', { retailer: retailerId, dataCapture: 'REMS' }) }}
      >Create Rems Data Capture
      </Button>
      <div className={classes.appBarSpacer} />
      <Container className={classes.container}>
        <ExtractRequestGrid />
      </Container>
    </Root>
  )
}
