import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemSecondaryAction } from '@mui/material';
import Link from "next/link";
import { ThemeProvider, createTheme } from '@mui/material/styles';
/*
const sidebarTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d2d2d2',
      light: '#e0cdd3',
    },
    secondary: {
      main: '#7c70b3',
    },
    error: {
      main: '#ef2d1f',
    },
    background: {
      default: '#202020',
      paper: '#484848',
    },
    text: {
      primary: 'rgba(214,211,211,0.87)',
      secondary: 'rgba(210,208,208,0.54)',
      disabled: 'rgba(121,120,120,0.38)',
      hint: 'rgba(251,251,251,0.38)',
    },
  }
})
*/

import axios from 'axios';

function SidebarItem({ name, icon, route, items, depthStep = 12, depth = 0, ...rest }) {
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
        {Array.isArray(items) ? (
          <List disablePadding dense>
            {items.map((subItem) => (
              <SidebarItem
                key={subItem.name}
                
                {...subItem}
              />
            ))}
          </List>
        ) : null}
      </>
    )
  }

  function checkRole(item) {

    const [role, setRole] = useState(null);
    if(role === null) {
      axios.get("/api/REMS/getRoleDetails?email=brent.shores@toshibagcs.com").then((resp) => {
        if(resp.data) {
            setRole(resp.data.role);
        }
      });
    }
    
    return item.roles.indexOf(role) !== -1;
  }
  
  function Sidebar({ items, depthStep, depth }) {

    

    return (
      //<ThemeProvider theme={sidebarTheme}>
        <div className="sidebar" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <List disablePadding dense>
          {items.map((sidebarItem, index) => (
            <SidebarItem
              key={`${sidebarItem.id}${index}`}
              
              {...sidebarItem}
            />
          ))}
        </List>
      </div>
      //</ThemeProvider>
    )
  }

export default Sidebar