import { createTheme } from '@mui/material/styles';

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
});

export default theme;
