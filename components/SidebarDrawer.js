/* eslint-disable react/prop-types */
import MuiDrawer from '@mui/material/Drawer';
import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Avatar, Button, Grid, IconButton, MenuItem, Paper, Select, Typography } from '@mui/material';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import MenuIcon from '@mui/icons-material/Menu';
import ToshibaLogo from '../public/toshibaicon.png';
import ToshibaNameplate from '../public/Toshiba.png';
import PasLogo from '../public/images/pas-logo.png';
import LogoutIcon from '../public/icons/logout.png';
import LoginIcon from '../public/icons/login.png';
import Image from 'next/image';
import UserContext from '../pages/UserContext';
import Cookies from 'universal-cookie';
import { Box } from '@mui/system';
import axios from 'axios';

function AppNameplate({ open }) {
    if (open === true) {
        return (
            <div style={{ padding: 8 }}>
                <Image src={ToshibaNameplate} sx={{ ...(!open && { hidden: 'true' }) }} alt="ToshibaNameplate" />
            </div>
        );
    } else {
        return null;
    }
}

function DrawerOpenerBurger({ open, handleDrawerOpenAndClose, sidebarDisable }) {
    if (open === true) {
        return (
            <div style={{ paddingTop: 20 }}>
                <IconButton onClick={() => { if (!sidebarDisable) handleDrawerOpenAndClose() }}>
                    <MenuIcon style={{ color: '#FFFFFF' }} />
                </IconButton>
            </div>
        );
    } else {
        return (
            <div>
                <IconButton onClick={() => { handleDrawerOpenAndClose(); }}>
                    <MenuIcon style={{ color: '#FFFFFF' }} />
                </IconButton>
            </div>
        );
    }
}

