/* eslint-disable no-fallthrough */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography } from '@mui/material';
import Copyright from '../../components/Copyright';
import { DeployTableNew } from '../../components/Tables/DeployTableNew';

const PREFIX = 'deploymentStatus';

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


export default function DeploymentStatus() {
    // Max number of records to pull from database. 0 = all records.
    // we need to paginate this page at some point, but not today.

    return (
        <Root className={classes.content}>
            <Container maxWidth="lg" className={classes.container}>
                <Typography
                    align="left"
                    variant="h3"
                    paddingLeft={3}
                    style={{
                        // fontFamily: 'Roboto',
                        fontSize: '36px',
                        fontWeight: 700,
                        lineHeight: '42px',
                        letterSpacing: '0em'
                    }}
                >
                    Deployment Status
                </Typography>
                <DeployTableNew />
                <Box pt={4}>
                    <Copyright />
                </Box>
            </Container>
        </Root>
    );
}
