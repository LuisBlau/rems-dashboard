import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import _ from 'lodash';

/// Number of millisec to show Successful toast. Page will reload 1/2 second after to clear it.
const SuccessToastDuration = 4000;
/// Number of millisec to show Failure toast. Page does not reload after.
const FailToastDuration = 10000;

function ConfigItemValueDisplay({ configItem, allConfigItems, setConfigurationItems }) {
    const [val, setVal] = useState(configItem.configValue || null)

    const handleValueChange = (event) => {
        const objectToUpdate = _.find(allConfigItems, x => x.configName === configItem.configName)
        if (configItem.configValueType === 'numeric') {
            _.set(objectToUpdate, 'configValue', Number(event.target.value))
        } else {
            _.set(objectToUpdate, 'configValue', event.target.value)
        }
        setVal(event.target.value)
        setConfigurationItems(allConfigItems)
    }

    if (configItem.configValueType === 'numeric') {
        return (
            <TextField type="number" value={val} onChange={handleValueChange}></TextField>
        )
    } else if (configItem.configValueType === 'boolean') {
        return (
            <Select
                onChange={handleValueChange}
                value={val}
                autoWidth>
                <MenuItem value={true}>
                    true
                </MenuItem>
                <MenuItem value={false}>
                    false
                </MenuItem>
            </Select>
        )
    } else if (configItem.configValueType === 'string') {
        return (
            <TextField defaultValue={val} onChange={handleValueChange}></TextField>
        )
    } else {
        return null
    }
}

export default function ToshibaAdministrativeSettings() {
    const [configurationItems, setConfigurationItems] = useState([])
    const [toastFailure, setToastFailure] = useState('');
    const [openFailure, setOpenFailure] = useState(false);
    const [toastSuccess, setToastSuccess] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('/api/REMS/toshibaConfigurationUpdate', configurationItems)
            .then(function (response) {
                if (response.status !== 200) {
                    setToastFailure('Error Saving Configuration!');
                    setOpenFailure(true);
                    return;
                }

                setToastSuccess('Configuration Successfully Saved.');
                setOpenSuccess(true);

                setTimeout(function () {
                    window.location.reload(true);
                }, SuccessToastDuration + 500);
            })
            .catch(function (error) {
                console.log(error);
                setToastFailure('Error connecting to server!!');
                setOpenFailure(true);
            });
    };

    useEffect(() => {
        axios.get('/api/REMS/toshibaConfiguration').then(function (res) {
            const configItems = [];
            if (res.data !== null) {
                res.data.configuration.forEach((value) => {
                    configItems.push(Object.values(value)[0]);
                });
                setConfigurationItems(configItems);
            }
        });
    }, [])

    if (configurationItems.length > 0) {
        return (
            <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h2">
                    Administrative Configuration
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyItems: 'center' }}>
                    {
                        configurationItems.map((element) => (
                            <Paper key={element.configName} elevation={10} sx={{ display: 'flex', margin: 3, padding: 2, alignItems: 'center', width: 500 }}>
                                <Typography sx={{ marginRight: 1 }} fontWeight='bold'>{element.configDisplay}</Typography>
                                <ConfigItemValueDisplay configItem={element} setConfigurationItems={setConfigurationItems} allConfigItems={configurationItems} />
                            </Paper>
                        ))
                    }
                </Box>
                <Button onClick={handleSubmit} variant="contained">
                    Submit
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openSuccess}
                    autoHideDuration={SuccessToastDuration}
                    onClose={(event) => {
                        setOpenSuccess(false);
                    }}
                >
                    <Alert variant="filled" severity="success">
                        <AlertTitle>Success!</AlertTitle>
                        {toastSuccess}
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={openFailure}
                    autoHideDuration={FailToastDuration}
                    onClose={(event) => {
                        setOpenFailure(false);
                    }}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Error!!!</AlertTitle>
                        {toastFailure}
                    </Alert>
                </Snackbar>
            </Box>
        )
    } else {
        return (
            <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h2">
                    Administrative Configuration
                </Typography>
                <Typography sx={{ marginTop: 10 }} variant="h4"> No configurations found...</Typography>
            </Box>
        )
    }
}