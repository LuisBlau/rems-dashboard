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
    package: "",
    storeList: "",
    dateTime: ""
};

const packageList = [
    { label: "packge-1.pkg", id: 1 },
    { label: "packge-2.pkg", id: 2 },
    { label: "packge-3.pkg", id: 3 },
    { label: "packge-4.pkg", id: 4 },
    { label: "packge-5.pkg", id: 5 },
    { label: "packge-6.pkg", id: 6 },
    { label: "packge-7.pkg", id: 7 },
    { label: "packge-8.pkg", id: 8 },
    { label: "packge-9.pkg", id: 9 },
    { label: "packge-10.pkg", id: 10 }
];

export default function deployScheule() {
    const classes = useStyles();
    // const [formValues, setFormValues] = useState(defaultValues);
    const [_package, setPackage] = useState(null);
    const [_storeList, setStoreList] = useState('');
    const [_dateTime, setDateTime] = useState((new Date()));
    const [_options, setOptions] = useState([])

    // https://medium.com/@dev_abhi/useeffect-what-when-and-how-95045bcf0f32
    useEffect(() => {
        // here goes your fetch call
        // when response arrives -
        setOptions(packageList);
    }, []); //Second opption [] means only run effect on the first render

    const handleSubmit = (event) => {
        event.preventDefault();
        formValues.package = _package;
        formValues.storeList = _storeList;
        formValues.dateTime = _dateTime;
        console.log("Submitted : formValues");
        console.log("formValues.package = [ %s : %s ] ", formValues.package.label, formValues.package.id);
        console.log("formValues.storeList = %s ", formValues.storeList);
        console.log("formValues.dateTime = %s ", formValues.dateTime);
    };

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
                <form onSubmit={handleSubmit}>
                    <dev>
                        <Stack spacing={2} sx={{ alignItems: 'center', paddingTop: 10 }} >
                            <Autocomplete
                                id="select-package"
                                value={_package}
                                onChange={(event, newValue) => {
                                    setPackage(newValue);
                                    console.log("old = %s | new = %s", _package, newValue);
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
                                    console.log("old = %s | new = %s", _storeList, event.target.value);

                                }}
                                helperText='example store list : store1:agent1,store2:agent2,store3:agent3,store4:agent4,store5:agent5'
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    id="date-time-local"
                                    disablePast
                                    label="Send Time"
                                    renderInput={(params) => <TextField {...params} />}
                                    value={_dateTime}
                                    onChange={(newValue) => {
                                        setDateTime(newValue);
                                        console.log("old = %s | new = %s", _dateTime, newValue);
                                    }}
                                />
                            </LocalizationProvider>

                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </dev>
                </form>
            </Container>
        </main>
    );
}