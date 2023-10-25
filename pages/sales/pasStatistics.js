import React from 'react'
import StatsPng from '../../public/images/pas-statistics.png'
import { Box } from '@mui/material'
import Image from 'next/image'

export default function PasStatistics() {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <Image layout='responsive' src={StatsPng} alt="StatsImage" />
        </Box >
    )
}