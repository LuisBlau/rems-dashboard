import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';


// Create a theme instance.
const theme = createTheme( {
  overrides: {
    MuiLinearProgress: {
      root: {
        height: 7,
        borderRadius: 100
      }
    }
  },
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#D6556C",
    },
    a: {
      textDecoration: "none",
    },
    error: {
      main: "#fc0f03",
    },
    background: {
      default: "#fff",
    },
  },
  agent: {
    backgroundColor: 'gray'
  }
});

export default theme;
