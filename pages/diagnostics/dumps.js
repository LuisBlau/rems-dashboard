/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React from 'react';
import Container from '@mui/material/Container';
import DumpGrid from '../../components/Tables/DumpGrid';
import Typography from '@mui/material/Typography';
const PREFIX = 'dumps';

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

export default function Dumps() {
    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                TCx Sky Dumps
            </Typography>
            <Container maxWidth="xl" className={classes.container}>
                <DumpGrid height={400} />
            </Container>
        </Root>
    );
}
