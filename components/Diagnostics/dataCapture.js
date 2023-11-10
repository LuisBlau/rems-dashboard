import { styled } from '@mui/material/styles';
import React, { useContext } from 'react';
import Container from '@mui/material/Container';
import ExtractRequestGrid from '../../components/Tables/ExtractRequestGrid';
import Typography from '@mui/material/Typography';
import UserContext from '../../pages/UserContext'
import { useState } from 'react';
import { useEffect } from 'react';
import Copyright from '../../components/Copyright';
import RemsDataCaptureGrid from '../Tables/RemsDataCaptureGrid';
import _ from 'lodash';
const PREFIX = 'dataCapture';

const classes = {
    content: `${PREFIX}-content`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        height: '80vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }
}));

export default function DataCapture() {
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [selectedRetailerIsNotTenant, setSelectedRetailerIsNotTenant] = useState(false)
    const [remsDataCaptureEnabled, setRemsDataCaptureEnabled] = useState(false)

    useEffect(() => {
        if (context) {
            if (context.selectedRetailerIsTenant === false) {
                setSelectedRetailer(context.selectedRetailer)
                setSelectedRetailerIsNotTenant(true)
            } else {
                setSelectedRetailer(context.selectedRetailerParentRemsServerId)
            }
        }
    }, [context])

    useEffect(() => {
        if (selectedRetailerIsNotTenant === true || _.includes(context.userRoles, 'toshibaAdmin')) {
            setRemsDataCaptureEnabled(true)
        }
    }, [selectedRetailerIsNotTenant, context.userRoles])

    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h4" marginBottom={1}>
                Trigger Data Capture
            </Typography>
            {remsDataCaptureEnabled &&
                <Container sx={{ display: 'flex', flexGrow: 1, paddingBottom: 2 }}>
                    <RemsDataCaptureGrid selectedretailer={selectedRetailer} />
                </Container>
            }

            <Container sx={{ display: 'flex', flexGrow: 2 }}>
                <ExtractRequestGrid selectedRetailer={selectedRetailer} />
            </Container>
            <Copyright />
        </Root>
    );
}
