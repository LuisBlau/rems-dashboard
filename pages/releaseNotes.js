import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Copyright from '../components/Copyright';

export default function ReleaseNotes() {

    let notes = [
        { text: 'Version Overview', level: 0 },
        { text: '- Docker Tab (Toshiba Only)', level: 1 },
        { text: '- Added 4 new columns: Agent Count, Store Count, Agent Error Count, Store Error Count', level: 2 },
        { text: 'Store Overview', level: 0 },
        { text: '- Added more robust Alerts functionality', level: 1 },
        { text: 'Retailer Settings', level: 0 },
        { text: '- Added Elastic Search Rules capabilities', level: 1 },
        { text: 'Administration > PAS KPI Reporting (new)', level: 0 },
        { text: '- Added 5 internal KPI reports', level: 1 },
        { text: '- Accessible with Command Center Viewer role', level: 2 },
        { text: 'Bug Fixes', level: 0 },
        { text: '- Fixed docker container timestamp sorting (Version Overview)', level: 1 },
        { text: '- Fixed issue when creating tenants from non-tenant REMS server', level: 1 },
        { text: '- Fixed issue with deleting the last tenant on a REMS server', level: 1 },
        { text: '- Fixed issue with SCO Counters on Store Overview', level: 1 },
        { text: '- Fixed issue with sidebar (for toshiba admins)', level: 1 },
        { text: '- Fixed issue with REMS status identification', level: 1 },
        { text: '- Fixed issue with retailer configuration on enterprise overview tiles', level: 1 }
    ]
    return (
        <Box sx={{ width: '100%', height: '100vh', justifyContent: 'center', alignContent: 'center', padding: 4 }}>
            <Typography variant='h2'>Release Notes - 4.2.31-1</Typography>
            {notes.map((note, index) => {
                if (note.level === 0) {
                    return (
                        <Typography fontWeight={'bold'} variant='h6' key={index}>
                            {note.text}
                        </Typography>
                    )
                } else if (note.level === 1) {
                    return (
                        <Typography sx={{ marginLeft: 2 }} key={index}>
                            {note.text}
                        </Typography>
                    )
                } else if (note.level === 2) {
                    return (
                        <Typography sx={{ marginLeft: 4 }} key={index}>
                            {note.text}
                        </Typography>
                    )
                }
            })
            }
            <Box sx={{ paddingTop: 2, alignItems: 'center' }}>
                <Copyright />
            </Box>
        </Box>
    )
}