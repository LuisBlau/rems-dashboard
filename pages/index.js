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
  fixedHeight: `${PREFIX}-fixedHeight`
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
    paddingTop: 50
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

function SignInButton() {
  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
  const { instance } = useMsal();

  return <button onClick={() => instance.loginRedirect()}>Sign In</button>;
}

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
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
    <div >
            <div className={classes.appBarSpacer} />
            <Typography>Hello1</Typography>
            <Typography>Hello2</Typography>
            <Typography>Hello3</Typography>
            <Typography>Hello4</Typography>
    <Head>
      <title>Azure AD Authentication using MSAL and Next.js</title>
    </Head>

    <AuthenticatedTemplate>
      <p>This will only render if a user is signed-in.</p>
      <WelcomeUser />
    </AuthenticatedTemplate>
    <UnauthenticatedTemplate>
      <p>This will only render if a user is not signed-in.</p>
      <SignInButton />
    </UnauthenticatedTemplate>
  </div>
  );
}
