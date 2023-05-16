/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import MuiListItemIcon from '@mui/material/ListItemIcon';
import UserContext from '../pages/UserContext';
import EnterpriseOverviewIcon from '../public/icons/enterprise-overview.png';
import SoftwareDistributionIcon from '../public/icons/software-distribution.png';
import UploadFileIcon from '../public/icons/upload-file.png';
import CreateDeployConfigIcon from '../public/icons/create-deploy-config.png';
import ScheduleDeploymentIcon from '../public/icons/schedule-deployment.png';
import SelectAgentsIcon from '../public/icons/select-agents.png';
import SnmpIcon from '../public/icons/snmp.png';
import DocCollectionIcon from '../public/icons/doc-collection.png';
import DumpsIcon from '../public/icons/dumps.png';
import ChecExtractsIcon from '../public/icons/chec-extracts.png';
import AboutIcon from '../public/icons/about.png'
import DataCaptureIcon from '../public/icons/data-capture.png';
import AssetInventoryIcon from '../public/icons/asset-inventory.png';
import DiagnosticsIcon from '../public/icons/diagnostics.png';
import AdminIcon from '../public/icons/admin.png';
import DeployementStatusIcon from '../public/icons/deployment-status.png';
import Image from 'next/image';
import { Collapse, Divider, ListItemButton, Typography } from '@mui/material';
import Link from 'next/link';
import _ from 'lodash';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const ListItemIcon = styled(MuiListItemIcon, {})(({ theme }) => ({
    minWidth: '30px'
}));

