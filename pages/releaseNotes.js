import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function ReleaseNotes() {

    let notes = [
        { text: 'Elera Health (updated)', level: 0 },
        { text: '- Has select menu functionality to match Elera Stats', level: 1 },
        { text: 'REMS Management Page (new)', level: 0 },
        { text: '- Add tenant to REMS server', level: 1 },
        { text: '- Can create new tenant REMS server, if not previously tenant setup', level: 2 },
        { text: '- Remove Tenants from REMS Server', level: 1 },
        { text: '- Can rever to non-tenant REMS server if no tenants remain on the configuration', level: 2 },
        { text: '- Assign stores to a tenant', level: 1 },
        { text: '- Delete store from REMS server', level: 1 },
        { text: '- Bulk assign tenants for stores', level: 1 },
        { text: 'Versions Overview', level: 0 },
        { text: '- Docker Management Tab (new)', level: 1 },
        { text: '- For toshiba only, allows you to see (and clean up dangling) containers we have running/suspended/dead', level: 2 },
        { text: '- REMS (new)', level: 1 },
        { text: '- Shows version information for all REMS servers reporting to the TORICO matching the retailer you have selected', level: 2 },
        { text: '- Toshiba Admins can delete these rows - to clean up dangling REMS information that is outdated (will be re-populated on next update push from REMS)', level: 2 },
        { text: 'Enterprise Overview', level: 0 },
        { text: '- New notification icon (next to filter bar above map) to identify when your REMS server(s) is having connectivity issues.', level: 1 },
        { text: '- The icon will show up, and be red, when you have a REMS server that has not sent updates in at least an hour - clicking it will take you to the new REMS tab of the versions overview so you can asses which REMS server has the issue', level: 1 },
        { text: 'Peripherals Widget', level: 0 },
        { text: '- Split devices information to only include objects that have an IP Address (SNMP Devices)', level: 1 },
        { text: '- Peripherals will be "attached" peripherals on registers, for example: scanner, keyboard, etc.', level: 1 },
        { text: '- Any device that is not reporting an IP Address will be found in the new peripherals widget', level: 1 },
        { text: '- Hidden behind a retailer configuration, like other widgets, with default of "false"', level: 2 },
        { text: 'Remote Diagnostics', level: 0 },
        { text: '- Data Capture (tab)', level: 1 },
        { text: '- Added new table above the agents table where you can see all REMS servers reporting to your TORICO - and request data captures from them individually, identified by their REMS ID (unique identifier)', level: 2 },
        { text: 'Release Notes', level: 0 },
        { text: '- Added.... this page!', level: 1 },
        { text: 'Bugfix', level: 0 },
        { text: '- Fixed issue where deployment status appeared to do an infinite load if there were simply no deployments', level: 1 },
        { text: '- Fixed a bug where occasionally Elera Stats page would not retrieve the stores list', level: 1 }]
    return (
        <Box sx={{ width: '100%', height: '100vh', justifyContent: 'center', alignContent: 'center', padding: 4 }}>
            <Typography variant='h2'>Release Notes - 4.2.31</Typography>
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
        </Box>
    )
}