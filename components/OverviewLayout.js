/* eslint-disable react/prop-types */
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import React from 'react';
import Copyright from './Copyright';
const PREFIX = 'OverviewLayout';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

export default function OverviewLayout(props) {
    return (
        <Root className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    {props.children}
                </Grid>
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
