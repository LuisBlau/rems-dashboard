import React from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#96405b',
      dark: '#e0cdd3',
    },
    secondary: {
      main: '#7c70b3',
    },
    error: {
      main: '#ef2d1f',
    }
  },
})

export default theme;