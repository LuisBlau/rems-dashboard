/* eslint-disable react/prop-types */
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
import { FormControl, FormControlLabel, InputLabel, OutlinedInput, Paper } from '@mui/material'
import Papa from 'papaparse'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import AgentSelectFilter from '../components/PageFilterComponents/AgentSelectFilter'
import _ from 'lodash'

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

const storeInformation = {
  _id: '',
  id: '',
  retailer_id: '',
  list_name: '',
  agents: []
}

export default function AgentSelect () {
  // a top-level list of all retailer's agents, used to filter down and show left side available stuff
  const [availableAgents, setAvailableAgents] = useState([])
  // list of selected items (in the right side of the screen)
  const [selectedAgents, setSelectedAgents] = useState([])

  // filter state variables
  const [selectedVersion, setSelectedVersion] = useState()
  const [storeOnlyView, setStoreOnlyView] = useState(true)
  const [versionData, setVersionData] = useState([])

  const [existingLists, setExistingLists] = useState([])
  const [selectedExistingList, setSelectedExistingList] = useState([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('No Agents Selected!')
  const [newStoreList, setnewStoreList] = useState(false)
  const [listName, setListName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const allowedExtensions = ['csv', 'plain']
  const [chooseFileDisabler, setChooseFileDisabler] = useState(true)
  const [selectedAgentsNames, setSelectedAgentsNames] = useState([])

  function getStringBetween (str, start, end) {
    const result = str.match(new RegExp(start + '(.*)' + end))
    return result[1]
  }

  function handleSelectedVersionChanged (version, setSelectedVersion) {
    setSelectedVersion(version)
  }

  // do once on page load
  useEffect(() => {
    // gets list of distributions
    axios.get('/api/REMS/store-list').then((resp) => setExistingLists(resp.data))

    // gets versions of software(s) associated with agents that are assigned to the selected retailer
    axios.get('/api/registers/versions').then(function (res) {
      const data = []
      for (const soft of Object.keys(res.data)) {
        const entry = { children: [], label: soft, value: soft }
        for (const ver of res.data[soft]) {
          entry.children.push({ label: ver, value: 'agentSelectSoftware: ' + soft + ' agentSelectVersion: ' + ver })
        }
        data.push(entry)
      }
      setVersionData(data)
    })

    // gets all agents for the selected retailer
    axios.get('/api/REMS/agents').then(function (res) {
      const data = []
      res.data.forEach(item => {
        // only add them if they aren't already in the list (applicable in store-only view, so we don't get duplicates)
        if (availableAgents.find(x => x.agentName === item.agentName && x.storeName === item.storeName) === undefined) {
          data.push({ isChecked: false, agent: item, storeName: item.storeName })
        }
      })
      setAvailableAgents(data)
    })
  }, [])

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
  function handleStoreOnlyViewSwitch () {
    setSelectedAgents([])
    setSelectedExistingList([])
    setStoreOnlyView(!storeOnlyView)
  }

  function storeViewFilterArray () {
    if (storeOnlyView) {
      return _.uniqBy(availableAgents, 'storeName')
    } else {
      return availableAgents
    }
  }

  useEffect(() => {
    const agentNamesArray = []
    selectedAgents.forEach(agent => {
      agentNamesArray.push(agent.agent.agentName)
    })
    setSelectedAgentsNames(agentNamesArray)
  }, [selectedAgents])

  function filterBySelectedVersion () {
    const preFilteredData = storeViewFilterArray()

    // check if a version was selected, otherwise default to _all_ versions of the selected software
    if (selectedVersion !== undefined && selectedVersion !== null) {
      if (selectedVersion.includes('agentSelectVersion: ')) {
        const parsedSoftware = getStringBetween(selectedVersion, 'agentSelectSoftware: ', ' agentSelectVersion:')
        const parsedVersion = getStringBetween(selectedVersion, 'agentSelectVersion: ', '')

        const filteredAgentData = []
        for (let i = 0; i < preFilteredData.length; i++) {
          if (preFilteredData[i].agent.versions) {
            for (let j = 0; j < _.size(preFilteredData[i].agent.versions); j++) {
              // check if any of the versions for that agent match the selected software/version combo
              if (Object.keys(preFilteredData[i].agent.versions[j])[0] === parsedSoftware &&
                Object.values(preFilteredData[i].agent.versions[j])[0] === parsedVersion) {
                // Add them to the filtered array
                filteredAgentData.push(preFilteredData[i])
              }
            }
          }
        }
        return filteredAgentData
      } else {
        const filteredAgentData = []
        for (let i = 0; i < preFilteredData.length; i++) {
          if (preFilteredData[i].agent.versions) {
            for (let j = 0; j < _.size(preFilteredData[i].agent.versions); j++) {
              if (Object.keys(preFilteredData[i].agent.versions[j])[0] === selectedVersion) {
                filteredAgentData.push(preFilteredData[i])
              }
            }
          }
        }
        return filteredAgentData
      }
    } else {
      return preFilteredData
    }
  }

  const onFileUpload = () => {
    // If user clicks the parse button without a file we show a error
    if (!selectedFile) return setToast('Enter a valid file')
    setStoreOnlyView(true)

    const fileExtension = selectedFile?.type.split('/')[1]

    // Initialize a reader which allows user to read any file or blob.
    const reader = new FileReader()

    // Event listener on reader when the file loads, we parse it and set the data.
    let storeList = []
    if (fileExtension === 'csv') {
      reader.onload = async ({ target }) => {
        Papa.parse(target.result, {
          header: false,
          skipEmptyLines: true,
          complete: function (results) {
            results.data.map(x => storeList.push(x[0]))
          }
        })

        const importListAgents = []
        storeList.forEach(val => {
          const filteredAgents = _.filter(availableAgents, { storeName: val })
          filteredAgents.forEach(agent => {
            importListAgents.push(agent)
          })
        })
        setSelectedAgents(_.concat(selectedAgents, _.filter(importListAgents, i => !_.includes(selectedAgents, i))))
      }
    } else {
      reader.onload = async (e) => {
        const text = (e.target.result)
        storeList = text.split(/\r?\n/)

        const importListAgents = []
        storeList.forEach(val => {
          importListAgents.push(_.find(availableAgents, val))
        })
        setSelectedAgents(_.concat(selectedAgents, _.filter(importListAgents, i => !_.includes(selectedAgents, i))))
      }
    }

    reader.readAsText(selectedFile)
  }

  const setSelectedList = (e) => {
    const agents = _.filter(existingLists, { list_name: e.target.value })[0].agents
    setSelectedExistingList(_.filter(existingLists, { list_name: e.target.value })[0])
    const listToSetSelected = []
    agents.forEach(agent => {
      // find the agent in the available agents and shuttle it right
      if (agent.indexOf(':') > -1) {
        setStoreOnlyView(false)
        const agentName = agent.substr(agent.indexOf(':') + 1, _.size(agent))
        listToSetSelected.push(_.filter(availableAgents, _.matches({ agent: { agentName } }))[0])
      } else {
        setStoreOnlyView(true)
        const agents = _.filter(availableAgents, _.matches({ storeName: agent }))
        agents.forEach(agent => {
          listToSetSelected.push(agent)
        })
      }
    })
    setSelectedAgents(listToSetSelected)
    setChooseFileDisabler(false)
  }

  const handleListName = (e) => {
    setListName(e.target.value)
  }

  // handles toggling values in list(s) from checked to unchecked and vice versa
  const handleToggle = (item, listName) => () => {
    if (!storeOnlyView) {
      if (listName === 'Existing Systems') {
        const index = _.findIndex(availableAgents, item)
        const items = [...availableAgents]
        items[index] = { ...item, isChecked: !item.isChecked }
        setAvailableAgents(items)
      } else {
        const index = _.findIndex(selectedAgents, item)
        const items = [...selectedAgents]
        items[index] = { ...item, isChecked: !item.isChecked }
        setSelectedAgents(items)
      }
    } else {
      if (listName === 'Existing Systems') {
        const items = [...availableAgents]

        const checkedAgent = _.find(availableAgents, { agent: { agentName: item.agent.agentName } })
        const checkedStore = checkedAgent.storeName
        const indices = _.keys(_.pickBy(items, { storeName: checkedStore }))
        indices.forEach(index => {
          const currentItem = items[index]
          items[index] = { ...currentItem, isChecked: !item.isChecked }
        })
        setAvailableAgents(items)
      } else {
        const items = [...selectedAgents]

        const checkedAgent = _.find(selectedAgents, { agent: { agentName: item.agent.agentName } })
        const checkedStore = checkedAgent.storeName
        const indices = _.keys(_.pickBy(items, { storeName: checkedStore }))
        indices.forEach(index => {
          const currentItem = items[index]
          items[index] = { ...currentItem, isChecked: !item.isChecked }
        })
        setSelectedAgents(items)
      }
    }
  }

  // gathers number of checked items in list(s) to provide a x/y selected label to the lists
  const numberOfChecked = (items) => _.size(_.filter(items, (i) => i.isChecked))

  // sends all items from available list to selected list
  const handleAllRight = () => {
    setSelectedAgents(_.concat(selectedAgents, _.filter(availableAgents, i => !_.includes(selectedAgents, i))))
  }

  // sends checked items from available list to selected list
  const handleCheckedRight = () => {
    const checkedAvailableAgents = []
    availableAgents.forEach(agent => {
      if (agent.isChecked === true) {
        // reset to false check before moving
        agent.isChecked = false
        checkedAvailableAgents.push(agent)
      }
    })

    setSelectedAgents(_.concat(selectedAgents, checkedAvailableAgents))
  }

  // sends checked items from selected list back to available list
  const handleCheckedLeft = () => setSelectedAgents(_.remove(selectedAgents, (a) => !a.isChecked))

  // sends all items from selected to available
  const handleAllLeft = () => setSelectedAgents([])

  const handleCopyToClipboard = (event) => {
    event.preventDefault()

    let agentsText = 'No Agents Selected!!'
    if (selectedAgents && _.size(selectedAgents) > 0) {
      selectedAgents.forEach(agent => {
        agentsText = agent.agent.agentName
        if (!agentsText.includes(agent.agent.agentName)) {
          agentsText += ', ' + agent.agent.agentName
        }
      })
      navigator.clipboard.writeText(agentsText)
    }

    setToast(agentsText)
    setOpen(true)
  }

  const handleSubmit = (event) => {
    if (newStoreList) {
      storeInformation.list_name = listName
    } else {
      for (let i = 0; i < existingLists.length; i++) {
        if (existingLists[i]._id === selectedExistingList._id) {
          storeInformation._id = existingLists[i]._id
          storeInformation.id = existingLists[i].id
          storeInformation.retailer_id = existingLists[i].retailer_id
          storeInformation.list_name = existingLists[i].list_name
          break
        }
      }
    }

    storeInformation.agents = []
    if (!storeOnlyView) {
      selectedAgents.forEach(agent => {
        storeInformation.agents.push(agent.storeName + ':' + agent.agent.agentName)
      })
    } else {
      selectedAgents.forEach(agent => {
        if (!storeInformation.agents.includes(agent.storeName)) {
          storeInformation.agents.push(agent.storeName)
        }
      })
    }

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
    if (!open) {
      window.location.reload(false)
    }
  }

  const handleNewStoreChange = (event) => {
    setnewStoreList(event.target.checked)
    setChooseFileDisabler(!event.target.checked)
  }

  function DistributionListGridItem () {
    if (storeOnlyView) {
      return (
        <Grid item xs={2.5}>{customList('In Distribution List', _.uniqBy(selectedAgents, 'storeName'))}</Grid>
      )
    } else {
      return (
        <Grid item xs={2.5}>{customList('In Distribution List', selectedAgents)}</Grid>
      )
    }
  }

  function CustomListItemDisplayName ({ agent, labelId }) {
    let displayName = ''
    if (storeOnlyView) {
      displayName = agent.storeName
    } else {
      displayName = agent.agent.agentName
    }

    return (
      <ListItemText id={labelId} primary={displayName} />
    )
  }

  const customList = (title, items) => (
    <Card>
      <Divider />
      <CardHeader
        sx={{ px: 2, py: 1 }}
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
          const labelId = `transfer-list-all-item-${value.agent ? value.agent._id : 'empty'}-label`
          return (
            <ListItem
              key={value.agent ? value.agent._id : 'empty'}
              role="listitem"
              button
              onClick={handleToggle(value, title)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={value.isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId
                  }}
                />
              </ListItemIcon>
              <CustomListItemDisplayName labelId={labelId} agent={value} />
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
      <Grid container direction="column" spacing={3} justifyContent="center" alignItems="center">
        <Grid container direction="row" justifyContent="center" marginTop={6}>
          <Grid justifyContent="center" flexBasis={'33%'} maxWidth={'33%'} item >
            <Paper sx={{ width: 400, marginLeft: 12 }} elevation={5} className={classes.paper} >
              <FormControlLabel
                checked={newStoreList}
                onChange={handleNewStoreChange}
                control={<Checkbox />}
                label="Create New List" />
              <TextField label="List Name" variant="standard" onChange={handleListName} value={listName} disabled={!newStoreList} />
            </Paper>
          </Grid>
          <Grid margin={2} flexBasis={'33%'} maxWidth={'33%'} item >
            <FormControl sx={{ minWidth: 400, marginLeft: 10 }}>
              <InputLabel sx={{ width: 200 }} id="list-label">Update Existing Lists</InputLabel>
              <Select
                defaultValue=''
                labelId="list-label"
                id="existing-list-selector"
                label="Update Existing Lists"
                onChange={setSelectedList}
                input={<OutlinedInput label="Update Existing Lists" />}
              >
                {existingLists.map((i, index) => <MenuItem key={index} value={i.list_name}>{i.list_name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid flexBasis={'33%'} maxWidth={'33%'} item xs={3.5}>
            <AgentSelectFilter
              handleStoreOnlyViewSwitch={handleStoreOnlyViewSwitch}
              storeOnlyView={storeOnlyView}
              selectedVersion={selectedVersion}
              setSelectedVersion={setSelectedVersion}
              versionData={versionData}
              handleSelectedVersionChanged={handleSelectedVersionChanged} />
          </Grid>
        </Grid>

        <Grid item sx={{ margin: 3 }} >
          <Box >
            <label htmlFor="contained-button-file">
              <Input accept="*" id="contained-button-file" multiple type="file" onChange={onFileChange} />
              <Button
                disabled={chooseFileDisabler}
                variant="contained" color="secondary"
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
        <Grid container align="center" spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={2.5}>{customList('Existing Systems', _.filter(filterBySelectedVersion(), i => !_.includes(selectedAgentsNames, i.agent.agentName)))}</Grid>
          <Grid item xs={1}>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 10 }}
                variant="outlined"
                size="small"
                onClick={handleAllRight}
                disabled={availableAgents.length === 0}
                aria-label="move all right"
              >
                ≫
              </Button>

              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={numberOfChecked(availableAgents) === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedLeft}
                disabled={numberOfChecked(selectedAgents) === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>

              <Button
                sx={{ my: 10 }}
                variant="outlined"
                size="small"
                onClick={handleAllLeft}
                disabled={selectedAgents.length === 0}
                aria-label="move all left"
              >
                ≪
              </Button>
            </Grid>
          </Grid>
          <DistributionListGridItem />
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
