import React from 'react'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemSecondaryAction } from '@mui/material';
import Link from "next/link";

function SidebarItem({ name, icon, route, items, ...rest }) {
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
  
  function Sidebar({ items}) {
    return (
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
    )
  }

export default Sidebar