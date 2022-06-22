import { createTheme, ThemeProvider, makeStyles, ThemeOptions } from '@mui/material/styles';
import React from "react";

const themeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#96405b',
      light: '#e0cdd3',
    },
    secondary: {
      main: '#7c70b3',
    },
    error: {
      main: '#ef2d1f',
    },
  },
};

// Create a theme instance.
/*const theme = createTheme( {
  
  palette: {
    type: 'dark',
    primary: {
      main: '#96405b',
      light: '#e0cdd3',
    },
    secondary: {
      main: '#7c70b3',
    },
    error: {
      main: '#ef2d1f',
    },
  },
  agent: {
    backgroundColor: 'gray'
  }
});*/

const theme = createTheme({
  type: 'dark',
  palette: {
    type: 'dark',
    primary: {
      main: '#FFFFFF',
    },
  },
});


export default theme;
