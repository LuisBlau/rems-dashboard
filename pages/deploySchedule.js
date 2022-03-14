import React, { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Button from "@mui/material/Button";
import axios from 'axios';

const uiWidth = 600;

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    appBarSpacer: {
        paddingTop: 60
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    fixedHeight: {
        height: 240,
    },
}));

// const defaultPackageOptions = ['package-1', 'package-2', 'really-really-long-package-name-ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-1234567890.pkz', 'package-3', 'package-4'];

const formValues = {
    name: "",
    id: "",
    storeList: "",
    dateTime: ""
};

export default function deployScheule() {
    const classes = useStyles();
    const [_formValues, setFormValues] = useState(formValues);
    const [_package, setPackage] = useState(null);
    const [_storeList, setStoreList] = useState('');
    // const [_dateTime, setDateTime] = useState((new Date()));
    const [_dateTime, setDateTime] = useState(new Date());
    const [_options, setOptions] = useState([])

    useEffect(() => {
        axios.get("http://127.0.0.1:3001/REMS/deploy-configs").then(function (response) {
            var packages = []
            response.data.forEach(v => {
                packages.push({ label: v.name, id: v.id })
            })
            setOptions(packages);
        });
    }, []); //Second opption [] means only run effect on the first render

    const handleSubmit = (event) => {
        event.preventDefault();

        formValues.name = _package.label,
            formValues.id = _package.id,
            formValues.storeList = _storeList,
            // Don't adjust for users time zone i.e we are always in store time.
            // en-ZA puts the date in the design doc format except for an extra comma.
            formValues.dateTime = new Date(_dateTime).toLocaleString('en-ZA', { hourCycle: 'h24' }).replace(',', '');

        setFormValues(formValues)

        const _body = JSON.stringify(_formValues);

        const requestText = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: _body
        };
        //TODO : Add error message if status does not come back OK
        fetch('http://127.0.0.1:3001/deploy-config', requestText)
            .then(res => {
                if(res.status != 200){
                    alert("Deploy-Config: name and id does not exist.")
                }
            })
            .catch(err => {
                alert("Error connecting to server.")
                console.log(err)
            });
    };

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Stack spacing={2} sx={{ alignItems: 'center', paddingTop: 10 }} >
                            <Autocomplete
                                id="select-package"
                                value={_package}
                                onChange={(event, newValue) => {
                                    setPackage(newValue);
                                }}
                                options={_options}
                                noOptionsText="Error Loading Package List"
                                renderInput={(params) => (
                                    <TextField
                                        sx={{ width: uiWidth }}
                                        {...params}
                                        label="Package to Send"
                                        InputProps={{ ...params.InputProps, type: 'search' }} />
                                )}
                            />

                            {/*for handler to work 'name' has to match the formsValue member*/}
                            <TextField
                                id="storeList-input"
                                multiline
                                rows={5}
                                sx={{ width: uiWidth, height: "100%" }}
                                label="Store List"
                                name="storeList"
                                onChange={(event) => {
                                    setStoreList(event.target.value);

                                }}
                                helperText='example store list : store1:agent1,store2:agent2,store3:agent3,store4:agent4,store5:agent5'
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    id="date-time-local"
                                    disablePast
                                    label="Send Time"
                                    renderInput={(params) => <TextField {...params}  helperText="Store Time Zone" />}
                                    value={_dateTime}
                                    onChange={(newValue) => {
                                        setDateTime(newValue);
                                    }}
                                />
                            </LocalizationProvider>

                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </div>
                </form>
            </Container>
        </main>
    );
}