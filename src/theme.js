import React from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#484848',
      contrastText: '#e4e4e4',
    },
    secondary: {
      main: '#7c70b3',
    },
    error: {
      main: '#ef2d1f',
    },
    background: {
      default: '#f3f2f2',
    },
  },
  components: {
    // Override the main app bar.
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#484848",
          contrastText: '#e4e4e4',
          // text color...
          color: '#e4e4e4',
        }
      }
    },
    // Override sidebar blankspace.
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#484848",
          color: '#e4e4e4',
        }
      }
    },
    // Override side bar items. Not including buttons
    MuiListItem: {
      styleOverrides: {
        root: {
          background: "#484848",
          color: '#e4e4e4',
        }
      }
    },
    // Override side bar buttons/icons.
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          background: "#484848",
          color: '#e4e4e4',
        }
      }
    },
    // Override buttons.
    MuiButton: {
      styleOverrides: {
        root: {
          //button color
          background:"#e4e4e4",
          //text color
          color: '#484848',
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          //button color
          background:"#e4e4e4",
          //text color
          color: '#484848',
        }
      }
    },
  }
})

export default theme;