function SidebarItem({ opened, sidebarOpen, handleOpened, name, id, icon, route, items, depthStep = 12, depth = 0, sub, enabled, handleDisabledFeatureClicked, handleNonDevelopedFeatureClicked, context, pasSubscriptionTier, ...rest }) {
    const [open, setOpen] = useState(opened);
    const { pathname } = useRouter();
    function handleExpandCategory() {
        handleOpened(id, !open);
        setOpen(!open);
    }
    const activeColor = pathname === route ? "#4BA6FE" : sub !== true ? '#4f5051' : '#373839';
    if (_.isArray(items)) {
        if (enabled) {
            return (
                <>
                    <ListItemButton onClick={handleExpandCategory} sx={{ backgroundColor: activeColor }}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        {sidebarOpen && <>
                            <Typography fontWeight={400} sx={{ color: '#FFFFFF' }}>
                                {name}
                            </Typography>
                            {open ? <ExpandLess sx={{ color: '#FFFFFF' }} /> : <ExpandMore sx={{ color: '#FFFFFF' }} />}</>
                        }
                    </ListItemButton>
                    {open ? <Divider sx={{ backgroundColor: '#FFFFFF' }} /> : <></>}
                    <Collapse sx={{ backgroundColor: '#373839' }} in={open} timeout="auto" unmountOnExit>
                        <List disablePadding dense>
                            {items.map((subItem) => (
                                <SidebarItem sidebarOpen={sidebarOpen} key={subItem.name} {...subItem} sub={true} handleDisabledFeatureClicked={handleDisabledFeatureClicked} handleNonDevelopedFeatureClicked={handleNonDevelopedFeatureClicked} context={context} />
                            ))}
                        </List>
                    </Collapse>
                </>
            );
        } else {
            if (route === '/') {
                return (
                    <>
                        <ListItemButton onClick={handleExpandCategory}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            {sidebarOpen && <>
                                <Typography fontWeight={400} sx={{ color: '#FFFFFF' }}>
                                    {name}
                                </Typography>
                                {open ? <ExpandLess sx={{ color: '#FFFFFF' }} /> : <ExpandMore sx={{ color: '#FFFFFF' }} />}</>
                            }
                        </ListItemButton>
                        {open ? <Divider sx={{ backgroundColor: '#8E9092' }} /> : <></>}
                        <Collapse sx={{ backgroundColor: '#373839' }} in={open} timeout="auto" unmountOnExit>
                            <List disablePadding dense>
                                {items.map((subItem) => (
                                    <SidebarItem sidebarOpen={sidebarOpen} key={subItem.name} {...subItem} sub={true} handleNonDevelopedFeatureClicked={handleNonDevelopedFeatureClicked} />
                                ))}
                            </List>
                        </Collapse>
                    </>
                )
            } else {
                return (
                    <>
                        <ListItemButton onClick={handleExpandCategory}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            {sidebarOpen && <>
                                <Typography fontWeight={400} sx={{ color: '#FFFFFF' }}>
                                    {name}
                                </Typography>
                                {open ? <ExpandLess sx={{ color: '#FFFFFF' }} /> : <ExpandMore sx={{ color: '#FFFFFF' }} />}</>
                            }
                        </ListItemButton>
                        {open ? <Divider sx={{ backgroundColor: '#8E9092' }} /> : <></>}
                        <Collapse sx={{ backgroundColor: '#373839' }} in={open} timeout="auto" unmountOnExit>
                            <List disablePadding dense>
                                {items.map((subItem) => (
                                    <SidebarItem sidebarOpen={sidebarOpen} key={subItem.name} {...subItem} sub={true} handleDisabledFeatureClicked={handleDisabledFeatureClicked} />
                                ))}
                            </List>
                        </Collapse>
                    </>
                )
            }
        }

    } else if (sub === true) {
        if (enabled) {
            return (
                <div onClick={() => { context?.setHasChildren(true) }}>
                    <Link key={name} href={route}>
                        <ListItemButton sx={{ paddingLeft: 6, backgroundColor: activeColor }} dense {...rest} >
                            <Typography fontWeight={400} sx={{ color: '#FFFFFF' }}>
                                - {name}
                            </Typography>
                        </ListItemButton>
                    </Link>
                </div>
            );
        } else {
            if (route === '/') {
                return (
                    <ListItemButton sx={{ paddingLeft: 6 }} dense {...rest} onClick={handleNonDevelopedFeatureClicked} >
                        <Typography fontWeight={400} sx={{ color: '#757779' }}>
                            - {name}
                        </Typography>
                    </ListItemButton>
                );
            } else {
                return (
                    <ListItemButton sx={{ paddingLeft: 6 }} dense {...rest} onClick={handleDisabledFeatureClicked}>
                        <Typography fontWeight={400} sx={{ color: '#757779' }}>
                            - {name}
                        </Typography>
                    </ListItemButton>
                );
            }
        }

    } else {
        // If it's a top-level item on the menu with no children
        if (enabled) {
            return (
                <div onClick={() => context.setHasChildren(false)}>
                    <Link key={name} href={route}>
                        <ListItemButton dense {...rest} sx={{ backgroundColor: activeColor }}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            {sidebarOpen &&
                                <Typography fontWeight={400} sx={{ color: '#FFFFFF' }}>
                                    {name}
                                </Typography>
                            }
                        </ListItemButton>
                    </Link>
                </div>
            )
        } else {
            return (
                <ListItemButton dense onClick={handleNonDevelopedFeatureClicked} sx={{ backgroundColor: activeColor }}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    {sidebarOpen &&
                        <Typography fontWeight={400} sx={{ color: '#8E9092' }}>
                            {name}
                        </Typography>}
                </ListItemButton>
            )
        }
    }
}

