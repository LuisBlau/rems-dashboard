/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles'
import React, { useContext, useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box'
import axios from 'axios';
import {
    Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import UserContext from '../UserContext';

const PREFIX = 'eleraHealth'

export default function EleraHealth() {

    const context = useContext(UserContext)
    const [data, setData] = useState('')
    const [eleraHealthUrl, setEleraHealthUrl] = useState('')
    let par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const params = new URLSearchParams(par);

    useEffect(() => {
        axios.get(`/api/REMS/getContainerInformationForStoreAgent?storeName=${params.get('storeName')}&retailerId=${params.get('retailer_id')}&agentName=${params.get('agentName')}`).then((resp) => {
            if (resp.data) {
                setData(resp.data)
            }
        })
    }, [])

    useEffect(() => {
        if (context.selectedRetailer) {
            axios.get(`/api/REMS/retailerConfiguration?isAdmin=true&retailerId=${context.selectedRetailer}`).then(function (res) {
                // fetch configuration info
                const configurationArray = res.data.configuration;
                const configurationInfo = [];
                configurationArray.forEach(configObject => {
                    const innerArray = Object.values(configObject)[0];
                    configurationInfo.push(innerArray);
                });
                setEleraHealthUrl(configurationInfo.find(item => item.configName === 'eleraDashboardurl').configValue)

            })
        }
    }, [context.selectedRetailer])

    const columns = [
        {
            field: 'name',
            headerName: 'ContainerName',
            flex: 1
        },
        {
            field: 'lastupd',
            headerName: 'LastUpdated',
            sortable: true,
            filterable: true,
            type: 'dateTime',
            valueGetter: (params) => new Date(params.row.lastupd),
            flex: 1
        },
        {
            field: 'state',
            headerName: 'Status',
            flex: 1
        },
        {
            field: 'uptime',
            headerName: 'UpTime',
            flex: 1
        },
    ];

    const rows = [];

    function objectifyRow(id, name, lastupd, state, uptime) {
        return { id, name, lastupd, state, uptime };
    }


    if (data) {
        const arr = Object.values(data.docker);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = JSON.parse(arr[i]);
            arr[i].Names = arr[i].Names.replace(/\/|\[|\]/g, '');
            if (arr[i].Names.includes('elera') || arr[i].Names.includes('mongo') || arr[i].Names.includes('nginx') || arr[i].Names.includes('rabbitmq')) {
                if (arr[i].Names.includes('elera')) {
                    rows.push(
                        objectifyRow(
                            i + 1,
                            arr[i].Names,
                            arr[i].Read,
                            arr[i].State,
                            arr[i].Status
                        )
                    );
                }
            }
        }

        return (
            <Box sx={{ display: 'flex', flexGrow: 1, height: '100vh', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                <Typography variant="h3">ELERA - {params.get('storeName')} - {params.get('agentName')}</Typography>
                <Box sx={{ height: 200, width: '90%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10, 15]}
                        disableRowSelectionOnClick
                    />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ width: '100%', flex: 1 }}>
                    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                        <iframe
                            style={{ paddingTop: 4, flexGrow: 1, border: 'none' }}
                            src={eleraHealthUrl}
                        />
                    </div>
                </Box>
            </Box>
        );

    }
}