function RetailerSelector({ context, handleSelectedRetailerChanged, availableRetailers, open }) {
    if (context) {
        if (context.selectedRetailer && open) {
            if (availableRetailers.length > 1) {
                return (
                    <Select
                        labelId="retailer-select-label"
                        id="retailer-select"
                        value={availableRetailers.length > 0 ? context.selectedRetailer : ''}
                        onChange={handleSelectedRetailerChanged}
                        sx={{
                            color: '#e4e4e4',
                            height: 40,
                            margin: 1
                        }}
                    >
                        {availableRetailers.map((retailer, index) => (
                            <MenuItem key={index} sx={{
                                mt: 1
                            }} value={retailer.retailer_id}>
                                {retailer.description}
                            </MenuItem>
                        ))}
                    </Select>
                );
            } else if (availableRetailers.length === 1) {
                return (
                    <Paper sx={{
                        margin: 1,
                        backgroundColor: "#4F5051",
                        color: '#e4e4e4',
                        height: 40,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Typography variant='h5'>{availableRetailers[0].description}</Typography>
                    </Paper>
                )
            }
        } else {
            return null;
        }
    }
}


export default function SidebarDrawer({ showSidebarDrawer, handleDisabledFeatureClicked, handleNonDevelopedFeatureClicked }) {
    const cookies = new Cookies();
    const [open, setOpen] = useState(true);
    const [sidebarDisable, setSidebarDisable] = useState(false);
    const [availableRetailers, setAvailableRetailers] = useState([]);
    const [pasSubscriptionTier, setPasSubscriptionTier] = useState('b2b');
    const [userInitials, setUserInitials] = useState('')
    const [userDisplayName, setUserDisplayName] = useState('')
    const context = useContext(UserContext);
    const [alertsEnabled, setAlertsEnabled] = useState(false)

    useEffect(() => {
        if (context) {
            if (context.selectedRetailer) {
                axios.get(`/api/REMS/retailerConfiguration?isAdmin=true&ccv=true&retailerId=${context.selectedRetailer}`).then(function (res) {
                    let configs = res.data.configuration
                    Object.values(configs).forEach(config => {
                        if (Object.keys(config)[0] === 'alertsEnabled') {
                            setAlertsEnabled(config.alertsEnabled.configValue)
                        }
                    });
                })
            }
        }
    }, [context])

    const handleSelectedRetailerChanged = (e) => {
        if (e.target) {
            cookies.set('retailerId', e.target.value, { path: '/' });
            context.setSelectedRetailer(e.target.value);
        } else {
            cookies.set('retailerId', e, { path: '/' });
            context.setSelectedRetailer(e);
        }
    };
    if (showSidebarDrawer) {
        useEffect(() => {
            if (context) {
                if (context.userRetailers) {
                    setAvailableRetailers(context.userRetailers);
                    let localTierSet = 'b2b'
                    let index = -1
                    context.userRetailers.forEach(retailer => {
                        if (localTierSet === 'b2b') {
                            index = _.findIndex(Object.keys(retailer.configuration), (e) => {
                                return e === "pas_subscription_tier"
                            }, 0)
                            if (index !== -1) {
                                if (Object.values(retailer.configuration)[index] === 'advanced') {
                                    localTierSet = 'advanced'
                                    setPasSubscriptionTier('advanced')
                                } else if (Object.values(retailer.configuration)[index] === 'lite') {
                                    localTierSet = 'lite'
                                    setPasSubscriptionTier('lite')
                                }
                            }
                        }
                    });
                }

                if (context.userDetails) {
                    if (context.userDetails.firstName && context.userDetails.lastName) {
                        setUserInitials(context.userDetails.firstName.charAt(0) + context.userDetails.lastName.charAt(0))
                        setUserDisplayName(context.userDetails.firstName + " " + context.userDetails.lastName)
                    }
                }
                if (context.currentPage) {
                    if (context.currentPage === 'CommandCenterOverview' && open === true) {
                        setOpen(false)
                    }
                }
                if (context.hasChildren) {
                    setSidebarDisable(true);
                    setOpen(true);
                } else {
                    setSidebarDisable(false);
                }
            }

        }, [context]);

        useEffect(() => {
            if (!open) {
                if (!context.hasChildren && context.openedMenuItems.length > 0) {
                    context.setOpenedMenuItems([]);
                }
            }
        }, [context, open]);
    }

    function handleDrawerOpenAndClose() {
        setOpen(prev => !prev);

    }

    function SignInButton() {
        // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
        const { instance } = useMsal();
        if (open) {
            return (
                <Button variant="contained" onClick={() => signInClickHandler(instance)}>
                    <Image src={LoginIcon} alt="LoginIcon" />
                    <Typography paddingLeft={1} fontWeight={700}>
                        Sign in
                    </Typography>
                </Button>
            );
        } else {
            return (
                <IconButton
                    size="small"
                    aria-label="Sign In"
                    component="label"
                    onClick={() => signInClickHandler(instance)}
                >
                    <Image src={LoginIcon} alt="LoginIcon" />
                </IconButton>
            );
        }
    }

    function SignOutButton() {
        // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
        const { instance } = useMsal();

        if (open) {
            return (
                <Button variant="contained" onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: '/' })}>
                    <Image src={LogoutIcon} alt="LogoutIcon" />
                    <Typography paddingLeft={1} fontWeight={700}>
                        Sign out
                    </Typography>
                </Button>
            );
        } else {
            return (
                <IconButton
                    size="small"
                    aria-label="Sign Out"
                    component="label"
                    onClick={() => instance.logoutRedirect({ postLogoutRedirectUri: '/' })}
                >
                    <Image src={LogoutIcon} alt="LogoutIcon" />
                </IconButton>
            );
        }
    }

    function signInClickHandler(instance) {
        instance.loginRedirect({ scopes: ['openid', 'email', 'profile'] });
    }

    const drawerWidth = 270;

    const Drawer = styled(MuiDrawer, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        width: drawerWidth,
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
    }));

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        background: '#373839',
    }));

    const DrawerFooter = styled('div')(({ theme }) => ({
        height: '200px',
        marginTop: 'auto',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        background: '#373839',
    }));

    const openedMixin = (theme) => ({
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        background: '#4F5051',
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
            background: '#4F5051',
        },
    });

    function renderSubscriptionTitle(title) {
        if (title === 'advanced')
            return 'PAS Advanced';
        else if (title === 'lite')
            return 'PAS Lite';
        else (title === 'b2b')
        return 'B2B';

    }
    if (showSidebarDrawer) {
        return (
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <div
                        style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginLeft: 3 }}
                    >
                        <Link key={'enterpriseOverview'} href={'/enterpriseOverview'} style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', cursor: 'pointer', marginRight: 15 }}>
                                <div style={{ maxWidth: '32px', maxHeight: '32px', paddingTop: 8 }}>
                                    <Image src={ToshibaLogo} alt="ToshibaLogo" />
                                </div>
                                <AppNameplate open={open} />
                            </div>
                        </Link>
                        {open === false && <DrawerOpenerBurger open={open} handleDrawerOpenAndClose={handleDrawerOpenAndClose} sidebarDisable={sidebarDisable} />}
                        {open && <DrawerOpenerBurger open={open} handleDrawerOpenAndClose={handleDrawerOpenAndClose} sidebarDisable={true} />}
                    </div>
                </DrawerHeader>
                <AuthenticatedTemplate>
                    {context && (
                        <RetailerSelector
                            open={open}
                            context={context}
                            handleSelectedRetailerChanged={handleSelectedRetailerChanged}
                            availableRetailers={availableRetailers}
                        />
                    )}
                    <Sidebar
                        alertsEnabled={alertsEnabled}
                        handleDisabledFeatureClicked={handleDisabledFeatureClicked}
                        handleNonDevelopedFeatureClicked={handleNonDevelopedFeatureClicked}
                        pasSubscriptionTier={pasSubscriptionTier}
                        sidebarOpen={open}
                    />

                    {open &&
                        <div
                            style={{
                                paddingLeft: 15,
                                height: '100%',
                                display: 'flex',
                                justifyItems: 'center',
                                textAlign: 'center',
                                alignItems: 'end'
                            }}
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Image src={PasLogo} alt="PASLogo" priority={true} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography sx={{ color: '#FFFFFF', fontSize: '13px', fontStyle: 'italic' }}>
                                        {renderSubscriptionTitle(pasSubscriptionTier)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    }
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <div
                        style={{
                            paddingLeft: 15,
                            height: '100%',
                            display: 'flex',
                            justifyItems: 'center',
                            textAlign: 'center',
                            alignItems: 'end'
                        }}
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Image src={PasLogo} alt="PASLogo" />
                            </Grid>
                        </Grid>
                    </div>
                </UnauthenticatedTemplate>
                <DrawerFooter>
                    <AuthenticatedTemplate>
                        {/* TODO: add popover or something - per UI/UX team design - and put signout in there, as well as setting panel */}
                        {!open && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1, alignItems: 'center' }}>
                                {userInitials && <Avatar sx={{ marginRight: 1 }} alt={"name"}>{userInitials}</Avatar>}
                                {/* Commented out for now until the restyle */}
                                {/* <Typography sx={{ color: "white", marginRight: 1 }}>{userDisplayName}</Typography> */}
                            </Box>
                            <SignOutButton />
                        </Box>}
                        {open && <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1, alignItems: 'center' }}>
                                {userInitials && <Avatar sx={{ marginRight: 1 }} alt={"name"}>{userInitials}</Avatar>}
                                {/* Commented out for now until the restyle */}
                                {/* <Typography sx={{ color: "white", marginRight: 1 }}>{userDisplayName}</Typography> */}
                            </Box>
                            <SignOutButton />
                        </Box>}


                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <SignInButton />
                    </UnauthenticatedTemplate>
                </DrawerFooter>
            </Drawer >
        );
    } else {
        return null;
    }
}
