import { styled } from '@mui/material/styles';
import React, { useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme";
import useSWR from "swr";
import fetcher from "../lib/lib.js";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import Cookies from 'universal-cookie';
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import List from "@mui/material/List";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Link from "next/link";
import PublishIcon from '@mui/icons-material/Publish';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import CreateIcon from '@mui/icons-material/Create';
import axios from "axios"
import { useRouter } from 'next/router'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import HighlightIcon from '@mui/icons-material/Highlight';
import Sidebar from '../components/Sidebar';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { MsalProvider, useMsal, AuthenticatedTemplate, UnauthenticatedTemplate,MsalAuthenticationTemplate } from "@azure/msal-react";
import { EventType, InteractionType } from "@azure/msal-browser";
import { msalInstance, getMsalConfig } from "./authConfig";


import { ThemeProvider } from '@emotion/react';
import { Button } from "@mui/material";

const PREFIX = '_app';

const classes = {
    root: `${PREFIX}-root`,
    content: `${PREFIX}-content`,
    MuiAppBar: `${PREFIX}-MuiAppBar`,
    appBarSpacer: `${PREFIX}-appBarSpacer`
};
// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
    {
        theme
    }
) => ({
    [`& .${classes.root}`]: {
        display: "flex",
    },

    [`& .${classes.content}`]: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
        paddingTop: 50,
    },

    [`& .${classes.MuiAppBar}`]: {
        position: "absolute"
    },

    [`& .${classes.appBarSpacer}`]: {
        paddingTop: 80
    }
}));


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const MenuItems = [
    /*  {
        name: "Dashboard",
        route: "/",
        icon: <DashboardIcon/>
      }, {
        name: "Store Release Levels",
        route: "/store/releaseOverview",
        icon: <SystemUpdateAltIcon/>,
      }, {
        name: "Store Connection",
        route: "/store/connectionOverview",
        icon: <SettingsInputComponentIcon/>,
      }, {
        name: "All Seeing Eye",
        route: "/registers/allSeeingEye",
        icon: <Visibility/>,
      }, {
        name: "SCO Drive Use",
        route: "/controller/lowMemoryOverview",
        icon: <Storage/>,
      }, {
        name: "VPD Info",
        route: "/controller/vpdOverview",
        icon: <NetworkCheckIcon/>,
      } */
    { 
        id: "overview",
        name: "Enterprise Overview",
        route: "/store/connectionOverview",
        icon: <HighlightIcon />
    },
    {
        id: "softwareDeploy",
        name:"Software Distribution",
        icon: <PendingActionsIcon />,
        route: "/deployStatus",
        items:[
            {
                id:"uploadFile",
                name: "Upload a File",
                route: "/fileUpload",
                icon: <PublishIcon />
            }, {
                id:"deployConfig",
                name: "Create Deploy Config",
                route: "/deployCreate",
                icon: <AddCircleOutline />
            }, {
                id:"scheduleDeploy",
                name: "Schedule a Deployment",
                route: "/deploySchedule",
                icon: <ScheduleIcon />
            }, {
                id:"selectAgents",
                name: "Select Agents",
                route: "/agentSelect",
                icon: <ImportantDevicesIcon />
            }
        ]
    },
	{
    name: "SNMP",
    route: "/snmp",
    icon: <SystemUpdateAltIcon/>,
    },
    {
        id:"Doc Collection",
        name:"Doc Collection",
        route: "/store/captureTable",
        icon: <BugReportIcon />,
        items: [
    
            {
                id:"dumps",
                name: "Dumps",
                route: "/store/dumpTable",
                icon: <CarCrashIcon />
            }, {
                id:"extracts",
                name: "Chec Extracts",
                route: "/store/extractTable",
                icon: <CarCrashIcon />
            }, {
                id:"dataCapture",
                name: "DataCapture",
                route: "/registers/ExtractRequest",
                icon: <CloudDownloadIcon />
            }
        ]
    }
];

function RedirectBlock() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();

    instance.loginRedirect();

    return null;
}

