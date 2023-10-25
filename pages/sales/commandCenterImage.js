import React from 'react'
import CommandCenterPng from '../../public/images/command-center.png'
import { Box } from '@mui/material'
import Image from 'next/image'

export default function CommandCenterImage() {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <Image layout='responsive' src={CommandCenterPng} alt="CommandCenterImage" />
        </Box >
    )
}