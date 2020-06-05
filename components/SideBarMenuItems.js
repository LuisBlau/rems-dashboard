import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import Storage from "@material-ui/icons/Storage";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';

import Link from "next/link";

const MenuItems = [
  {
    name: "Dashboard",
    route: "/",
    icon: <DashboardIcon/>
  },
  {
    name: "Store Release Levels",
    route: "/store/releaseOverview",
    icon: <SystemUpdateAltIcon/>,
  },
  {
    name: "Store Connection",
    route: "/store/connectionOverview",
    icon: <SettingsInputComponentIcon/>,
  },
  {
    name: "SCO Drive Use",
    route: "/controller/lowMemoryOverview",
    icon: <Storage/>,
  },
  {
    name: "VPD Info",
    route: "/controller/vpdOverview",
    icon: <NetworkCheckIcon/>,
  },
];

export const SideBarMenuItems = (
  <div>
    {MenuItems.map((item) => {
      return (
        <Link href={item.route}>
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name}/>
          </ListItem>
        </Link>
      );
    })}
  </div>
);
