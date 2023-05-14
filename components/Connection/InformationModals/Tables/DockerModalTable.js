/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Paper } from '@mui/material';

export default function DockerModalTable({ rows }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">State</TableCell>
                        <TableCell align="right">CPU</TableCell>
                        <TableCell align="right">Memory</TableCell>
                        <TableCell align="right">Image</TableCell>
                        <TableCell align="right">Command</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.state}</TableCell>
                            <TableCell align="right">{row.cpu}</TableCell>
                            <TableCell align="right">{row.memory}</TableCell>
                            <TableCell align="right">{row.image}</TableCell>
                            <TableCell align="right">{row.command}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
