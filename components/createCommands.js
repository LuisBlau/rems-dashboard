/* eslint-disable react/prop-types */
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import 'rsuite/dist/rsuite.min.css';
import { TreePicker } from 'rsuite';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from '../pages/UserContext';
export default function Command(props) {
    const _width = 150;
    const [value, setValue] = useState(null);
    const [configs, setConfigs] = useState([]);
    const [state, setArgs] = useState({ ...props.st, downloads: [] });
    const context = useContext(UserContext)
    const setProp = props.setst;
    

    const handlechange = (event) => {
        state.type = event.target.value;
        state.arguments = {};
        setProp(props.id, state);
    };
    const setval = (name) => {
        return function (x) {
            state.arguments[name] = x.target.value;
            setArgs(state);
            setProp(props.id, state);
        };
    };
    const getval = (name) => {
        return state.arguments[name];
    };

    useEffect(() => {
        if (state?.arguments?.file && configs?.length > 0) {
            const findConfig = configs?.find(item => item.id == state?.arguments?.file && item?.retailer_id == state?.arguments?.fileowner);
            setValue({ ...value, [props.id]: findConfig?._id });

        }
    }, [state?.arguments?.file, configs])


    const commands = {
        '': function () {
            return <div />;
        }, // this is the default when no command is selected
        shell: function () {
            return (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <FormControl required={true}>
                        <Select
                            sx={{ margin: 1, width: _width }}
                            value={getval('cmd', 'cmd') || ''}
                            label="Type"
                            labelId="demo-simple-select-label"
                            onChange={setval('cmd')}
                        >
                            <MenuItem value="shell">shell</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="command"
                        variant="standard"
                        onChange={setval('args')}
                        value={getval('args')}
                        required={true}
                    />
                    <TextField
                        label="Runtime Path (optional)"
                        variant="standard"
                        onChange={setval('path')}
                        value={getval('path')}
                        required={false}
                    />
                </div>
            );
        },
        unzip: function () {
            return (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <TextField
                        sx={{ marginLeft: 1, width: _width, marginRight: 1 }}
                        label="file"
                        variant="standard"
                        onChange={setval('file')}
                        value={getval('file')}
                        required={true}
                    />
                    <TextField
                        label="destination"
                        variant="standard"
                        onChange={setval('directory')}
                        value={getval('directory')}
                        required={true}
                    />
                    <TextField
                        label="distribution"
                        variant="standard"
                        onChange={setval('distribute')}
                        value={getval('distribute')}
                        required={true}
                    />
                </div>
            );
        },
        apply: function () {
            return (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <FormControl required={true}>
                        <Select
                            sx={{ margin: 1, width: _width }}
                            value={getval('command', 'command') || ''}
                            label="Type"
                            labelId="demo-simple-select-label"
                            onChange={setval('command')}
                        >
                            <MenuItem value="apply">Apply</MenuItem>
                            <MenuItem value="backout">Backoff</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="product"
                        variant="standard"
                        onChange={setval('product')}
                        value={getval('product')}
                        required={true}
                    />
                    <FormControl required={true}>
                        <InputLabel id="controller-load-label">Controller Load</InputLabel>
                        <Select
                            sx={{ margin: 1, width: _width }}
                            value={getval('controller_reload', 'controller_reload') || ''}
                            label="Controller Load"
                            labelId="controller-load-label"
                            onChange={setval('controller_reload')}
                        >
                            <MenuItem value="normal">Normal</MenuItem>
                            <MenuItem value="staged">Staged</MenuItem>
                            <MenuItem value="noipl">noipl</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl required={true}>
                        <InputLabel id="terminal-load-label">Terminal Load</InputLabel>
                        <Select
                            sx={{ margin: 1, width: _width }}
                            value={getval('terminal_load', 'terminal_load') || ''}
                            label="Terminal Load"
                            labelId="terminal-load-label"
                            onChange={setval('terminal_load')}
                        >
                            <MenuItem value="true">True</MenuItem>
                            <MenuItem value="false">False</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField variant="standard" sx={{ visibility: 'hidden' }} />
                </div>
            );
        },
        upload: function () {
            let data = []
            let response = {};
            if (state.downloads.length === 0) {
                if (props.isTenant === false) {
                    axios.get(`/api/REMS/uploads?retailerId=${props.selectedRetailer}`).then(function (res) {
                        setConfigs(res.data)
                        response = _.groupBy(res.data, 'retailer_id');
                        for (const soft of Object.keys(response)) {
                            const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                            const entry = { children: [], label: (findRetailer ? findRetailer.description : soft) + " Deployments", value: soft };
                            for (const v of response[soft]) {
                                entry.children.push({
                                    label: v.description,
                                    value: v._id,
                                    type: context.selectedRetailer === soft ? 'retailer' : 'common'
                                });
                            }
                            data.push(entry);
                        }
                        setArgs({
                            ...state,
                            downloads: data,
                        });
                    });
                } else {
                    axios.get(`/api/REMS/uploads?retailerId=${props.parentRemsServer}&tenantId=${props.selectedRetailer}`).then(function (res) {
                        setConfigs(res.data)
                        response = _.groupBy(res.data, 'retailer_id');
                        for (const soft of Object.keys(response)) {
                            const findRetailer = context.userRetailers.find(item => item.retailer_id === soft);
                            const entry = { children: [], label: (findRetailer ? findRetailer.description : soft) + " Deployments", value: soft };
                            for (const v of response[soft]) {
                                entry.children.push({
                                    label: v.description,
                                    value: v._id,
                                    type: context.selectedRetailer === soft ? 'retailer' : 'common'
                                });
                            }
                            data.push(entry);
                        }
                        setArgs({
                            ...state,
                            downloads: data,
                        });
                    });
                }
                return <p>loading</p>;
            }

            return (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <FormControl required={true}>
                        <TreePicker
                            onChange={(selectedConfig, e) => {
                                setValue({ ...value, [props.id]: selectedConfig })
                                const findConfig = configs?.find(item => item._id == selectedConfig);
                                if (selectedConfig === 'COMMON' || selectedConfig === context?.selectedRetailer) {
                                    e.preventDefault();
                                    setArgs({ ...state, arguments: '' });
                                    setProp(props.id, { ...state, arguments: '' });
                                    return;
                                }
                                setArgs({ ...state, arguments: { file: findConfig?.id, fileowner: findConfig?.retailer_id } });
                                setProp(props.id, { ...state, arguments: { file: findConfig?.id, fileowner: findConfig?.retailer_id } });
                            }}
                            data={state.downloads}
                            style={{
                                width: 250,
                                padding: 8
                            }}
                            value={value?.[props.id]}
                            placeholder="Type"
                        />
                    </FormControl>
                    <TextField
                        label="Destination Folder"
                        variant="standard"
                        onChange={setval('to_location')}
                        value={getval('to_location') || ""}
                        required={true}
                    />
                    <TextField
                        label="Destination Filename"
                        variant="standard"
                        onChange={setval('filename')}
                        value={getval('filename') || ""}
                        required={true}
                    />
                </div>
            );
        },
    };
    const listItems = Object.keys(commands).map((c, index) => (
        <MenuItem key={'c-' + index} value={c}>
            {c}
        </MenuItem>
    ));
    const command = commands[!state.type || state.type === undefined ? '' : state.type]();
    return (
        <Grid container direction="row" sx={{ margin: 1 }}>
            <Grid item>
                <Select
                    sx={{ margin: 1, width: 120 }}
                    value={state.type === undefined ? '' : state.type}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    onChange={handlechange}
                >
                    {listItems}
                </Select>
            </Grid>
            {command}
            <Button
                variant="contained"
                sx={{ margin: 1 }}
                endIcon={<RemoveDoneIcon />}
                onClick={() => props.onRemove(props.id)}
            >
                {' '}
                Remove Task{' '}
            </Button>
        </Grid>
    );
}
