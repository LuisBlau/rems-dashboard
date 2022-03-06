import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import Storage from "@mui/icons-material/Storage";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import Visibility from "@mui/icons-material/Visibility";
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import Link from "next/link";
import PublishIcon from '@mui/icons-material/Publish';
import ListItemButton from '@mui/material/ListItemButton';
import ScheduleIcon from '@mui/material/Schedule'

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
        icon: <BackupOutlinedIcon />
    }, {
        name: "Dumps",
        route: "/store/dumpTable",
        icon: <CloudDownloadIcon />
    }, {
        name: "FileUpload",
        route: "/fileUpload",
        icon: <PublishIcon />
    }, {
        name: "Schedule Deployment ",
        route: "/deploySchedule",
        icon: <ScheduleIcon />
    }, {
        name: "DeployStatus",
        route: "/deployStatus",
        icon: <PendingActionsIcon />
    }
];

export const SideBarMenuItems = (
    <div>
        {MenuItems.map((item) => {
            return (
                <Link href={item.route}>
                    <ListItemButton key={item.name}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}>
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}>
                            {item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </Link>
            );
        })}
    </div>
);
