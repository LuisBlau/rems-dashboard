/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import Container from '@mui/material/Container';
import { Tabs, Tab } from '@mui/material';
import { Box } from '@mui/system';
import ChecExtracts from '../../components/Diagnostics/checExtracts';
import Dumps from '../../components/Diagnostics/dumps';
import DataCapture from '../../components/Diagnostics/dataCapture';
import DocCollection from '../../components/Diagnostics/docCollection';
import Copyright from '../../components/Copyright';

const PREFIX = 'diagnostics';

const classes = {
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
};

const Root = styled('main')(({ theme }) => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'hidden',
    },

    [`& .${classes.container}`]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

const category = [
    {
        value: 'docCollection',
        label: 'Doc Collection',
        component: <DocCollection />
    },
    {
        value: 'checExtracts',
        label: 'Chec Extracts',
        component: <ChecExtracts />
    },
    {
        value: 'dataCapture',
        label: 'Data Capture',
        component: <DataCapture />
    },
    {
        value: 'dumps',
        label: 'Dumps',
        component: <Dumps />
    },
]


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Diagnostics() {
    const [activeCategory, setActiveCategory] = useState(category[0].value);
    const [component, setComponent] = useState(category[0].component);
    return (
        <Root className={classes.content}>
            <Container maxWidth="xl" className={classes.container} >
                <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider', }}>
                    <Tabs value={activeCategory}>
                        {category.map((item, key) => <Tab key={key} value={item.value} onClick={() => { setActiveCategory(item.value); setComponent(item.component) }} label={item.label} {...a11yProps(key)} />
                        )}
                    </Tabs>
                </Box>
                {activeCategory &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
                        {component}
                    </Box>
                }
            </Container>
        </Root>
    );
}
