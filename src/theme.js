import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
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
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
