/* eslint-disable react/prop-types */
import Select from '@mui/material/Select'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'
import { FormControl, InputLabel, MenuItem } from '@mui/material'

export default function SnmpCommand (props) {
  const [state, setArgs] = useState({ downloads: [], arguments: {} })
  const setProp = props.setst

  const setval = (name) => async function (x) {
    if (x.target.id !== undefined) {
      if (!props.ips.some(y => y.name === x.target.id)) {
        await props.setIps([...props.ips, { key: props.ips.length + 1, name: x.target.id, value: x.target.value }])
      } else {
        const ipList = [...props.ips]
        const itemIndex = ipList.findIndex(object => { return object.name === x.target.id })
        ipList[itemIndex].value = x.target.value
        await props.setIps(ipList)
      }
    }
    state.arguments[name] = x.target.value
    setArgs(state)
    setProp(props.id, state)
  }

  if (Object.keys(props.st).length > 0) {
    if (props.st !== state) {
      setArgs(props.st)
    }
  }

  const getval = (name) => {
    return state.arguments[name]
  }

  return (
        <Grid container direction='row' >
            <Grid item xs={4.5}/>
            <Grid item sx={{ marginBottom: 1 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="device-type-label">Type</InputLabel>
                    <Select
                    labelId="device-type-label"
                    id="device-type"
                    value={getval('DeviceType')}
                    onChange={setval('DeviceType')}
                    sx={{ marginRight: 2 }}
                    label="Type"
                    autoWidth
                    >
                <MenuItem value={'Printer'}>Toshiba POS Printer</MenuItem>
                <MenuItem value={'Scale'}>Hobert Scale</MenuItem>
                <MenuItem value={'Ups'}>Spectra UPS</MenuItem>
                    </Select>
                </FormControl>

            <TextField defaultValue={getval('ipaddress')} onBlur={setval('ipaddress')} label="IP Address" required variant="outlined" sx={{ marginRight: 2 }}/>
            </Grid>
            <Button variant="contained" sx={{ width: 170, height: 55 }} endIcon={<RemoveDoneIcon />} onClick={() => props.onRemove(props.id)} > Remove Task </Button>
        </Grid>

  )
}
