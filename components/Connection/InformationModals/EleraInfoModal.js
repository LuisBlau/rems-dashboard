/* eslint-disable react/prop-types */
import { Grid, Paper, styled, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import React from 'react'
import { Container } from '@mui/system'
import { PointOfSale } from '@mui/icons-material'
import { Popup } from 'semantic-ui-react'

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

export default function EleraInfoModal ({ modalData, eleraModalOpen, handleEleraModalClose, handleEleraModalOpen }) {
  const eleraServices = []
  if (modalData.EleraServices) {
    const newObj = JSON.parse(Object.values(modalData.EleraServices)[0])
    for (let i = 0; i < newObj.containers[0].services.length; i++) {
      eleraServices.push(Object.keys(newObj.containers[0].services[i])[0])
    }
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

  if (modalData.EleraServices) {
    return (
      <Grid item xs={12}>
        <Popup content="Elera Service Information" trigger={
          <PointOfSale style={{ color: '#484848' }} cursor='pointer' onClick={handleEleraModalOpen}/>
        }/>
        <Modal
          open={eleraModalOpen}
          onClose={handleEleraModalClose}
          aria-labelledby="modal-modal-title"
        >
          <Box sx={style}>
            <Typography marginBottom={3} fontWeight={'Bold'} fontSize={'h6.fontSize'}>
              Elera Services - {JSON.parse(Object.values(modalData.EleraServices)[0]).containers[0].status} - Last Updated: {new Date(JSON.parse(Object.values(modalData.EleraServices)[0]).containers[0].lastModifiedTimestamp).toDateString()}
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
