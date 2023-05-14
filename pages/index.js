/* eslint-disable no-unused-vars */
import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';

const PREFIX = 'index';

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },

    [`& .${classes.paper}`]: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

function LandingPageRedirect() {
    location.replace('/enterpriseOverview');
    return null;
}

export default function Index() {
    return (
        <Root>
            <AuthenticatedTemplate>
                <LandingPageRedirect />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Typography align="center" variant="h4">
                    Sign in to access the portal
                </Typography>
            </UnauthenticatedTemplate>
        </Root>
    );
}
