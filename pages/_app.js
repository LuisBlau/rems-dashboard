/* eslint-disable no-undef */
import { EventType, InteractionType } from '@azure/msal-browser'
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { ThemeProvider } from '@emotion/react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import Head from 'next/head'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import HeaderToolbar from '../components/HeaderToolbar'
import SidebarDrawer from '../components/SidebarDrawer'
import fetcher from '../lib/lib.js'
import theme from '../src/theme'
import { msalInstance } from './authConfig'
import { Guard } from '../components/AuthGuard'
import { UserContextProvider } from './UserContext'
import 'semantic-ui-css/semantic.min.css'
import Cookies from 'universal-cookie'

const PREFIX = '_app'

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  MuiAppBar: `${PREFIX}-MuiAppBar`,
  appBarSpacer: `${PREFIX}-appBarSpacer`
}
// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('main')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: 'flex'
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    paddingTop: 50
  },

  [`& .${classes.MuiAppBar}`]: {
    position: 'absolute'
  },

  [`& .${classes.appBarSpacer}`]: {
    paddingTop: 80
  }
}))
export default function MyApp (props) {
  const { accounts } = useMsal()
  const username = accounts.length > 0 ? accounts[0].username : ''
  const { instance } = useMsal()
  const [ids, setIds] = useState([])
  const [dataSet, setDataSet] = useState(false)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      async function getUserDetails (username) {
        await axios.get('/api/REMS/getUserDetails?email=' + username).then((resp) => {
          if (resp.data) {
            setUserDetails(resp.data)
          }
        })
      }
      if (userDetails.length === 0) {
        console.log('USER NEEDS DETAILS')
        setUserDetails(await getUserDetails(username))
      }
    }
    fetchData()
  }, [userDetails, setUserDetails])

  const { data } = useSWR(
    '/REMS/retailerids',
    fetcher
  )

  if (data && !dataSet) {
    setIds(data)
    setDataSet(true)
  }

  const { Component, pageProps } = props
  const [open, setOpen] = React.useState(false)
  const [sidebarDrawerIsPinned, setSidebarDrawerIsPinned] = useState(false)
  const [pinBackgroundColorStyle, setPinBackgroundColorStyle] = useState('#ffffff')
  const cookies = new Cookies()

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    if (!sidebarDrawerIsPinned) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (sidebarDrawerIsPinned === true) {
      setPinBackgroundColorStyle('#d4d4d4')
    }
    if (sidebarDrawerIsPinned === false) {
      setPinBackgroundColorStyle('#ffffff')
    }
  }, [sidebarDrawerIsPinned])

  React.useEffect(() => {
    if (cookies.get('isPinned') === 'true') {
      setSidebarDrawerIsPinned(true)
      setOpen(true)
    }
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  /**
   * Using the event API, you can register an event callback that will do something when an event is emitted.
   * When registering an event callback in a react component you will need to make sure you do 2 things.
   * 1) The callback is registered only once
   * 2) The callback is unregistered before the component unmounts.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
   */
  React.useEffect(() => {
    const callbackId = instance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (event.error && event.error.errorMessage.indexOf('AADB2C90118') > -1) {
          if (event.interactionType === InteractionType.Redirect) {
            instance.loginRedirect(b2cPolicies.authorities.forgotPassword)
          } else if (event.interactionType === InteractionType.Popup) {
            instance.loginPopup(b2cPolicies.authorities.forgotPassword)
              .catch(e => {

              })
          }
        }
      }
      if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
        if (event?.payload && event.payload.idTokenClaims.acr) {
          /**
                 * We need to reject id tokens that were not issued with the default sign-in policy.
                 * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
                 * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                 */
          console.log(event.payload)
          if (event.payload.idTokenClaims.acr === b2cPolicies.names.forgotPassword) {
            window.alert('Password has been reset successfully. \nPlease sign-in with your new password.')
            // return instance.logout();
          } else if (event.payload.idTokenClaims.acr === b2cPolicies.names.editProfile) {
            window.alert('Profile has been edited successfully. \nPlease sign-in again.')
            return instance.logout()
          }
        }
      }
    })

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId)
      }
    }
  }, [])

  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <Root>
          <Head>
            <title>TGCS | PAS Portal</title>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
          </Head>
          <div className={classes.root}>
            <AuthenticatedTemplate>
              <UserContextProvider pageName={props.Component.name}>
                <HeaderToolbar
                  ids={ids}
                  open={open}
                  handleDrawerOpen={handleDrawerOpen} />
                <SidebarDrawer open={open} sidebarDrawerIsPinned={sidebarDrawerIsPinned} setSidebarDrawerIsPinned={setSidebarDrawerIsPinned} pinBackgroundColorStyle={pinBackgroundColorStyle} theme={theme} handleDrawerClose={handleDrawerClose} />
                <div className={classes.appBarSpacer} />
                <Guard>
                  <Component {...pageProps} />
                </Guard>
              </UserContextProvider>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <HeaderToolbar
                ids={ids}
                open={open}
                handleDrawerOpen={handleDrawerOpen} />
              <Container maxWidth="lg" className={classes.container}>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12} marginTop={10}>
                  <Typography align="center" variant="h4">Sign in to access the portal</Typography>
                </Grid>
              </Container>
            </UnauthenticatedTemplate>
          </div>
        </Root>
      </ThemeProvider>
    </MsalProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}
