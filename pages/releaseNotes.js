import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Copyright from '../components/Copyright';

export default function ReleaseNotes() {
    let notes = [
        { text: 'Enterprise Overview', level: 0 },
        { text: '- Expand widget health bars to fill widget and left-justify text labels', level: 1 },
        { text: '- Add legend for store health colors on map', level: 1 },
        { text: '- Relocate "save current view" button as a result', level: 2 },
        { text: '- New Widget: Agents Online', level: 1 },
        { text: '- Disable "REMS Connection Disrupted" feature until Dashboard Environment Split is complete', level: 1 },
        { text: '- To avoid false positives on disruption checks', level: 2 },
        { text: 'Software Distribution', level: 0 },
        { text: '- Add capability to do immediate deployments, instead of having to schedule 15+ minutes out', level: 1 },
        { text: 'Store Overview', level: 0 },
        { text: '- Addition of SCO Devices (Product Recognition Camera and Loss Prevention Camera) on Register tiles with Model and Manufacturer info', level: 1 },
        { text: '- Screenshot "offline" image changed to "Unavailable"', level: 1 },
        { text: '- Agents include Manufacturer information (if available)', level: 1 },
        { text: 'Bug Fixes', level: 0 },
        { text: '- Remote Software Diagnostics', level: 1 },
        { text: '- Sorting and filtering is being reconfigured.  Default sorting is by timestamp descending and you can filter by store.', level: 2 },
    ]
    return (
        <Box sx={{ width: '100%', height: '100vh', justifyContent: 'center', alignContent: 'center', padding: 4 }}>
            <Typography variant='h2'>Release Notes - 4.2.33</Typography>
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