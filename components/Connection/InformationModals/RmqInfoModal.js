/* eslint-disable react/prop-types */
import { Grid, Paper, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import React from 'react'
import { Container } from '@mui/system'
import { Popup, Icon } from 'semantic-ui-react'

const bytesPerMegabyte = 1048576
const PREFIX = 'OverviewAgentPaper'
const classes = {
  barHeight: `${PREFIX}-barHeight`,
  paper: `${PREFIX}-paper`
}

export default function RmqInfoModal ({ modalData, rmqModalOpen, handleRmqModalOpen, handleRmqModalClose, prettifyTime }) {
  const rows = []

  if (modalData) {
    if (modalData.RMQ) {
      const rmqInfo = JSON.parse(Object.values(modalData.RMQ)[0])
      if (rmqInfo.messageStats) {
        const messageStats = rmqInfo.messageStats.properties
        rows.push('Published Messages: ' + messageStats.publish)
        rows.push('Drop Unroutable: ' + messageStats.drop_unroutable)
      }
      if (rmqInfo.objectTotals) {
        const objectTotals = rmqInfo.objectTotals.properties
        rows.push('Total Queues: ' + objectTotals.queues)
        rows.push('Total Consumers: ' + objectTotals.consumers)
        rows.push('Total Connections: ' + objectTotals.connections)
      }
      if (rmqInfo.queueTotals) {
        const queueTotals = rmqInfo.queueTotals.properties
        rows.push('Total Messages: ' + queueTotals.messages)
      }
      if (rmqInfo.nodeStats[0]) {
        const nodeStats = rmqInfo.nodeStats[0].properties
        rows.push('Memory Used: ' + Math.trunc(nodeStats.mem_used / bytesPerMegabyte) + 'mb')
        rows.push('Proc Total: ' + (nodeStats.proc_used / nodeStats.proc_total * 100).toFixed(2) + '%')
        rows.push('Sockets Used: ' + nodeStats.sockets_used)
        rows.push('FD Used: ' + nodeStats.fd_used)
        rows.push('Uptime: ' + prettifyTime(nodeStats.uptime / 1000))
      }
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
    height: 250,
    bgcolor: '#ffffff',
    border: '2px solid #000',
    outline: '#7c70b3',
    boxShadow: 24,
    p: 4,
    flexDirection: 'column'
  }

  if (rows.length > 0) {
    return (
        <Grid item xs={12}>
          <Popup content="Rabbit MQ Information" trigger={
            <Icon style={{ color: '#484848', cursor: 'pointer' }} size='large' name='computer' onClick={handleRmqModalOpen}/>
          }/>
          <Modal
            open={rmqModalOpen}
            onClose={handleRmqModalClose}
            aria-labelledby="modal-modal-title"
          >
            <Box sx={style}>
              <Typography marginBottom={3} fontWeight={'Bold'} fontSize={'h6.fontSize'}>
                Rabbit MQ Information
              </Typography>
              <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                  {rows
                    .map((data, index) => (
                      <Grid key={index} item xs={3}>
                        <Paper className={classes.paper}>
                          <Typography>
                            {data}
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
