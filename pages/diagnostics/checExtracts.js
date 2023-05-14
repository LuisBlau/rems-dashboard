/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React from 'react';
import Container from '@mui/material/Container';
import ExtractGrid from '../../components/Tables/ExtractGrid';
import Typography from '@mui/material/Typography';

const PREFIX = 'checExtracts';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    paper: `${PREFIX}-paper`,
    fixedHeight: `${PREFIX}-fixedHeight`,
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

export default function ChecExtracts() {
    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                Chec Extracts
            </Typography>
            <Container maxWidth="xl" className={classes.container}>
                <ExtractGrid height={400} />
            </Container>
        </Root>
    );
}
