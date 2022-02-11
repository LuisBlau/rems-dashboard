import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import SettingsInputComponentIcon from "@material-ui/icons/SettingsInputComponent";
import Storage from "@material-ui/icons/Storage";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import Visibility from "@material-ui/icons/Visibility";
import NetworkCheckIcon from '@material-ui/icons/NetworkCheck';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import Link from "next/link";
import PublishIcon from '@material-ui/icons/Publish';
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
  }, */ {
    name: "Extracts",
    route: "/store/extractTable",
    icon: <BackupOutlinedIcon/>
  }, {
    name: "Dumps",
    route: "/store/dumpTable",
    icon: <CloudDownloadIcon/>
  }, { 
    name: "FileUpload",
    route: "/fileUpload",
    icon: <PublishIcon/>
  }
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
