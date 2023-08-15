/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CaptureGrid from '../../components/Tables/CaptureGrid';
import Typography from '@mui/material/Typography';
import Copyright from '../../components/Copyright';

const PREFIX = 'docCollection';

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

export default function DocCollection() {
    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h4">
                Data Captures
            </Typography>
            <Container maxWidth="xl" className={classes.container}>
                <CaptureGrid height={'50vh'}/>
            </Container>
            <Box>
                <Copyright />
            </Box>
        </Root>
    );
}