function signInClickHandler(instance) {
    instance.loginRedirect();
}


function SignInButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();
    return <Button variant="contained" onClick={() => signInClickHandler(instance)}>Sign In</Button>
}

function SignOutButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();
  
    return <Button  variant="contained" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: "/" })}>Sign Out</Button>;
}
  
function WelcomeUser() {
    const { accounts } = useMsal();
    const username = accounts[0].username;
  
    return <p>Welcome, {username}</p>;
}

export default function MyApp(props) {

    const { instance } = useMsal();

    const cookies = new Cookies();
    if(cookies.get('retailerId') == undefined) {
        cookies.set("retailerId","T0BSUTZ",{ path: '/' })
    }
    const [ids, setIds] = useState([]);
    const [dataSet,setDataSet] = useState(false)
    const [selectedId, setSelectedId] = useState("");
    if(selectedId == "" && cookies.get('retailerId') != undefined) {
        setSelectedId(cookies.get("retailerId"))
    }
    const { data, error } = useSWR(
        '/REMS/retailerids',
        fetcher
    );

    if(data && !dataSet) {
		setIds(data)
        setDataSet(true)
	}
    const router = useRouter()
    const { Component, pageProps } = props;
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);
	const handleSelectedIdChange = (e) => {
		cookies.set('retailerId', e.target.value,{ path: '/' })
		setSelectedId(e.target.value)
		location.reload()
	}
		

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
                if (event.error && event.error.errorMessage.indexOf("AADB2C90118") > -1) {
                if (event.interactionType === InteractionType.Redirect) {
                    instance.loginRedirect(b2cPolicies.authorities.forgotPassword);
                } else if (event.interactionType === InteractionType.Popup) {
                    instance.loginPopup(b2cPolicies.authorities.forgotPassword)
                    .catch(e => {
                        return;
                    });
                }
                }
            }
            if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
                if (event?.payload && event.payload.idTokenClaims["acr"]) {
                /**
                 * We need to reject id tokens that were not issued with the default sign-in policy.
                 * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
                 * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
                 */
                console.log(event.payload);
                if (event.payload.idTokenClaims["acr"] === b2cPolicies.names.forgotPassword) {
                    window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
                    //return instance.logout();
                } else if (event.payload.idTokenClaims["acr"] === b2cPolicies.names.editProfile) {
                    window.alert("Profile has been edited successfully. \nPlease sign-in again.");
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
            
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      
            <div className={classes.root}>
            {/*<MsalAuthenticationTemplate interactionType={InteractionType.Popup}>*/}
                <CssBaseline />
                <AppBar position="absolute" open={open} >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }} >
                            <MenuIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Typography
                            component="div"
                            variant="h6"
                            paddingLeft={1}
                            noWrap style={{ flex: 1}} >
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedId}
                        onChange={handleSelectedIdChange}>
                        {ids.map((x) => <MenuItem sx={{mt: 1}} value={x}>{x}</MenuItem>)}
                    </Select>
                        <AuthenticatedTemplate >
                            <SignOutButton />
                        </AuthenticatedTemplate>
                        <UnauthenticatedTemplate>
                            <SignInButton />
                        </UnauthenticatedTemplate>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    open={open} >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <Sidebar items={MenuItems}></Sidebar>
                    {/*<List>
                        {MenuItems.map((item) => {
                            return (
                                <Link key={item.name} href={item.route}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}</ListItemIcon>
                                        <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </Link>
                            );
                        })}
                    </List>*/}
                </Drawer>
                <div className={classes.appBarSpacer} />    
                <AuthenticatedTemplate>
                    <Component {...pageProps} />
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                <Container maxWidth="lg" className={classes.container}>
                <Grid item xs={12}>
                    </Grid>
                                    <Grid item xs={12}>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align="center" variant="h4">Sign in to access the portal</Typography>
                    </Grid>
                    
                </Container>
                </UnauthenticatedTemplate>
                {/*</MsalAuthenticationTemplate>*/}
                
            </div>
           
            
        </Root>
        </ThemeProvider>
        </MsalProvider>
        
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