export default function Sidebar({ handleDisabledFeatureClicked, handleNonDevelopedFeatureClicked, pasSubscriptionTier, sidebarOpen }) {
    const context = useContext(UserContext);
    const { pathname } = useRouter();
    const [menu, setMenu] = useState([]);
    useEffect(() => {
        function getSidebarItems() {
            const MenuItems = [];
            if (context) {
                // instead of using context.userRoles to check for pas advanced, 
                // check context.userRetailers array and check those for which permission to use
                if (context.userRoles) {
                    const roles = context.userRoles
                    let tmp = {
                        id: 'overview',
                        name: 'Enterprise Overview',
                        route: '/enterpriseOverview',
                        icon: <Image src={EnterpriseOverviewIcon} alt="EnterpriseOverviewIcon" />,
                        enabled: true
                    };
                    MenuItems.push(tmp);
                    tmp = {
                        id: 'systemReporting',
                        name: 'System Reporting',
                        icon: <Image src={AssetInventoryIcon} alt="AssetInventoryIcon" />,
                        enabled: true,
                        items: [
                            {
                                id: 'assetInventory',
                                name: 'Asset Inventory',
                                route: '/systemReporting/tableauReportViewer?reportName=assetInventory',
                                enabled: true
                            },
                            {
                                id: 'alerts',
                                name: 'Alerts',
                                route: '/',
                                enabled: false
                            },
                            {
                                id: 'systemEvents',
                                name: 'Events',
                                route: '/systemReporting/tableauReportViewer?reportName=systemEvents',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'reloadTrends',
                                name: 'Reload Trends',
                                route: '/systemReporting/tableauReportViewer?reportName=registerReloads',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'checkExtractAnalysis',
                                name: 'CHEC Extract Analysis',
                                route: '/systemReporting/tableauReportViewer?reportName=extracts',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'softwareVersions',
                                name: 'Software Versions',
                                route: '/systemReporting/tableauReportViewer?reportName=softwareVersions',
                                enabled: pasSubscriptionTier === 'advanced'
                            }
                        ]
                    };
                    let enableIncidents = false
                    if (context.userRetailers) {
                        context.userRetailers.forEach(retailer => {
                            if (_.includes(retailer, "T0BF3K9")) {
                                // temporarily only enabled for BJs
                                enableIncidents = true
                            }
                        });
                    }
                    MenuItems.push(tmp)
                    tmp = {
                        id: 'incidents',
                        name: 'Incidents',
                        route: '/systemReporting/tableauReportViewer?reportName=incidents',
                        enabled: enableIncidents,
                        icon: <Image src={DataCaptureIcon} alt="DataCaptureIcon" />

                    };
                    MenuItems.push(tmp)
                    tmp = {
                        id: 'operationalReporting',
                        name: 'Operational Reporting',
                        icon: <Image src={DocCollectionIcon} alt="DocCollectionIcon" />,
                        enabled: pasSubscriptionTier === 'advanced',
                        items: [{
                            id: 'storeClose',
                            name: 'Store Close',
                            route: '/systemReporting/tableauReportViewer?reportName=storeClose',
                            enabled: pasSubscriptionTier === 'advanced'
                        }]
                    };
                    MenuItems.push(tmp)
                    tmp = {
                        id: 'diagnostics',
                        name: 'Diagnostics',
                        icon: <Image src={DiagnosticsIcon} alt="DiagnosticsIcon" />,
                        enabled: pasSubscriptionTier === 'advanced',
                        items: [
                            {
                                id: 'Doc Collection',
                                name: 'Doc Collection',
                                route: '/diagnostics/docCollection',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'dumps',
                                name: 'Dumps',
                                route: '/diagnostics/dumps',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'extracts',
                                name: 'Chec Extracts',
                                route: '/diagnostics/checExtracts',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'dataCapture',
                                name: 'Data Capture',
                                route: '/diagnostics/dataCapture',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                        ],
                    };
                    MenuItems.push(tmp);
                    tmp = {
                        id: 'software-distribution',
                        name: 'Software Distribution',
                        icon: <Image src={SoftwareDistributionIcon} alt="SoftwareDistributionIcon" />,
                        enabled: pasSubscriptionTier === 'advanced',
                        items: [
                            {
                                id: 'softwareDeploy',
                                name: 'Deployment Status',
                                icon: <Image src={DeployementStatusIcon} alt="DeploymentStatusIcon" />,
                                route: '/softwareDistribution/deploymentStatus',
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'deploymentFileUpload',
                                name: 'Upload a File',
                                route: '/softwareDistribution/deploymentFileUpload',
                                icon: <Image src={UploadFileIcon} alt="UploadFileIcon" />,
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'createDeploymentConfig',
                                name: 'Create Deploy Config',
                                route: '/softwareDistribution/createDeploymentConfig',
                                icon: <Image src={CreateDeployConfigIcon} alt="CreateDeployConfigIcon" />,
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'scheduleDeployment',
                                name: 'Schedule a Deployment',
                                route: '/softwareDistribution/scheduleDeployment',
                                icon: <Image src={ScheduleDeploymentIcon} alt="ScheduleDeploymentIcon" />,
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                            {
                                id: 'distributionLists',
                                name: 'Distribution Lists',
                                route: '/softwareDistribution/distributionLists',
                                icon: <Image src={SelectAgentsIcon} alt="SelectAgentsIcon" />,
                                enabled: pasSubscriptionTier === 'advanced'
                            },
                        ],
                    };
                    MenuItems.push(tmp);

                    if (!MenuItems.some((x) => x.name === 'Administration')) {
                        tmp = {
                            id: 'administration',
                            name: 'Administration',
                            icon: <Image src={AdminIcon} alt="AdminIcon" />,
                            enabled: true,
                            items: [
                                {
                                    name: 'SNMP',
                                    route: '/administration/snmp',
                                    icon: <Image src={SnmpIcon} alt="SNMPIcon" />,
                                    enabled: pasSubscriptionTier === 'advanced'
                                },
                                {
                                    name: 'Retailer Settings',
                                    route: '/administration/retailerSettings',
                                    enabled: true
                                },
                                {
                                    name: 'User Settings',
                                    route: '/administration/userSettings',
                                    enabled: true
                                }
                            ],
                        };
                        MenuItems.push(tmp);
                    }

                    if (MenuItems.some((x) => x.name === 'Administration') && roles.includes('toshibaAdmin')) {
                        tmp = [
                            {
                                name: 'Version Overview',
                                route: '/administration/versionOverview',
                                icon: null,
                                enabled: roles.includes('toshibaAdmin')
                            },
                            {
                                name: 'Version Mismatch Finder',
                                route: '/administration/versionMismatch',
                                icon: null,
                                enabled: roles.includes('toshibaAdmin')
                            },
                            {
                                name: 'Administrative Settings',
                                route: '/administration/toshibaAdminSettings',
                                enabled: roles.includes('toshibaAdmin')
                            },
                            {
                                name: 'User Management',
                                route: '/administration/userManagement',
                                enabled: roles.includes('toshibaAdmin')
                            },
                            {
                                id: 'pilotFollowup',
                                name: 'Pilot Follow-up',
                                route: '/',
                                enabled: false
                            }];
                        MenuItems[MenuItems.findIndex(x => x.id === 'administration')].items.push(...tmp)
                    }

                    if (MenuItems.some((x) => x.name === 'Administration') && roles.includes('commandCenterViewer')) {
                        tmp = {
                            name: 'Command Center Overview',
                            route: '/administration/commandCenterOverview',
                            enabled: roles.includes('commandCenterViewer'),
                            icon: <Image src={DumpsIcon} alt="DumpsIcon" />
                        };
                        MenuItems.push(tmp)
                    }
                    MenuItems.push({
                        id: 'about',
                        name: 'About PAS',
                        icon: <Image src={AboutIcon} alt="AboutIcon" />,
                        route: '/about',
                        enabled: true
                    });
                }
                MenuItems.forEach(menuItem => {
                    for (const item of menuItem.items ?? []) {
                        if (context.openedMenuItems.indexOf(menuItem.id) === -1) {
                            if (item.route === pathname && pathname !== '/') {
                                context.setOpenedMenuItems([...context.openedMenuItems, menuItem.id]);
                                break;
                            }
                        }
                    }
                });
                return MenuItems;
            }
            return null;
        }
        if (context) {
            setMenu(getSidebarItems())
        }
    }, [])

    const handleOpenItem = (id, isOpened) => {
        let indexOfOpened = context.openedMenuItems.indexOf(id);
        if (indexOfOpened === -1 && isOpened) {
            context.setOpenedMenuItems([...context.openedMenuItems, id]);

        } else if (indexOfOpened > -1 && !isOpened) {
            let tmp = [...context.openedMenuItems];
            tmp.splice(indexOfOpened, 1);
            context.setOpenedMenuItems(tmp);

        }
    };
    if (menu.length > 0) {
        return (
            <div>
                <List disablePadding dense sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                    {menu.map((sidebarItem, index) => (
                        <SidebarItem sidebarOpen={sidebarOpen} key={`${sidebarItem.id}${index}`} handleOpened={handleOpenItem} opened={context.openedMenuItems.indexOf(sidebarItem.id) > -1} handleDisabledFeatureClicked={handleDisabledFeatureClicked} handleNonDevelopedFeatureClicked={handleNonDevelopedFeatureClicked} {...sidebarItem} context={context} />
                    ))}
                </List>
            </div>
        );
    } else {
        return null;
    }
}
