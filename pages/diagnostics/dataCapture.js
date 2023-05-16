import { styled } from '@mui/material/styles';
import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import ExtractRequestGrid from '../../components/Tables/ExtractRequestGrid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import UserContext from '../../pages/UserContext'
import { useState } from 'react';
import { useEffect } from 'react';
const PREFIX = 'dataCapture';

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
        paddingBottom: 4,
    },
}));

export default function DataCapture() {
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')

    useEffect(() => {
        if (context) {
            setSelectedRetailer(context.selectedRetailer)
        }
    }, [context])

    const cookies = new Cookies();
    const retailerId = cookies.get('retailerId');
    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                Trigger Data Capture
            </Typography>
            <Button
                style={{ float: 'right', marginRight: 60, padding: 10 }}
                variant="contained"
                onClick={() => {
                    axios.post('/api/registers/requestRemsDump', { retailer: retailerId, dataCapture: 'REMS' });
                }}
            >
                Create Rems Data Capture
            </Button>
            <Container className={classes.container}>
                <ExtractRequestGrid selectedRetailer={selectedRetailer} />
            </Container>
        </Root>
    );
}
