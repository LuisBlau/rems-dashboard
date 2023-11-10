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
            if (items.length === 0) {
                return null
            }
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
                                <SidebarItem opened={context.openedMenuItems.indexOf(subItem.id) > -1} handleOpened={handleOpened} sidebarOpen={sidebarOpen} key={subItem.name} {...subItem} sub={true} handleDisabledFeatureClicked={handleDisabledFeatureClicked} handleNonDevelopedFeatureClicked={handleNonDevelopedFeatureClicked} context={context} />
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

export default function Sidebar({ handleDisabledFeatureClicked, handleNonDevelopedFeatureClicked, pasSubscriptionTier, sidebarOpen, alertsEnabled }) {
    const context = useContext(UserContext);
    const { pathname } = useRouter();
    const [menu, setMenu] = useState([]);


    useEffect(() => {
        function getSidebarItems() {
            const MenuItems = [];
            if (context) {
                // instead of using context.userRoles to check for pas advanced, 
                // check context.userRetailers array and check those for which permission to use

                if (context.userRoles && context.sidebarConfigs?.length > 0) {
                    const roles = context.userRoles
                    let tmp = {}
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarEnterpriseOverview' && x.value === true)) {
                        tmp = {
                            id: 'overview',
                            name: 'Enterprise Overview',
                            route: '/enterpriseOverview',
                            icon: <Image src={EnterpriseOverviewIcon} alt="EnterpriseOverviewIcon" />,
                            enabled: true
                        };
                        MenuItems.push(tmp);
                    }
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarSystemReporting' && x.value === true)) {
                        tmp = {
                            id: 'systemReporting',
                            name: 'System Reporting',
                            icon: <Image src={AssetInventoryIcon} alt="AssetInventoryIcon" />,
                            enabled: true,
                            items: []
                        };
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarAssetInventory' && x.value === true)) {
                            tmp.items.push({
                                id: 'assetInventory',
                                name: 'Asset Inventory',
                                route: '/systemReporting/tableauReportViewer?reportName=assetInventory&env=prod',
                                enabled: true
                            })
                        }
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarAlerts' && x.value === true)) {
                            tmp.items.push({
                                id: 'alerts',
                                name: 'Alerts',
                                route: '/systemReporting/alerts',
                                enabled: alertsEnabled
                            })
                        }
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarEvents' && x.value === true)) {
                            tmp.items.push({
                                id: 'systemEvents',
                                name: 'Events',
                                route: '/systemReporting/tableauReportViewer?reportName=systemEvents&env=prod',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarEventQuery' && x.value === true)) {
                            tmp.items.push({
                                id: 'eventQuery',
                                name: 'Event Query',
                                route: '/systemReporting/tableauReportViewer?reportName=eventQuery&env=prod',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarReloadTrends' && x.value === true)) {
                            tmp.items.push({
                                id: 'reloadTrends',
                                name: 'Reload Trends',
                                route: '/systemReporting/tableauReportViewer?reportName=registerReloads&env=prod',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarChecExtracts' && x.value === true)) {
                            tmp.items.push({
                                id: 'checkExtractAnalysis',
                                name: 'CHEC Extract Analysis',
                                route: '/systemReporting/tableauReportViewer?reportName=extracts&env=prod',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarSoftwareVersions' && x.value === true)) {
                            tmp.items.push({
                                id: 'softwareVersions',
                                name: 'Software Versions',
                                route: '/systemReporting/tableauReportViewer?reportName=softwareVersions&env=prod',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        MenuItems.push(tmp)
                    }

                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarIncidents' && x.value === true)) {
                        let enableIncidents = false
                        if (context.userRetailers) {
                            context.userRetailers.forEach(retailer => {
                                if (_.includes(retailer, "T0BF3K9")) {
                                    // temporarily only enabled for BJs
                                    enableIncidents = true
                                }
                            });
                        }
                        tmp = {
                            id: 'incidents',
                            name: 'Incidents',
                            route: '/systemReporting/tableauReportViewer?reportName=incidents&env=prod',
                            enabled: enableIncidents,
                            icon: <Image src={DataCaptureIcon} alt="DataCaptureIcon" />

                        };
                        MenuItems.push(tmp)
                    }
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarOperationReporting' && x.value === true)) {
                        tmp = {
                            id: 'operationalReporting',
                            name: 'Operational Reporting',
                            icon: <Image src={DocCollectionIcon} alt="DocCollectionIcon" />,
                            enabled: pasSubscriptionTier === 'advanced',
                            items: []
                        };
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarStoreClose')) {
                            tmp.items.push({
                                id: 'storeClose',
                                name: 'Store Close',
                                route: '/systemReporting/tableauReportViewer?reportName=storeClose&env=prod',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        MenuItems.push(tmp);
                    }
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarRemoteSoftwareMaintenance' && x.value === true)) {
                        tmp = {
                            id: 'remote-software-maintenance',
                            name: 'Remote Software Maintenance',
                            icon: <Image src={SoftwareDistributionIcon} alt="RemoteDiagnosticsIcon" />,
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
                            ]
                        };
                        if (_.some(context.sidebarConfigs, x => x.name === 'sidebarRemoteDiagnostics' && x.value === true)) {
                            tmp.items.push({
                                id: 'remote-diagnostics',
                                name: 'Remote Diagnostics',
                                route: '/diagnostics',
                                enabled: pasSubscriptionTier === 'advanced'
                            })
                        }
                        MenuItems.push(tmp);
                    }
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarAdministration' && x.value === true)) {
                        if (!MenuItems.some((x) => x.name === 'Administration')) {
                            tmp = {
                                id: 'administration',
                                name: 'Administration',
                                icon: <Image src={AdminIcon} alt="AdminIcon" />,
                                enabled: true,
                                items: []
                            };

                            if (_.some(context.sidebarConfigs, x => x.name === 'sidebarSnmp' && x.value === true)) {
                                tmp.items.push(
                                    {
                                        name: 'SNMP',
                                        route: '/administration/snmp',
                                        icon: <Image src={SnmpIcon} alt="SNMPIcon" />,
                                        enabled: pasSubscriptionTier === 'advanced'
                                    }
                                )
                            }
                            if (_.some(context.sidebarConfigs, x => x.name === 'sidebarVersionOverview' && x.value === true)) {
                                tmp.items.push(
                                    {
                                        name: 'Version Overview',
                                        route: '/administration/versionOverview',
                                        icon: null,
                                        enabled: pasSubscriptionTier === 'advanced'
                                    }
                                )
                            }
                            tmp.items.push(
                                {
                                    name: 'Retailer Settings',
                                    route: '/administration/retailerSettings',
                                    enabled: true
                                }
                            )
                            if (_.some(context.sidebarConfigs, x => x.name === 'sidebarUserSettings' && x.value === true)) {
                                tmp.items.push(
                                    {
                                        name: 'User Settings',
                                        route: '/administration/userSettings',
                                        enabled: true
                                    }
                                )
                            }
                            MenuItems.push(tmp);
                        }
                    }

                    if (MenuItems.some((x) => x.name === 'Administration') && roles.includes('toshibaAdmin')) {
                        tmp = [
                            {
                                name: 'Version Mismatch Finder',
                                route: '/administration/versionMismatch',
                                icon: null,
                                enabled: roles.includes('toshibaAdmin')
                            },
                            {
                                name: 'REMS Management',
                                route: '/administration/remsManagement',
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
                        tmp = [{
                            name: 'Command Center Overview',
                            route: '/administration/commandCenterOverview',
                            enabled: roles.includes('commandCenterViewer'),
                            icon: <Image src={DumpsIcon} alt="DumpsIcon" />
                        },
                        {
                            id: 'kpiReporting',
                            name: "PAS KPI Reporting",
                            items: [
                                {
                                    id: 'externalKpiReports',
                                    name: 'External KPI Reports',
                                    route: 'https://toshibagcs.service-now.com/now/nav/ui/classic/params/target/%24pa_dashboard.do%3Fsysparm_dashboard%3De35962441bc57910641821b6b04bcbc3',
                                    enabled: true
                                },
                                {
                                    id: 'internalKpiReports',
                                    name: 'Internal KPI Reports',
                                    route: 'https://toshibagcs.service-now.com/now/nav/ui/classic/params/target/%24pa_dashboard.do%3Fsysparm_dashboard%3D66503dd497d9b5d090b6b9a3f153af91',
                                    enabled: true
                                },
                                {
                                    id: 'posHardware',
                                    name: 'POS Hardware',
                                    route: 'https://toshibagcs.service-now.com/now/nav/ui/classic/params/target/%24pa_dashboard.do%3Fsysparm_dashboard%3Dae1aefff47f979104cd2eb68536d4394',
                                    enabled: true
                                },
                                {
                                    id: 'w2wHardware',
                                    name: 'W2W Hardware',
                                    route: 'https://toshibagcs.service-now.com/now/nav/ui/classic/params/target/%24pa_dashboard.do%3Fsysparm_dashboard%3D8cdc591047027d104cd2eb68536d4348',
                                    enabled: true
                                },
                                {
                                    id: 'eventsInternalTableau',
                                    name: 'Events',
                                    route: 'https://analytics.toshiba-solutions.com/#/site/TGCS/views/TotalMonthlyEventCountRolling-12Months_16989698808830/MonthlyeventcountReport?:iid=1',
                                    enabled: true
                                }
                            ]
                        }]
                        MenuItems[MenuItems.findIndex(x => x.id === 'administration')].items.push(...tmp);
                        MenuItems.push(tmp)
                    }
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarClientAdvocate' && x.value === true)) {
                        tmp = {
                            id: 'clientAdvocate',
                            name: 'Client Advocate',
                            icon: <Image src={ChecExtractsIcon} alt="ClientAdvocateIcon" />,
                            enabled: true,
                            items: [
                                {
                                    id: 'caReport1',
                                    name: 'Closed Call Data',
                                    route: '/systemReporting/tableauReportViewer?reportName=closedCallData&env=staging',
                                    enabled: true
                                },
                                {
                                    id: 'caReport2',
                                    name: 'Parts Usage Data',
                                    route: '/systemReporting/tableauReportViewer?reportName=partsUsageData&env=staging',
                                    enabled: true
                                },
                                {
                                    id: 'caReport3',
                                    name: 'Report 3',
                                    route: '/',
                                    enabled: false
                                }
                            ]
                        };
                        MenuItems.push(tmp)
                    }
                    if (_.some(context.sidebarConfigs, x => x.name === 'sidebarSales' && x.value === true)) {
                        tmp = {
                            id: 'sales',
                            name: 'Sales',
                            icon: <Image src={DumpsIcon} alt="SalesIcon" />,
                            enabled: true,
                            items: [
                                {
                                    id: 'sales1',
                                    name: 'Architecture',
                                    route: '/sales/architecture',
                                    enabled: true
                                },
                                {
                                    id: 'sales2',
                                    name: 'Command Center',
                                    route: '/sales/commandCenterImage',
                                    enabled: true
                                },
                                {
                                    id: 'sales3',
                                    name: 'Stats',
                                    route: '/sales/pasStatistics',
                                    enabled: true
                                },
                                {
                                    id: 'sales4',
                                    name: 'Sales Collateral',
                                    route: 'https://tgcs04.toshibacommerce.com/cs/groups/marketing/documents/document/cmvm/zxjl/~edisp/pascollateralreference.pdf',
                                    enabled: true
                                }
                            ]
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
