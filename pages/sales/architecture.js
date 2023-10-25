import React from 'react'
import ArchitecturePng from '../../public/images/architecture.png'
import { Box } from '@mui/material'
import Image from 'next/image'

export default function Architecture() {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <Image layout='responsive' src={ArchitecturePng} alt="ArchitectureImage" />
        </Box >
    )
}