import React, { useState } from "react";
import { makeStyles } from '@mui/styles';
import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Button from "@mui/material/Button";


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

const defaultPackageOptions=['package-1','package-2','really-really-long-package-name-ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-1234567890.pkz','package-3','package-4'];
const defaultValues = {
    package:"",
    storeList:"",
    sendDateTime:""
};

export default function deployScheule(){
    const classes = useStyles();
    const [formValues, setFormValues] = useState(defaultValues);
    const [dateTimeValue, setDateTimeValue] = useState((new Date( )))

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
        console.log(formValues);
    };

    const handleSelectChange = (event,newValue) => {
        formValues.package = newValue;
        console.log(formValues);
    }

    const handleDate = (newValue) => {
        formValues.sendDate = newValue;
        console.log(formValues);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formValues);
    };

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer}/>
            <Container maxWidth="lg" className={classes.container}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}
                               sx={{alignItems: 'center', paddingTop:10 }}
                        >
                            <Autocomplete
                                id="select-package"
                                onChange={handleSelectChange}
                                options={defaultPackageOptions}
                                renderInput={(params) =>(
                                    <TextField
                                        sx={{width:600}}
                                        {... params}
                                        label="Package to Send"
                                        InputProps={{... params.InputProps, type: 'search'}} />
                                )}
                            />
                            {/*for handler to work 'name' has to match the formsValue member*/}
                            <TextField
                                id="storeList-input"
                                multiline
                                rows={5}
                                sx={{ width:"fit-content", height:"100%" }}
                                label="Store List"
                                name="storeList"
                                onChange={handleTextChange}
                                helperText='store1:agent1,store2:agent2,,store3:agent3,store4:agent4,store5:agent5'
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    id="date-time-local"
                                    disablePast
                                    label="Send Time"
                                    renderInput={(params) => <TextField {...params} />}
                                    value={dateTimeValue}
                                    onChange={(newValue) => {
                                        setDateTimeValue(newValue);
                                        formValues.sendDateTime=newValue;
                                        console.log(formValues)
                                    }}
                                />
                            </LocalizationProvider>

                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </Stack>
                    </form>
            </Container>
        </main>
    );
}