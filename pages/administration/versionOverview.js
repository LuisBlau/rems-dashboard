/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import UserContext from '../../pages/UserContext'

const PREFIX = 'versionOverview';

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
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(5),
    },
}));

export default function versionOverview() {
    const [agents, setAgents] = useState([]);
    const [rem, setRem] = useState({});
    const columns = [
        { field: 'storeName', headerName: 'Store', sortable: true, flex: 1 },
        { field: 'agentName', headerName: 'Agent', sortable: true, flex: 1 },
        { field: 'rma', headerName: 'RMA version', sortable: true, flex: 1 },
        { field: 'pas', headerName: 'PAS extension', sortable: true, flex: 1 }
    ];
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')

    useEffect(() => {
        if (context) {
            setSelectedRetailer(context.selectedRetailer)
        }
    }, [context])

    useEffect(() => {
        if (selectedRetailer && selectedRetailer !== '') {
            let url = `/api/REMS/versionsData?retailer_id=${selectedRetailer}`;
            axios.get(url).then((x) => {
                setRem(x.data.rem);
                setAgents(x.data.agents.map((agent) => ({
                    ...agent,
                    id: agent._id
                })));
            });
        }
    }, [selectedRetailer]);

    return (
        <Root className={classes.content}>
            <Typography align="center" variant="h3">
                Versions Overview
            </Typography>
            <Container className={classes.container}>
                <Box sx={{ maxWidth: 500, mb: 3, width: '100%' }}>
                    <Typography align="left" variant="h5">
                        REMS version: {rem?.rems_version}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography align="left" variant="h5">
                        PAS kar version: {rem?.pas_version}_{rem?.build_number}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography align="left" variant="h5">
                        CF version: {rem?.cloudforwarder_version}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 1, height: 600, width: '100%' }}>
                    <DataGrid
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        rows={agents}
                        columns={columns}
                        pageSizeOptions={[5, 10, 15]}
                    />
                </Box>
            </Container>
        </Root>
    );
}
