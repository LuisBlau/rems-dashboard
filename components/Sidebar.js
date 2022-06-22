import React from 'react'
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemSecondaryAction } from '@mui/material';
import Link from "next/link";

function SidebarItem({ name, icon, route, items, depthStep = 12, depth = 0, ...rest }) {
    return (
      <>
        <Link key={name} href={route}>
        <ListItem button dense {...rest} >
          <ListItemIcon style={{ paddingLeft: depth * depthStep }}>{icon}</ListItemIcon>
          <ListItemText style={{ paddingLeft: depth * depthStep }}>
            <span>{name}</span>
          </ListItemText>
        </ListItem>
        </Link>
        {Array.isArray(items) ? (
          <List disablePadding dense>
            {items.map((subItem) => (
              <SidebarItem
                key={subItem.name}
                depth={depth + 1}
                depthStep={depthStep}
                {...subItem}
              />
            ))}
          </List>
        ) : null}
      </>
    )
  }
  
  function Sidebar({ items, depthStep, depth }) {
    return (
      <div className="sidebar">
        <List disablePadding dense>
          {items.map((sidebarItem, index) => (
            <SidebarItem
              key={`${sidebarItem.id}${index}`}
              depthStep={depthStep}
              depth={depth}
              {...sidebarItem}
            />
          ))}
        </List>
      </div>
    )
  }

export default Sidebar