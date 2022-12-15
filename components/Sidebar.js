/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Link from 'next/link'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import HighlightIcon from '@mui/icons-material/Highlight'
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'
import BugReportIcon from '@mui/icons-material/BugReport'
import CarCrashIcon from '@mui/icons-material/CarCrash'
import OutputIcon from '@mui/icons-material/Output'
import UserContext from '../pages/UserContext'
import { AutoGraph, FileUpload } from '@mui/icons-material'

function SidebarItem ({ name, icon, route, items, depthStep = 12, depth = 0, ...rest }) {
  return (
    <>
      <Link key={name} href={route}>
        <ListItem button dense {...rest} >
          <ListItemIcon >{icon}</ListItemIcon>
          <ListItemText >
            {name}
          </ListItemText>
        </ListItem>
      </Link>
      {Array.isArray(items)
        ? (
          <List disablePadding dense>
            {items.map((subItem) => (
              <SidebarItem
                key={subItem.name}

                {...subItem}
              />
            ))}
          </List>
          )
        : null}
    </>
  )
}

function Sidebar () {
  const context = useContext(UserContext)
  function getSidebarItems () {
    const MenuItems = []
    if (!MenuItems.some(x => x.name === 'Enterprise Overview')) {
      MenuItems.push(
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
          id: 'overview',
          name: 'Enterprise Overview',
          route: '/store/connectionOverview',
          icon: <HighlightIcon />,
          roles: ['admin', 'user']
        }
      )
    }

    if (context.userRoles) {
      if ((context.userRoles.includes('admin') || context.userRoles.includes('devops')) && !MenuItems.some(x => x.id === 'softwareDeploy')) {
        MenuItems.push({
          id: 'softwareDeploy',
          name: 'Software Distribution',
          icon: <PendingActionsIcon />,
          route: '/deployStatus',
          roles: ['admin'],
          items: [
            {
              id: 'uploadFile',
              name: 'Upload a File',
              route: '/fileUpload',
              icon: <FileUpload />
            }, {
              id: 'deployConfig',
              name: 'Create Deploy Config',
              route: '/deployCreate',
              icon: <AddCircleOutline />
            }, {
              id: 'scheduleDeploy',
              name: 'Schedule a Deployment',
              route: '/deploySchedule',
              icon: <ScheduleIcon />
            }, {
              id: 'selectAgents',
              name: 'Select Agents',
              route: '/agentSelect',
              icon: <ImportantDevicesIcon />
            }
          ]
        })
      }
    }

    if (!MenuItems.some(x => x.name === 'SNMP')) {
      MenuItems.push({
        name: 'SNMP',
        route: '/snmp',
        icon: <SystemUpdateAltIcon />
      }
      )
    }

    if (context.userRoles) {
      if ((context.userRoles.includes('admin') || context.userRoles.includes('support')) && !MenuItems.some(x => x.id === 'Doc Collection')) {
        MenuItems.push(
          {
            id: 'Doc Collection',
            name: 'Doc Collection',
            route: '/store/captureTable',
            icon: <BugReportIcon />,
            roles: ['admin'],
            items: [

              {
                id: 'dumps',
                name: 'Dumps',
                route: '/store/dumpTable',
                icon: <CarCrashIcon />
              }, {
                id: 'extracts',
                name: 'Chec Extracts',
                route: '/store/extractTable',
                icon: <OutputIcon />
              }, {
                id: 'dataCapture',
                name: 'DataCapture',
                route: '/registers/ExtractRequest',
                icon: <CloudDownloadIcon />
              }
            ]
          }
        )
      }
    }

    if (context.userRoles) {
      if ((context.userRoles.includes('demo') && !MenuItems.some(x => x.id === 'Elera Stats'))) {
        MenuItems.push(
          {
            id: 'eleraStats',
            name: 'Elera Stats',
            route: '/eleraStats',
            icon: <AutoGraph />
          }
        )
      }
    }
    return MenuItems
  }

  return (
    <div className="sidebar" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
      <List disablePadding dense>
        {getSidebarItems().map((sidebarItem, index) => (
          <SidebarItem
            key={`${sidebarItem.id}${index}`}
            {...sidebarItem}
          />
        ))}
      </List>
    </div>
  )
}

export default Sidebar
