/* eslint-disable no-undef */
import { EventType, InteractionType } from '@azure/msal-browser';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { ThemeProvider } from '@emotion/react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Head from 'next/head';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import SidebarDrawer from '../components/SidebarDrawer';
import theme from '../src/theme';
import { msalInstance } from './authConfig';
import { Guard } from '../components/AuthGuard';
import 'semantic-ui-css/semantic.min.css';
import { UserContextProvider } from './UserContext';
import _ from 'lodash';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import CommandCenterOverview from './administration/commandCenterOverview';
import EnterpriseOverview from './enterpriseOverview';
import DeploymentStatus from './softwareDistribution/deploymentStatus';
import CreateDeploymentConfig from './softwareDistribution/createDeploymentConfig';
import ScheduleDeployment from './softwareDistribution/scheduleDeployment';
import DistributionLists from './softwareDistribution/distributionLists';

const PREFIX = '_app';

const classes = {
    root: `${PREFIX}-root`,
    content: `${PREFIX}-content`,
};
// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('main')(
    ({
        // TODO: we should probably set up a theme, making it easier to select colors on components
        theme,
    }) => ({
        [`& .${classes.root}`]: {
            overflow: 'auto',
            display: 'flex',
        },

        [`& .${classes.content}`]: {
            overflow: 'auto',
        },
    })
);
export default function MyApp(props) {
    const { instance } = useMsal();
    const [disabledFeatureDialogOpen, setDisabledFeatureDialogOpen] = useState(false)
    const [nonDevelopedFeatureDialogOpen, setNonDevelopedFeatureDialogOpen] = useState(false)
    const { Component, pageProps } = props;
    const [showSidebarDrawer, setShowSidebarDrawer] = useState(true);

    function handleDisabledFeatureClicked() {
        setDisabledFeatureDialogOpen(true)
    }
    function handleDisabledFeatureDialogClose() {
        setDisabledFeatureDialogOpen(false)
    }
    function handleNonDevelopedFeatureClicked() {
        setNonDevelopedFeatureDialogOpen(true)
    }
    function handleNonDevelopedFeatureDialogClose() {
        setNonDevelopedFeatureDialogOpen(false)
    }

    useEffect(() => {
        if (_.includes(Component.name, 'Redirect')) {
            setShowSidebarDrawer(false);
        }
    }, [pageProps]);

    /**
     * Using the event API, you can register an event callback that will do something when an event is emitted.
     * When registering an event callback in a react component you will need to make sure you do 2 things.
     * 1) The callback is registered only once
     * 2) The callback is unregistered before the component unmounts.
     * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
     */
    useEffect(() => {
        const callbackId = instance.addEventCallback((event) => {
            if (event.eventType === EventType.LOGIN_FAILURE) {
                if (event.error && event.error.errorMessage.indexOf('AADB2C90118') > -1) {
                    if (event.interactionType === InteractionType.Redirect) {
                        instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
                    } else if (event.interactionType === InteractionType.Popup) {
                        instance.loginPopup(b2cPolicies.authorities.forgotPassword).catch((e) => { });
                    }
                }
            }
            if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
                if (event?.payload && event.payload.idTokenClaims.acr) {
                    /*
                     * We need to reject id tokens that were not issued with the default sign-in policy.
                     * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
                     * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                     */
                    console.log(event.payload);
                    if (event.payload.idTokenClaims.acr === b2cPolicies.names.forgotPassword) {
                        window.alert('Password has been reset successfully. \nPlease sign-in with your new password.');
                        // return instance.logout();
                    } else if (event.payload.idTokenClaims.acr === b2cPolicies.names.editProfile) {
                        window.alert('Profile has been edited successfully. \nPlease sign-in again.');
                        return instance.logout();
                    }
                }
            }
        });

        return () => {
            if (callbackId) {
                instance.removeEventCallback(callbackId);
            }
        };
    }, []);

    return (
        <MsalProvider instance={msalInstance}>
            <ThemeProvider theme={theme}>
                <Root>
                    {/* TODO: Does this URL need to be configurable? */}
                    {/* <script type="module" src="https://bi-analytics-dev.toshiba-solutions.com/javascripts/api/tableau.embedding.3.latest.min.js"></script> */}
                    <Head>
                        <title>TGCS | PAS Portal</title>
                        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                        <link rel="manifest" href="/site.webmanifest" />
                        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                    </Head>
                    <div className={classes.root}>
                      <UserContextProvider pageName={props.Component.name}>
                        {/* <CommandCenterOverview /> */}
                        {/* <EnterpriseOverview /> */}
                        {/* <CreateDeploymentConfig /> */}
                        <ScheduleDeployment />
                        {/* <DistributionLists /> */}
                      </UserContextProvider>

                        {/* <AuthenticatedTemplate>
                            <UserContextProvider pageName={props.Component.name}>
                                <SidebarDrawer showSidebarDrawer={showSidebarDrawer} handleDisabledFeatureClicked={handleDisabledFeatureClicked} handleNonDevelopedFeatureClicked={handleNonDevelopedFeatureClicked} />
                                <Guard>
                                    <Component {...pageProps} />
                                </Guard>
                                <Dialog open={disabledFeatureDialogOpen}>
                                    <DialogTitle id="alert-dialog-title">Selected Feature Unavailable</DialogTitle>
                                    <Typography sx={{ width: '70%', alignSelf: 'center' }}>
                                        To enable this <strong>PAS Advanced</strong> feature, contact your Toshiba sales representative and inquire about upgrading your subscription.
                                    </Typography>
                                    <DialogActions>
                                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleDisabledFeatureDialogClose}>
                                            Okay
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={nonDevelopedFeatureDialogOpen}>
                                    <DialogTitle id="alert-dialog-title">Selected Feature Unavailable</DialogTitle>
                                    <Typography sx={{ width: '70%', alignSelf: 'center' }}>
                                        This feature is <strong>under development</strong>!  Check back at a later date!
                                    </Typography>
                                    <DialogActions>
                                        <Button style={{ marginRight: 12 }} variant="contained" onClick={handleNonDevelopedFeatureDialogClose}>
                                            Okay
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </UserContextProvider>
                        </AuthenticatedTemplate>
                        <UnauthenticatedTemplate>
                            <SidebarDrawer showSidebarDrawer={showSidebarDrawer} />
                            <Container maxWidth="lg" className={classes.container}>
                                <Typography align="center" variant="h4">
                                    Sign in to access the portal
                                </Typography>
                            </Container>
                        </UnauthenticatedTemplate> */}
                    </div>
                </Root>
            </ThemeProvider>
        </MsalProvider >
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
