/* eslint-disable no-unused-vars */
import VersionGrid from '../../components/Tables/VersionGrid';
import { styled } from '@mui/material/styles';
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
const PREFIX = 'versionMismatch';

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

export default function versionMismatch() {
    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                Versions
            </Typography>
            <Container className={classes.container}>
                <VersionGrid height={400} />
            </Container>
        </Root>
    );
}
