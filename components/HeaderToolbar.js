/* eslint-disable react/prop-types */
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { Badge, Button, IconButton, MenuItem, Select, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import React, { useContext, useEffect, useState } from 'react'
import MuiAppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
import UserContext from '../pages/UserContext'
import axios from 'axios'
import Cookies from 'universal-cookie'

function SignInButton () {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal()
  return <Button variant="contained" onClick={() => signInClickHandler(instance)}>Sign In</Button>
}

function SignOutButton () {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal()

  return <Button variant="contained" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: '/' })}>Sign Out</Button>
}

function signInClickHandler (instance) {
  console.log('signIn redirect with scope')
  instance.loginRedirect({ scopes: ['openid', 'email', 'profile'] })
}

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

// TODO: consider passing retailer details from parent component (instead of ids) and eliminate a lot of the looping done here to clean up
export default function HeaderToolbar ({ open, ids, handleDrawerOpen }) {
  const [retailerDetails, setRetailerDetails] = useState([])
  const [selectedRetailer, setSelectedRetailer] = useState('')

  const cookies = new Cookies()

  const handleSelectedRetailerChanged = (e) => {
    if (e.target) {
      cookies.set('retailerId', e.target.value, { path: '/' })
      setSelectedRetailer(e.target.value)
    } else {
      cookies.set('retailerId', e, { path: '/' })
      setSelectedRetailer(e)
    }
    location.replace('/')
  }

  const context = useContext(UserContext)
  let availableRetailerIds = []
  const [availableRetailers, setAvailableRetailers] = useState([])
  if (context) {
    if (context.userRetailers) {
      if (context.userRetailers.includes('All')) {
        availableRetailerIds = ids
        // Remove 'All' from the retailers list for dropdown
        // If user has 'All' in their retailers list, they get access to ALL retailers
      } else {
        // Otherwise, they only get access to their assigned retailer(s)
        for (let i = 0; i < context.userRetailers.length; i++) {
          context.userRetailers[i] = (context.userRetailers[i]).toUpperCase()
        }
        availableRetailerIds = context.userRetailers
      }
      if (selectedRetailer.length === 0) {
        // If there isn't a currently selected, default to the user's first retailer
        handleSelectedRetailerChanged((availableRetailerIds[0]).toUpperCase())
      }
    }
    if (availableRetailers.length === 0) {
      for (let i = 0; i < availableRetailerIds.length; i++) {
        // grab the id, match it to an object in the retailerDetails array of objects, push to available retailers array used in rendering
        const obj = retailerDetails.find(x => x.retailer_id === availableRetailerIds[i])
        if (obj) {
          setAvailableRetailers(availableRetailers => [...availableRetailers, { retailer_id: obj.retailer_id, description: obj.description }])
        }
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      async function getRetailerDetails (ids) {
        const allRetailerDetails = []
        for (let i = 0; i < ids.length; i++) {
          const u = await axios.get('/api/REMS/getRetailerDetails?id=' + ids[i]).then(resp => resp.data || null)
          allRetailerDetails.push(u)
        }
        return allRetailerDetails
      }
      if (retailerDetails.length === 0) {
        setRetailerDetails(await getRetailerDetails(ids))
      }

      if (cookies.get('retailerId') === '' && context.userRetailers.length !== 0) {
        let retailer = context.userRetailers[0]
        retailer = String(retailer)
        retailer = retailer.toUpperCase()
        cookies.set('retailerId', retailer, { path: '/' })
      }

      if (selectedRetailer === '' && cookies.get('retailerId') !== undefined) {
        setSelectedRetailer(cookies.get('retailerId'))
      }
    }
    fetchData()
  }, [retailerDetails, setRetailerDetails])
  if (availableRetailers.length > 0 || context === undefined) {
    return (
      <AppBar position="absolute" open={open} >
        <Toolbar>
          <AuthenticatedTemplate>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' })
              }} >
              <MenuIcon />
            </IconButton>
          </AuthenticatedTemplate>
          <IconButton >
            <Badge badgeContent={0} >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Typography
            component="div"
            variant="h6"
            paddingLeft={1}
            noWrap style={{ flex: 1 }} >
            Dashboard
          </Typography>
          <IconButton >
            <Badge badgeContent={0} >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <AuthenticatedTemplate >
            <Select
              labelId="retailer-select-label"
              id="retailer-select"
              value={selectedRetailer}
              onChange={handleSelectedRetailerChanged}
              sx={{ color: '#e4e4e4', height: 40, margin: 1 }}>
              {availableRetailers.map((retailer, index) => <MenuItem key={index} sx={{ mt: 1 }} value={retailer.retailer_id}>{retailer.description}</MenuItem>)}
            </Select>
            <SignOutButton />
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <SignInButton />
          </UnauthenticatedTemplate>
        </Toolbar>
      </AppBar>
    )
  } else {
    return null
  }
}
