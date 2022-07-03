import React from "react";
import { styled } from '@mui/material/styles';
import clsx from "clsx";
import Typography from '@mui/material/Typography';
import Realtime from "./registers/realtime_alternative";
import DeployStatus from "./deployStatus";
import { msalInstance } from "./authConfig"; 
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import Head from 'next/head';

const PREFIX = 'index';

/** 
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.  
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md 
 */ 
 


const classes = {
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  paper: `${PREFIX}-paper`,
  fixedHeight: `${PREFIX}-fixedHeight`,
  appBarSpacer: `${PREFIX}-appBarSpacer`
};

const Root = styled('main')((
  {
    theme
  }
) => ({
  [`&.${classes.content}`]: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  [`& .${classes.appBarSpacer}`]: {
    paddingTop: 80
  },
  [`& .${classes.container}`]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },

  [`& .${classes.fixedHeight}`]: {
    height: 240,
  }
}));

const drawerWidth = 240;

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;
  
  window.location.href = "/store/connectionOverview"
  return <div/>;
}


export default function Index() {

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Root >
      <div className={classes.appBarSpacer} />
      <AuthenticatedTemplate>
        <WelcomeUser />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Typography align="center" variant="h4">Sign in to access the portal</Typography>
      </UnauthenticatedTemplate>
  </Root>
  );
}
