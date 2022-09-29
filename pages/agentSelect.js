/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import axios from 'axios'
import Copyright from '../src/Copyright'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { FormControlLabel } from '@mui/material'
import Papa from 'papaparse'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const PREFIX = 'agents'

const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  appBarSpacer: `${PREFIX}-appBarSpacer`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`
}

const Input = styled('input')({
  display: 'none'
})

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

function not (a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection (a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

function union (a, b) {
  return [...a, ...not(b, a)]
}

const storeInformation = {
  _id: '',
  id: '',
  retailer_id: '',
  list_name: '',
  agents: []
}

export default function AgentSelect () {
  const [checked, setChecked] = React.useState([])
  const [left, setLeft] = React.useState([])
  const [right, setRight] = React.useState([])
  const [agents, setAgents] = useState([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('No Agents Selected!')
  const [onlyMasters, setOnlyMasters] = useState(true)
  const [newStoreList, setnewStoreList] = useState(false)
  const [listName, setListName] = useState('')
  const [storeFilter, setStoreFilter] = React.useState(0)
  const [storeFilterItems, setStoreFilterItems] = React.useState([])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const allowedExtensions = ['csv', 'plain']

  const onFileChange = event => {
    const inputFile = event.target.files[0]
    if (inputFile) {
      const fileExtension = inputFile?.type.split('/')[1]

      if (!allowedExtensions.includes(fileExtension)) {
        alert('Please input a csv or txt file')
        return
      }

      setSelectedFile(inputFile)
      setFileName(inputFile.name)
    }
  }

  const onFileUpload = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!selectedFile) return setToast('Enter a valid file')

    const fileExtension = selectedFile?.type.split('/')[1]

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader()

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    let storeList = []
    if (fileExtension === 'csv') {
      reader.onload = async ({ target }) => {
        const csv = Papa.parse(target.result, {
          header: false,
          skipEmptyLines: true,
          complete: function (results) {
            results.data.map(x => storeList.push(x[0]))
          }
        })

        setAgents(agents.concat(storeList))

        const indexArr = []
        let currentLength = agents.length
        storeList.forEach(val => {
          indexArr.push(currentLength++)
        })
        setRight(right.concat(indexArr))
      }
    } else {
      reader.onload = async (e) => {
        const text = (e.target.result)
        storeList = text.split(/\r?\n/)

        setAgents(agents.concat(storeList))
        const indexArr = []
        let currentLength = agents.length
        storeList.forEach(val => {
          indexArr.push(currentLength++)
        })
        setRight(right.concat(indexArr))
      }
    }

    reader.readAsText(selectedFile)
  }

  const changeStoreFilter = (e) => {
    setStoreFilter(e.target.value)
  }

  const handleListName = (e) => {
    setListName(e.target.value)
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleAllRight = () => {
    setRight(right.concat(left))
    // setLeft([]);
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    // setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    // setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const handleAllLeft = () => {
    // setLeft(left.concat(right));
    setRight([])
  }

  const handleCopyToClipboard = (event) => {
    event.preventDefault()

    let agentsText = 'No Agents Selected!!'
    if (right && right.length > 0) {
      agentsText = agents[right[0]]
      right.forEach(val => {
        if (!agentsText.includes(agents[val])) {
          agentsText += ', ' + agents[val]
        }
      })
      navigator.clipboard.writeText(agentsText)
    }

    setToast(agentsText)
    setOpen(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (newStoreList) {
      storeInformation.list_name = listName
    } else {
      for (let i = 0; i < storeFilterItems.length; i++) {
        if (storeFilterItems[i].id === storeFilter) {
          storeInformation._id = storeFilterItems[i]._id
          storeInformation.id = storeFilterItems[i].id
          storeInformation.retailer_id = storeFilterItems[i].retailer_id
          storeInformation.list_name = storeFilterItems[i].list_name
          break
        }
      }
    }

    storeInformation.agents = []
    right.forEach(val => {
      storeInformation.agents.push(agents[val])
    })

    axios.post('/api/REMS/save-store-data', storeInformation)
      .then(function (response) {
        if (response.status !== 200) {
          setToast('Error Saving Store-list!!')
          setOpen(false)
        }
      })
      .catch(function (error) {
        setToast('Error connecting to server!!' + error)
        setOpen(false)
      })

    setToast('Configuration Successfully Saved.')
    setOpen(true)
  }

  const handleMasterChange = (event) => {
    setOnlyMasters(event.target.checked)
  }

  const handleNewStoreChange = (event) => {
    setnewStoreList(event.target.checked)
  }

  useEffect(() => {
    setAgents([])
    setLeft([])
    setRight([])
    setStoreFilterItems([])

    const dbEndpoint = '/api/REMS/agents?onlyMasters=' + onlyMasters
    let _index = -1
    const agents = []

    axios.get(dbEndpoint).then(function (response) {
      const agentsIndex = []
      response.data.forEach(dbItem => {
        let listItem = dbItem.storeName
        if (!onlyMasters) {
          listItem = listItem + ':' + dbItem.agentName
        }

        agents.push(listItem)
        handleToggle(++_index)
        agentsIndex.push(_index)
      })

      // setAgents(agents);
      setLeft(agentsIndex)
    })

    axios.get('/api/REMS/store-list').then((resp) => setStoreFilterItems([{ id: 0, list_name: 'Update Existing List' }].concat(resp.data)))

    if (!newStoreList) {
      const getAgentsDBPoint = '/api/REMS/specific-store-agent-names?storeId=' + storeFilter

      axios.get(getAgentsDBPoint).then(function (response) {
        // var agentsArray = []
        const agentsIndex = []
        // var _index = -1;
        response.data.forEach(dbItem => {
          agents.push(dbItem)
          handleToggle(++_index)
          agentsIndex.push(_index)
        })

        setAgents(agents)
        setRight(agentsIndex)
      })
    }
  }, [onlyMasters, storeFilter])

  const customList = (title, items) => (
        <Card>
            <Divider />
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={
                            numberOfChecked(items) === items.length && items.length !== 0
                        }
                        indeterminate={
                            numberOfChecked(items) !== items.length &&
                            numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                          'aria-label': 'all items selected'
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                  height: 400,
                  overflow: 'auto'
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                  const labelId = `transfer-list-all-item-${value}-label`

                  return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                      'aria-labelledby': labelId
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={agents[value]} />
                        </ListItem>
                  )
                })}
                <ListItem />
            </List>
        </Card>
  )

  return (
        <Root className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Typography marginTop={5} align='center' variant="h3">Distribution Lists</Typography>

            <Grid container direction="column" align="center" spacing={3} justifyContent="center" alignItems="center">

                <Grid item xs={2} sx={{ margin: 3 }}>
                    <Select
                        value={storeFilter}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Type"
                        onChange={changeStoreFilter}
                    >
                        {storeFilterItems.map((i, index) => <MenuItem key={index} value={i.id}>{i.list_name}</MenuItem>)}
                    </Select>
                </Grid>

                <Grid item sx={{ margin: 2 }} >
                    <FormControlLabel
                        checked={newStoreList}
                        onChange={handleNewStoreChange}
                        control={<Checkbox />}
                        label="Create New List" />
                    <TextField label="storeName" variant="standard" onChange={handleListName} value={listName} disabled={!newStoreList} />
                </Grid>

                <Grid item sx={{ margin: 3 }} >
                    <Box >
                        <label htmlFor="contained-button-file">
                            <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
                            <Button variant="contained" color="secondary"
                                component="span"
                                endIcon={< FindInPageIcon />}
                                sx={{ width: 175, height: '100%', margin: 1 }}>
                                Choose File
                            </Button>
                        </label>
                        <TextField disabled label="File Name" value={fileName} />
                        <Button variant="contained" color="primary" disabled={selectedFile == null}
                            onClick={onFileUpload} endIcon={< CloudUploadIcon />}
                            sx={{ width: 175, margin: 1 }}>
                            Upload File
                        </Button>
                    </Box>
                </Grid>

                <Grid item sx={{ margin: 2 }} >
                    <FormControlLabel
                        checked={onlyMasters}
                        onChange={handleMasterChange}
                        control={<Checkbox />}
                        label="Store only view" />
                </Grid>

                <Grid container align="center" spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={2.5}>{customList('Existing Systems', left)}</Grid>
                    <Grid item xs={1}>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 10 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllRight}
                                disabled={left.length === 0}
                                aria-label="move all right"
                            >
                                ≫
                            </Button>

                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>

                            <Button
                                sx={{ my: 10 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllLeft}
                                disabled={right.length === 0}
                                aria-label="move all left"
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={2.5}>{customList('In Distribution List', right)}</Grid>
                </Grid>
                <Grid container align="center" spacing={10} justifyContent="center" alignItems="center">
                    <Grid item sx={{ margin: 2 }}>
                        <Button size="medium" variant="contained" color="primary" type="button" onClick={handleCopyToClipboard} >
                            Copy to clipboard
                        </Button>
                    </Grid>
                    <Grid item sx={{ margin: 2 }}>
                        <Button size="medium" variant="contained" color="primary" type="button" onClick={handleSubmit} >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={6000}
                onClose={(event) => { setOpen(false) }}
                message={toast}
            />
            <Box pt={4}>
                <Copyright />
            </Box>
        </Root>

  )
}
