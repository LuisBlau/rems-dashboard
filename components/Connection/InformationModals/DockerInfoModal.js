/* eslint-disable react/prop-types */
import { Grid, IconButton, Tooltip, Typography } from '@mui/material'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import React from 'react'
import DockerModalTable from './Tables/DockerModalTable'
import { DirectionsBoat } from '@mui/icons-material'

const bytesPerMegabyte = 1048576

export default function DockerInfoModal ({ modalData, dockerModalOpen, handleDockerModalOpen, handleDockerModalClose }) {
  const rows = []
  function objectifyRow (name, command, state, cpu, image, memory) {
    return { name, command, state, cpu, image, memory }
  }

  if (modalData) {
    if (modalData.docker) {
      const arr = Object.values(modalData.docker)
      for (let i = 0; i < arr.length; i++) {
        arr[i] = JSON.parse(arr[i])
        arr[i].Command = ((arr[i].Command).split('docker-entrypoint.sh').pop()).substring(0, 30)
        arr[i].Names = (arr[i].Names).replace(/\/|\[|\]/g, '')
        rows.push(objectifyRow(arr[i].Names, arr[i].Command, arr[i].State, arr[i].CPUUsage, arr[i].Image, Math.trunc(arr[i].MemoryUsage / bytesPerMegabyte) + 'mb'))
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
    height: 400,
    bgcolor: '#ffffff',
    border: '2px solid #000',
    outline: '#7c70b3',
    boxShadow: 24,
    p: 4,
    flexDirection: 'column'
  }

  if (modalData.docker) {
    return (
        <Grid item xs={12}>
          <Tooltip arrow title="Docker Information">
            <IconButton>
              <DirectionsBoat style={{ color: '#484848' }} cursor={'pointer'} onClick={handleDockerModalOpen} />
            </IconButton>
          </Tooltip>
          <Modal
            open={dockerModalOpen}
            onClose={handleDockerModalClose}
            aria-labelledby="modal-modal-title"
          >
            <Box sx={style}>
              <Typography fontWeight={'Bold'} fontSize={'h6.fontSize'}>
                Docker Information
              </Typography>
              <DockerModalTable rows={rows} />
            </Box>
          </Modal>
        </Grid>
    )
  } else {
    return null
  }
}
