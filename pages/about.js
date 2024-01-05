/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Popover, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AvailableIcon from '../public/icons/ok.png';
import Image from 'next/image';
import Copyright from '../components/Copyright'
import ComingSoonImage from '../public/images/coming-soon.png'
import axios from 'axios';
import { useState } from 'react';
import _ from 'lodash';

const PREFIX = 'about';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#373839',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100vh',
        backgroundColor: '#FFFFFF',
    }
}));

function createData(name, pasLite, pasAdvanced, pasPremium, underConstruction, featureKey, featureDescription) {
    return { name, pasLite, pasAdvanced, pasPremium, underConstruction, featureKey, featureDescription };
}

export default function About() {
    const [descriptions, setDescriptions] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState('')
    const [features, setFeatures] = useState([]);

    const handlePopoverOpen = (event, featureName) => {
        setAnchorEl(event.currentTarget)
        setOpen(featureName)
    };

    const handlePopoverClose = () => {
        setOpen('')
        setAnchorEl(null);
    };

    useEffect(() => {
        axios.get('/api/REMS/toshibaConfiguration').then((resp) => {
            const tempDescriptions = []
            if (resp.data) {
                const data = resp.data['configuration']
                data.forEach(config => {
                    if ((Object.values(config)[0].configDisplay).includes('Description')) {
                        const temp = []
                        temp.push(Object.values(config)[0].configName)
                        temp.push(Object.values(config)[0].configValue)
                        tempDescriptions.push(temp)
                    }
                });
            }
            setDescriptions(tempDescriptions)
        });
    }, [])

    useEffect(() => {
        const tempFeatures = []
        if (descriptions.length > 0 && features.length === 0) {
            tempFeatures.push(createData('Enterprise Overview', 'X', 'X', 'X', false, 'enterpriseOverview', _.find(descriptions, x => x.includes('enterpriseOverview'))[1]),
                createData('Asset Management', 'X', 'X', 'X', false, 'assetManagement', _.find(descriptions, x => x.includes('assetManagement'))[1]),
                createData('Retailer Administration', 'X', 'X', 'X', false, 'retailerAdministration', _.find(descriptions, x => x.includes('retailerAdministration'))[1]),
                createData('Alerts', 'X', 'X', 'X', false, 'alerts', _.find(descriptions, x => x.includes('alerts'))[1]),
                createData('Store Overview', '', 'X', 'X', false, 'storeOverview', _.find(descriptions, x => x.includes('storeOverview'))[1]),
                createData('Events Catalog', '', 'X', 'X', false, 'eventsCatalog', _.find(descriptions, x => x.includes('eventsCatalog'))[1]),
                // createData('Reload Trends', '', 'X', 'X', false, 'reloadTrends', _.find(descriptions, x => x.includes('reloadTrends'))[1]),
                createData('CHEC Extract Analysis', '', 'X', 'X', false, 'checExtractAnalysis', _.find(descriptions, x => x.includes('checExtractAnalysis'))[1]),
                createData('Store Close Procedure Report', '', 'X', 'X', false, 'storeCloseProcedureReport', _.find(descriptions, x => x.includes('storeCloseProcedureReport'))[1]),
                createData('Dumps / Extracts Collection', '', 'X', 'X', false, 'dumpExtractCollection', _.find(descriptions, x => x.includes('dumpExtractCollection'))[1]),
                createData('Apply Software Maintenance (ASM)', '', 'X', 'X', false, 'applySoftwareMaintenance', _.find(descriptions, x => x.includes('applySoftwareMaintenance'))[1]),
                createData('Machine Learning Models', '', 'X', 'X', false, 'machineLearningModels', _.find(descriptions, x => x.includes('machineLearningModels'))[1])),
                // createData('Embedded Client Success', '', '', 'X', false, 'embeddedClientSuccess', _.find(descriptions, x => x.includes('embeddedClientSuccess'))[1]),
                // createData('Cloud Monitoring', '', '', 'X', true),
                // createData('Retailer Comparison', '', '', 'X', true),
                // createData('Mobile', '', '', 'X', true))

                setFeatures(tempFeatures)
        }
    }, [descriptions])

    return (
        <Root className={classes.content}>
            <Typography sx={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 32, padding: 2 }}>PAS Offerings</Typography>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <TableContainer sx={{ margin: 6 }} component={Paper}>
                    <Table sx={{ minWidth: 400 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                                        Feature Name
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 20 }} align="center">
                                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                                        PAS Lite
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell sx={{ fontSize: 20 }} align="center">
                                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                                        PAS Advanced
                                    </Typography>
                                </StyledTableCell>
                                {/* <StyledTableCell sx={{ fontSize: 20 }} align="center">
                                    <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
                                        PAS Premium
                                    </Typography>
                                </StyledTableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {features.map((feature) => (
                                <StyledTableRow key={feature.name}>
                                    <Popover
                                        id={feature.name + '-popover'}
                                        sx={{
                                            pointerEvents: 'none',
                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={feature.featureKey === open}
                                        anchorEl={anchorEl}
                                        disableRestoreFocus
                                        onClose={handlePopoverClose}>
                                        <Paper elevation={10} sx={{ height: 'fit-content', maxWidth: 500 }}>
                                            <Typography sx={{ fontSize: 14, padding: 1 }}>{feature.featureDescription}</Typography>
                                        </Paper>
                                    </Popover>
                                    <StyledTableCell sx={{}} component="th" scope="row">
                                        {
                                            feature.underConstruction === false ?
                                                <Typography
                                                    aria-owns={open ? 'mouse-over-popover' : undefined}
                                                    aria-haspopup="true"
                                                    onMouseEnter={(e) => handlePopoverOpen(e, feature.featureKey)}
                                                    onMouseLeave={handlePopoverClose}
                                                    sx={{ width: 'fit-content', fontSize: 15, fontWeight: 'bold' }}>
                                                    {feature.name}
                                                </Typography>
                                                :
                                                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                    <Typography sx={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center' }}>{feature.name}</Typography>
                                                    <Image src={ComingSoonImage} alt="ComingSoonImage" />
                                                </Box>
                                        }
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{feature.pasLite === 'X' ? <Image src={AvailableIcon} alt="AvailableIcon" /> : null}</StyledTableCell>
                                    <StyledTableCell align="center">{feature.pasAdvanced === 'X' ? <Image src={AvailableIcon} alt="AvailableIcon" /> : null}</StyledTableCell>
                                    {/* <StyledTableCell align="center">{feature.pasPremium === 'X' ? <Image src={AvailableIcon} alt="AvailableIcon" /> : null}</StyledTableCell> */}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Copyright />
        </Root>
    );
}
