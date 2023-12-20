/* eslint-disable react/prop-types */
import React, { } from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
const PREFIX = 'landing';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        overflow: 'hidden',
    },
}));

const ImageRenderer = ({ src, path, title, handleClick, enabled }) => {
    let url = ''
    const interceptor = (e) => {
        if (handleClick) {
            e.preventDefault();
            handleClick();
            window.open(url, '_self');
        }
    };

    let bgc = '#8E9092'
    if (enabled !== false) {
        bgc = '#ffffff'
        url = process.env.NEXT_PUBLIC_REDIRECT + path;
    }

    return (
        <Link href={url}>
            <Grid container justifyContent={'center'} sx={{ cursor: 'pointer' }} onClick={(e) => interceptor(e)}>
                <Card elevation={5} sx={{ backgroundColor: bgc, padding: 3, height: 275, width: 250 }}>
                    <Grid item container xs={12} justifyContent={'center'}>
                        <Image src={src} height={180} width={180} />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center', pt: 1 }}>
                        <Typography color={'#000000'} variant="h5" flexWrap={true}>
                            {title}
                        </Typography>
                    </Grid>
                </Card>
            </Grid>
        </Link>
    );
};

const PageHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    background: '#373839',
}));

const NewWindowImageRenderer = ({ src, path, title, enabled }) => {
    let interceptor = (e) => {
        console.log('access denied')
    };

    let bgc = '#8E9092'
    if (enabled !== false) {
        bgc = '#ffffff'
        interceptor = (e) => {
            window.open(path, '_blank');
        }
    }

    return (
        <Grid container justifyContent={'center'} sx={{ cursor: 'pointer' }} onClick={(e) => interceptor(e)}>
            <Card elevation={5} sx={{ backgroundColor: bgc, padding: 3, height: 275, width: 250 }}>
                <Grid item container xs={12} justifyContent={'center'}>
                    <Image src={src} height={180} width={180} />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center', pt: 1 }}>
                    <Typography color={'#000000'} variant="h5">
                        {title}
                    </Typography>
                </Grid>
            </Card>
        </Grid>
    );
};

ImageRenderer.propTypes = {
    src: PropTypes.string.isRequired,
    path: PropTypes.string,
    handleClick: PropTypes.func,
    title: PropTypes.string.isRequired,
};

export default function Landing() {

    return (
        <Root className={classes.content}>
            <PageHeader>
                <Typography
                    sx={{ font: 'impact', fontWeight: 'bold', fontSize: 30, color: '#FFFFFF', marginRight: 15 }}
                >
                    Proactive Availability Services
                </Typography>
            </PageHeader>
            <Container maxWidth="lg" className={classes.container}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexGrow: 0.4,
                            margin: 3,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ width: 300, height: 250 }}>
                            <ImageRenderer
                                src={'/Asset Inventory.png'}
                                path={'/systemReporting/tableauReportViewer?reportName=assetInventory&env=prod'}
                                title={'Asset Inventory'}
                            />
                        </Box>
                        <Box sx={{ width: 300, height: 250 }}>
                            <ImageRenderer
                                src={'/Enterprise Availability.png'}
                                path={'/enterpriseOverview'}
                                title={'Enterprise Overview'}
                            />
                        </Box>
                        <Box sx={{ width: 300, height: 250 }}>
                            <ImageRenderer
                                src={'/APM.png'}
                                path={'/needsRehoming/eleraStats'}
                                title={'Application Monitoring'}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexGrow: 0.4,
                            margin: 3,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ width: 300, height: 250 }}>
                            <ImageRenderer
                                src={'/Health Automation.png'}
                                path={'/systemReporting/tableauReportViewer?reportName=systemEvents&env=prod'}
                                title={'Events'}
                            />
                        </Box>
                        <Box sx={{ width: 300, height: 250 }}>
                            <ImageRenderer
                                src={'/Remote Diagnostics.png'}
                                path={'/storeOverview?storeName=PAS%20NRF&retailer_id=TPASDEMO'}
                                title={'Remote Diagnostics'}
                            />
                        </Box>
                        <Box sx={{ width: 300, height: 250 }}>
                            <NewWindowImageRenderer
                                src={'/Service Enablement.png'}
                                path={
                                    'https://toshibatagstest.service-now.com/now/nav/ui/classic/params/target/%24pa_dashboard.do%3Fsysparm_dashboard%3D00f59a9e1b465d5038587599cc4bcbc2'
                                }
                                title={'Service Enablement'}
                            />
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Root>
    );
}
