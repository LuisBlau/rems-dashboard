/* eslint-disable no-sequences */
/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DateTimePicker from '@mui/lab/DateTimePicker'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Copyright from '../src/Copyright'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import InputLabel from '@mui/material/InputLabel'
import axios from 'axios'
import { FormControl } from '@mui/material'

/// Number of millisec to show Successful toast. Page will reload 1/2 second before to clear it.
const Success_Toast = 1500
/// Number of millisec to show Failure toast. Page does not reload after.
const Fail_Toast = 8000

const PREFIX = 'deploySchedule'

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
    paddingTop: 50
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

const uiWidth = 600

const formValues = {
  name: '',
  id: '',
  storeList: '',
  dateTime: ''
}

export default function deployScheule () {
  const [_formValues, setFormValues] = useState(formValues)
  const [_package, setPackage] = useState(null)
  const [_storeList, setStoreList] = useState(null)
  const [_listNames, setListNames] = useState('')
  const [_dateTime, setDateTime] = useState(new Date())
  const [_options, setOptions] = useState([])

  const [openSuccess, setOpenSuccess] = useState(false)
  const [toastSuccess, setToastSuccess] = useState('')

  const [openFailure, setOpenFailure] = useState(false)
  const [toastFailure, setToastFailure] = useState('')

  const [storeFilterNames, setStoreFilterNames] = React.useState([])
  const [storeNames, setStoreNames] = React.useState([])

  const [storeSelected, setStoreSelected] = useState(false)
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  useEffect(() => {
    setStoreNames([])

    axios.get('/api/REMS/deploy-configs').then(function (res) {
      console.log('axios response', res)
      const packages = []
      res.data.forEach(v => {
        packages.push({ label: v.name, id: v.id })
      })
      setOptions(packages)
    })

    axios.get('/api/REMS/store-list').then((resp) => {
      console.log('Store-list response', resp)
      const sNames = []
      resp.data.forEach(v => {
        sNames.push(v.list_name)
      })
      setStoreNames(sNames)
    })
  }, []) // Second opption [] means only run effect on the first render

  const changeStoreFilter = (event) => {
    const {
      target: { value }
    } = event
    setStoreFilterNames(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )

    console.log(value)
    if (value.length) {
      setStoreSelected(true)
      setListNames(String(value))
    } else {
      console.log('in else')
      setStoreSelected(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    formValues.name = _package.label,
    formValues.id = _package.id,
    formValues.storeList = _storeList,
    formValues.listNames = _listNames,
    // Don't adjust for users time zone i.e we are always in store time.
    // en-ZA puts the date in the design doc format except for an extra comma.
    formValues.dateTime = new Date(_dateTime).toLocaleString('en-ZA', { hourCycle: 'h24' }).replace(',', '').replace(' 24:', ' 00:')

    setFormValues(formValues)

    axios.post('/api/deploy-schedule', _formValues)
      .then(function (response) {
        if (response.data.message !== 'Success') {
          setToastFailure(response.data)
          setOpenFailure(true)
        } else {
          setToastSuccess('Deploy-Config Scheduled')
          setOpenSuccess(true)
        }
      })
      .catch(function (error) {
        setToastFailure(error.message)
        setOpenFailure(true)
      })
  }

  return (
    <Root className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container} >
        <Typography marginBottom={3} align='center' variant="h3">Schedule a Deployment</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ alignItems: 'center' }} >
            <Autocomplete
              id="select-package"
              value={_package}
              onChange={(event, newValue) => {
                setPackage(newValue)
              }}
              options={_options}
              noOptionsText="Error Loading Package List"
              renderInput={(params) => (
                <TextField
                  sx={{ width: uiWidth }}
                  {...params}
                  label="Deploy-Config to Schedule"
                  InputProps={{ ...params.InputProps, type: 'search' }}
                  required={true} />
              )}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel sx={{ width: 200 }} id="distro-list-label">Distribution List</InputLabel>
              <Select
                labelId="distro-list-label"
                id="distro-list"
                multiple
                value={storeFilterNames}
                onChange={changeStoreFilter}
                input={<OutlinedInput label="Distribution List" />}
                renderValue={(selected) => selected.join(', ')}
                sx={{ minWidth: 600 }}
                MenuProps={MenuProps}
                label="Distribution List"
              >
                {storeNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={storeFilterNames.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* for handler to work 'name' has to match the formsValue member */}
            <TextField
              id="storeList-input"
              multiline
              rows={5}
              sx={{ width: uiWidth, height: '100%' }}
              label="Store List"
              name="storeList"
              onChange={(event) => {
                setStoreList(event.target.value)
              }}
              required={!storeSelected}
              disabled={storeSelected}
              helperText='example store list: 0001:0001-CC, 0500:0500-CC, 0100:0100-CC, 02000:02000-CC, 0123:0123-CC'
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                id="date-time-local"
                disablePast
                label="Apply Time"
                renderInput={(params) => <TextField {...params} helperText="Store Time Zone" />}
                value={_dateTime}
                onChange={(newValue) => {
                  setDateTime(newValue)
                }}
              />
            </LocalizationProvider>

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Stack>
        </form>
        <Box pt={4}>
          <Copyright />
        </Box>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSuccess}
          autoHideDuration={Success_Toast}
          onClose={(event) => { setOpenSuccess(false) }}>
          <Alert variant="filled" severity="success">
            <AlertTitle>Success!</AlertTitle>
            {toastSuccess}
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openFailure}
          autoHideDuration={Fail_Toast}
          onClose={(event) => { setOpenFailure(false) }}>
          <Alert variant="filled" severity="error">
            <AlertTitle>Error!!!</AlertTitle>
            {toastFailure}
          </Alert>
        </Snackbar>

      </Container>
    </Root>
  )
}
