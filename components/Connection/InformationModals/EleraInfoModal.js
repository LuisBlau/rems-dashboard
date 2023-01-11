/* eslint-disable react/prop-types */
import { Grid, IconButton, Paper, styled, Tooltip, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import React from 'react'
import { Container } from '@mui/system'
import { PointOfSale } from '@mui/icons-material'

const PREFIX = 'OverviewAgentPaper'
const classes = {
  barHeight: `${PREFIX}-barHeight`,
  paper: `${PREFIX}-paper`
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
// eslint-disable-next-line no-unused-vars
const Root = styled('main')((
  {
    theme
  }
) => ({
  [`& .${classes.barHeight}`]: {
    height: 50
  },
  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  }
}))

export default function EleraInfoModal ({ modalData, eleraModalOpen, eleraServicesAvailable, setEleraServicesAvailable, handleEleraModalClose, handleEleraModalOpen }) {
  const eleraServices = []
  let eleraServicesList = []
  let eleraServiceStatus = ''
  let lastModifiedTimestamp = ''
  if (modalData.EleraServices) {
    const eleraServiceProp = JSON.parse(Object.values(modalData.EleraServices)[0])

    // Search for 3 particular properties within the eleraServiceProp array
    // Grab the first occurrence of each
    for (let i = 0; i < eleraServiceProp.length; i++) {
      if (eleraServiceProp[i].name === 'services') {
        eleraServicesList = eleraServiceProp[i].value
      } else if (eleraServiceProp[i].name === 'status') {
        eleraServiceStatus = eleraServiceProp[i].value
      } else if (eleraServiceProp[i].name === 'lastModifiedTimestamp') {
        lastModifiedTimestamp = eleraServiceProp[i].value
      }
    }

    for (let i = 0; i < eleraServicesList.length; i++) {
      eleraServices.push(Object.keys(eleraServicesList[i])[0])
    }
  }

  if (eleraServices.length > 0) {
    setEleraServicesAvailable(true)
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 1000,
    height: 600,
    bgcolor: '#ffffff',
    border: '2px solid #000',
    outline: '#7c70b3',
    boxShadow: 24,
    p: 4,
    flexDirection: 'column'
  }

  if (eleraServicesAvailable) {
    return (
      <Grid item xs={12}>
        <Tooltip arrow title="Elera Service Information">
          <IconButton>
            <PointOfSale style={{ color: '#484848' }} cursor={'pointer'} onClick={handleEleraModalOpen} />
          </IconButton>
        </Tooltip>
        <Modal
          open={eleraModalOpen}
          onClose={handleEleraModalClose}
          aria-labelledby="modal-modal-title"
        >
          <Box sx={style}>
            <Typography marginBottom={3} fontWeight={'Bold'} fontSize={'h6.fontSize'}>
              Elera Services - {eleraServiceStatus} - Last Updated: {new Date(lastModifiedTimestamp).toDateString()}
            </Typography>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                {eleraServices
                  .map((service, index) => (
                    <Grid key={index} item xs={3}>
                      <Paper className={classes.paper}>
                        <Typography>
                          {service}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
              <Box pt={4}>
              </Box>
            </Container>
          </Box>
        </Modal>
      </Grid>
    )
  } else {
    return null
  }
}
