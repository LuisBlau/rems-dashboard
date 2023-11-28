import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Copyright from '../components/Copyright';

export default function ReleaseNotes() {

    let notes = [
        { text: 'Version Overview', level: 0 },
        { text: '- Docker Tab (Toshiba Only)', level: 1 },
        { text: '- Added 4 new columns: Agent Count, Store Count, Agent Error Count, Store Error Count', level: 2 },
        { text: 'Administration > PAS KPI Reporting (new)', level: 0 },
        { text: '- Added 5 internal KPI reports', level: 1 },
        { text: '- Accessible with Command Center Viewer role', level: 2 },
        { text: 'Bug Fixes', level: 0 },
        { text: '- Internal', level: 1 },
        { text: '- Fixed docker container timestamp sorting (Version Overview)', level: 2 },
        { text: '- Fixed issue when creating tenants from non-tenant REMS server', level: 2 },
        { text: '- Fixed issue with deleting the last tenant on a REMS server', level: 2 },
        { text: '- Fixed issue with sidebar', level: 2 },
        { text: '- External', level: 1 },
        { text: '- Fixed issue with SCO Counters on Store Overview', level: 2 },
        { text: '- Fixed issue with REMS status identification', level: 2 },
        { text: '- Fixed issue with retailer configuration on enterprise overview tiles', level: 2 },
        { text: '- Fixed store default sorting on Enterprise Overview to be by store name', level: 2 },
        { text: '- Fixed agent order in store overview to be sequential', level: 2 }
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