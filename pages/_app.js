import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
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
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';

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
        paddingTop: 50
    }
    /*toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
    },
    */
    /*appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },*/
    /*menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
    */
    /*  drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
      drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(9),
        },
      },
    */
    /*  content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      },
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
      },
      */
    /*
     fixedHeight: {
       height: 240,
     },
     */
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
      },{
        name: "Extracts",
        route: "/store/extractTable",
        icon: <BackupOutlinedIcon/>
      }, {
        name: "Dumps",
        route: "/store/dumpTable",
        icon: <CloudDownloadIcon/>
      }, */
    {
        name: "Check Deploy Status",
        route: "/deployStatus",
        icon: <PendingActionsIcon />
    }, {
        name: "Upload a File",
        route: "/fileUpload",
        icon: <PublishIcon />
    }, {
        name: "Create Deploy Config",
        route: "/deployCreate",
        icon: <AddCircleOutline />
    }, {
        name: "Schedule a Deployment",
        route: "/deploySchedule",
        icon: <ScheduleIcon />
    }, {
        name: "Select Agents",
        route: "/agentSelect",
        icon: <ImportantDevicesIcon />
    }, {
        name: "Dumps",
        route: "/store/dumpTable",
        icon: <CloudDownloadIcon />
    }
];

export default function MyApp(props) {


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

    return (
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
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <div className={classes.root}>
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
                            <Typography
                                component="div"
                                variant="h6"
                                noWrap >
                                Dashboard
                            </Typography>
                            <IconButton color="inherit">
                                <Badge badgeContent={0} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
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
                        <List>
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
                        </List>
                    </Drawer>
                    <div className={classes.appBarSpacer} />
                    <Component {...pageProps} />
                </div>
            </ThemeProvider>
        </Root>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.object.isRequired,
};
