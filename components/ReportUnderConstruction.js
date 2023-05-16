import React from 'react';
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import ConstructionImage from '../public/images/construction.png';

export default function ReportUnderConstruction() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={ConstructionImage} alt="ConstructionImage" />
            <Typography sx={{ marginLeft: 3, marginRight: 3 }} variant='h2'>This Report is Under Construction!</Typography>
            <Image src={ConstructionImage} alt="ConstructionImage" />
        </Box>
    )
}