/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import GoogleMap from '../components/Maps/GoogleMap';
import {
    Card,
    Paper,
    Switch,
    Typography,
    Stack,
    Chip,
    Button,
    CircularProgress,
    Snackbar, SnackbarContent,
    Grid
} from '@mui/material';
import axios from 'axios';
import { now } from 'lodash';
import Copyright from '../components/Copyright';
import { CustomLinearProgress } from '../components/LinearProgress';
import { useContext } from 'react';
import UserContext from './UserContext';
import { useMsal } from '@azure/msal-react';

const PREFIX = 'enterpriseOverview';

const classes = {
    content: `${PREFIX}-content`,
};

const Root = styled('main')(() => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
}));

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => option.str
});

function AppliedFilterDisplay({ filtersApplied, handleFilterDelete }) {
    return (
        <Stack sx={{ paddingLeft: 10, paddingBottom: 2 }} direction="row" spacing={1}>
            {filtersApplied.map((filter, index) => (
                <Chip
                    key={index}
                    label={Object.keys(filter) + ': ' + Object.values(filter)}
                    onDelete={handleFilterDelete(filter)}
                />
            ))}
        </Stack>
    );
};

export default function EnterpriseOverview() {
    let par = '';
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const [places, setPlaces] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [allFilters, setAllFilters] = useState([]);
    const [filteredFilters, setFilteredFilters] = useState([]);
    const [allRetailers, setAllRetailers] = useState([]);
    const [showOnlyDownStores, setShowOnlyDownStores] = useState(false);
    const [storesOnline, setStoresOnline] = useState(0);
    const [autocompleteKey, setAutocompleteKey] = useState('');
    const [lanesUp, setLanesUp] = useState(null);
    const [pullStorePeriodically, setPullStorePeriodically] = useState(0);
    const [isFilterSelect, setIsFilterSelect] = useState(false);
    const [showStoreOnlineWidget, setShowStoreOnlineWidget] = useState(false);
    const [showAttendedLanesWidget, setShowAttendedLanesWidget] = useState(false);
    const [storesOnlineWidgetErrorPercentage, setStoresOnlineWidgetErrorPercentage] = useState(0)
    const [attendedLanesOnlineWidgetErrorPercentage, setAttendedLanesOnlineWidgetErrorPercentage] = useState(0)
    const [configInfo, setConfigInfo] = useState([])
    const [widget, setWidget] = useState({
        onlineStore: 0,
        onlineStoreText: '0/0',
        onlineStoreColor: 'success',
        laneUp: 0,
        laneUpText: '0/0',
        laneUpColor: 'success'
    })
    const { accounts } = useMsal();
    const username = accounts.length > 0 ? accounts[0].username : '';
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const SuccessToastDuration = 4000;
    const context = useContext(UserContext)
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [mapParams, setMapParams] = useState(null);
    const [isRefetch, setIsRefetch] = useState(null);

    useEffect(() => {
        if (context?.selectedRetailer) {
            setSelectedRetailer(context.selectedRetailer)
        }
    }, [context?.selectedRetailer])

    useEffect(() => {
        if (!isRefetch) {
            if (context?.userDetails?.userDefinedMapConfig) {
                setMapParams(context?.userDetails?.userDefinedMapConfig);
            } else {
                if (places.length > 0) {
                    setMapParams({
                        userMapZoom: places.length === 0 ? 8 : 3,
                        userMapCenter: {
                            lat: places[0].geometry.location.lat,
                            lng: places[0].geometry.location.lon,
                        }
                    })
                } else {
                    setMapParams({
                        userMapZoom: 3,
                        userMapCenter: {
                            lat: 38.8097343,
                            lng: -90.5556199,
                        }
                    })
                }
            }
        }

    }, [context?.userDetails?.userDefinedMapConfig, places])

    useEffect(() => {
        if (selectedRetailer && selectedRetailer !== '') {
            axios.get(`/api/REMS/retailerConfiguration?isAdmin=true&retailerId=${selectedRetailer}`).then(function (res) {
                // fetch configuration info
                const configurationArray = res.data.configuration;
                const configurationInfo = [];
                configurationArray.forEach(configObject => {
                    const innerArray = Object.values(configObject)[0];
                    configurationInfo.push(innerArray);
                });
                setConfigInfo(configurationInfo)
                setShowStoreOnlineWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewStoreOnlineWidget').configValue)
                setShowAttendedLanesWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewAttendedLanesUpWidget').configValue)
                setStoresOnlineWidgetErrorPercentage(configurationInfo.find(item => item.configName === 'storesOnlineWidgetErrorPercentage').configValue)
                setAttendedLanesOnlineWidgetErrorPercentage(configurationInfo.find(item => item.configName === 'laneWidgetRedWhenAbovePercent').configValue)
                setPullStorePeriodically(configurationInfo.find(item => item.configName === 'pullStorePeriodically').configValue)

            })
        }
    }, [selectedRetailer])

    useEffect(() => {
        if (configInfo.length > 0) {
            if (storesOnline && lanesUp) {
                console.log({storesOnline, lanesUp})
                setWidget({
                    onlineStore: storesOnline.percentUp,
                    onlineStoreText: `${storesOnline.online}/${storesOnline.total}`,
                    onlineStoreColor: storesOnline.percentUp > storesOnlineWidgetErrorPercentage ? 'success' : 'error',
                    laneUp: lanesUp.percentUp,
                    laneUpText: `${lanesUp.online}/${lanesUp.total}`,
                    laneUpColor: lanesUp.percentUp > attendedLanesOnlineWidgetErrorPercentage ? 'success' : 'error',
                });
            }
        }
    }, [storesOnline, lanesUp, storesOnlineWidgetErrorPercentage, attendedLanesOnlineWidgetErrorPercentage])

    const handleFilterSelected = (e, selectedValue) => {
        if (selectedValue !== null) {
            if (selectedValue.type === 'store') {
                setSelectedStore({ id: selectedValue.id, name: selectedValue.name });
            } else if (selectedValue.type === 'country') {
                setSelectedCountry({ id: selectedValue.id, name: selectedValue.name });
            } else if (selectedValue.type === 'continent') {
                setSelectedContinent({ id: selectedValue.id, name: selectedValue.name });
            }
            // this is a little hack to force the autocomplete component to re-render (clearing the text without losing the selected value)
            setAutocompleteKey(now);
            // this is a little hack to place the map to the selected filter
            setIsFilterSelect(true)
            setTimeout(() => {
                setIsFilterSelect(false)
            }, 500);
        }
    };

    const handleFilterDelete = (filter) => () => {
        if (Object.keys(filter)[0] === 'Store') {
            setSelectedStore(null);
        } else if (Object.keys(filter)[0] === 'Country') {
            setSelectedCountry(null);
        } else if (Object.keys(filter)[0] === 'Continent') {
            setSelectedContinent(null);
        }
        // this is a little hack to place the map to the selected filter
        setIsFilterSelect(true)
        setMapParams({
            ...mapParams,
            userMapZoom: 3,
        })
        setTimeout(() => {
            setIsFilterSelect(false)
        }, 500);
    };

    const applyAllPreviouslyAppliedFilters = () => {
        if (filtersApplied.length !== 0) {
            filtersApplied.forEach((filter) => {
                if (Object.keys(filter)[0] === 'Store') {
                    const filteredPlaces = allPlaces.filter((x) => x._id === selectedStore.id);
                    setPlaces(filteredPlaces);
                } else if (Object.keys(filter)[0] === 'Country') {
                    const filteredPlaces = allPlaces.filter((x) => x.country === selectedCountry.id);
                    setPlaces(filteredPlaces);
                } else if (Object.keys(filter)[0] === 'Continent') {
                    const filteredPlaces = allPlaces.filter((x) => x.continent === selectedContinent.id);
                    setPlaces(filteredPlaces);
                }
            });
        } else {
            setPlaces(allPlaces);
        }
    };

    const toggleShowOnlyDownStores = () => {
        setShowOnlyDownStores(!showOnlyDownStores)
    };

    useEffect(() => {
        async function fetchData() {
            await axios.get(`/api/REMS/getAllRetailerDetails`).then(function (res) {
                setAllRetailers(res.data);
            })
        }
        fetchData()
    }, []);


    function fetchStore(isRefresh = false) {
        const stores = [];
        const localAllFilters = [];
        const localCountries = [];
        const localContinents = [];
        const localStores = [];

        axios.get(`/api/REMS/stores?retailerId=${selectedRetailer}&isTenant=${context.selectedRetailerIsTenant}`).then(function (res) {
            let counter = 0;
            let onlineCounter = 0;
            let upLanes = 0;
            let totalLanes = 0;

            res.data.forEach((store) => {
                store["label"] = store.storeName;
                const storeRetailer = allRetailers.find(x => x.retailer_id === store.retailer_id)
                if (storeRetailer !== undefined) {
                    store["description"] = storeRetailer.description
                }
                if (context.selectedRetailerIsTenant === true) {
                    store["description"] = context.selectedRetailerDescription
                }
                // only able to map stores we have the lat/lng for
                if (store.geometry && store.continent && store.retailer_id) {
                    // color the marker based on online status
                    if (store.onlineLanes && store.totalLanes) {
                        upLanes += store.onlineLanes
                        totalLanes += store.totalLanes
                    }
                    if (store.online !== true) {
                        // red
                        store.status = '#FF0000';
                    } else if (store.online === true) {
                        // green
                        store.status = '#00FF00';
                        onlineCounter++;
                    } else {
                        store.status = '#FF0000';
                    }
                    if (localContinents.findIndex((x) => x.name === store.continent) === -1) {
                        localContinents.push({
                            id: `${store.continent}`,
                            name: `${store.continent}`,
                            display: `${store.continent}`,
                            type: 'continent',
                            str: `${store.continent}`
                        });
                    }
                    if (localCountries.findIndex((x) => x.name === store.country) === -1) {
                        localCountries.push({
                            id: `${store.country}`,
                            name: `${store.country}`,
                            type: 'country',
                            display: `${store.country}`,
                            continent: `${store.continent}`,
                            str: `${store.continent} ${store.country}`
                        });
                    }
                    localStores.push({
                        id: `${store._id}`,
                        type: 'store',
                        name: `${store.storeName}`,
                        display: `${store.storeName}`,
                        continent: `${store.continent}`,
                        country: `${store.country}`,
                        retailer: `${store.retailer_id}`,
                        tenant: `${store.tenant_id}`,
                        str: `${store.continent} ${store.country}`
                    });
                    counter++;
                    stores.push(store);
                    console.log({stores})
                }
            });
            localAllFilters.push(...localContinents, ...localCountries, ...localStores);
            if (localAllFilters.length > 0 && allRetailers.length > 0) {
                localAllFilters.forEach((filter) => {
                    if (filter.type === 'store') {
                        let retailer = allRetailers.find((x) => x.retailer_id === filter.retailer);
                        if (retailer) {
                            filter.str = `${filter.str} ${retailer.description} ${filter.name}`;
                        } else {
                            filter.str = `${filter.str} ${context.selectedRetailerDescription} ${filter.name}`
                        }
                    }
                });
            }
            setStoresOnline({ 'online': onlineCounter, 'total': counter, 'percentUp': ((onlineCounter / counter) * 100) });
            setLanesUp({ 'online': upLanes, 'total': totalLanes, 'percentUp': ((upLanes / totalLanes) * 100) });
            setAllPlaces(stores);
            setAllFilters(localAllFilters);
            if (!isRefresh) {
                setPlaces(stores);
                setFilteredFilters(localAllFilters);
            }
        });
    }

    useEffect(() => {
        if (selectedRetailer && allRetailers.length > 0) {
            fetchStore();
            setSelectedContinent(null);
            setSelectedCountry(null);
            setSelectedStore(null);
            setFiltersApplied([]);
        }
    }, [selectedRetailer, allRetailers]);

    useEffect(() => {
        if (selectedRetailer && pullStorePeriodically > 0) {
            const interval = setInterval(() => {
                setIsRefetch(Math.random());
                fetchStore(true)
            }, pullStorePeriodically);
            return () => clearInterval(interval);
        }
    }, [allRetailers, selectedRetailer, pullStorePeriodically]);

    useEffect(() => {
        if (showOnlyDownStores) {
            async function func() {
                if (selectedStore !== null) {
                    if (places.filter((x) => x._id === selectedStore.id && x.status === '#FF0000').length <= 0) {
                        const index = filtersApplied.findIndex(x => Object.keys(x)[0] === 'Store');
                        filtersApplied.splice(index, 1);
                        setFiltersApplied(filtersApplied);
                    }
                }
                const filteredPlaces = places.filter((x) => x.status === '#FF0000');
                setPlaces(filteredPlaces);
            }
            func();
        } else {
            applyAllPreviouslyAppliedFilters();
        }
    }, [showOnlyDownStores, places]);

    useEffect(() => {
        let temp = [...filtersApplied];
        if (selectedContinent !== null && selectedCountry !== null) {
            temp.splice(2);
        } else if ((selectedContinent === null) ^ (selectedCountry === null)) {
            temp.splice(1);
        } else {
            temp.splice(0);
        }
        if (selectedStore !== null) temp.push({ Store: selectedStore.name });
        setFiltersApplied(temp);
    }, [selectedStore]);

    function handleSubmitMap() {
        axios.post(`/api/REMS/userSettingsSubmission`, { email: username, firstName: context.userDetails?.firstName, lastName: context.userDetails?.lastName, userDefinedMapConfig: mapParams })
            .then(res => {
                context.setUserDetails({
                    ...context.userDetails,
                    userDefinedMapConfig: mapParams
                });
                setOpen(true);
                setMessage('Default map view saved successfully');
            })
            .catch(err => {
                setOpen(true);
                setMessage('Default map view save failed');
                console.log('Error:', err);
            });
    }
    useEffect(() => {
        if (selectedStore !== null) {
            setSelectedStore(null);
        }
        let temp = [...filtersApplied];
        let pos = 0;
        if (selectedContinent !== null) {
            pos = 1;
        } else {
            pos = 0;
        }
        temp.splice(pos);
        if (selectedCountry !== null) temp.push({ Country: selectedCountry.name });
        setFiltersApplied(temp);
        setFiltersApplied(temp);
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedStore !== null) {
            setSelectedStore(null);
        }
        let temp = [...filtersApplied];
        if (selectedContinent !== null) {
            if (temp.length > 0 && Object.keys(temp[0])[0] === 'Continent') {
                temp[0] = { Continent: selectedContinent.name };
            } else {
                temp.unshift({ Continent: selectedContinent.name });
            }
        } else {
            if (temp.length > 0 && Object.keys(temp[0])[0] === 'Continent') temp.shift();
        }

        setFiltersApplied(temp);
    }, [selectedContinent]);

    useEffect(() => {
        let filteredPlaces = [...allPlaces];
        let tempFiltersFiltered = [];
        if (selectedContinent) {
            filteredPlaces = filteredPlaces.filter((x) => x.continent === selectedContinent.id);

            tempFiltersFiltered = allFilters.filter((x) => x.type !== 'continent' && x.continent === selectedContinent.id);
        }
        if (selectedCountry) {
            filteredPlaces = filteredPlaces.filter((x) => x.country === selectedCountry.id);

            tempFiltersFiltered = allFilters.filter((x) => x.type !== 'continent' && x.type !== 'country' && x.country === selectedCountry.id);
        }
        if (selectedStore) {
            filteredPlaces = filteredPlaces.filter((x) => x._id === selectedStore.id);
        }
        if (filtersApplied.length === 0) {
            tempFiltersFiltered = [...allFilters];
        }
        setFilteredFilters(tempFiltersFiltered);
        setPlaces(filteredPlaces);

    }, [allPlaces, filtersApplied, isRefetch]);

    return (
        <Root className={classes.content}>
            <div style={{
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'center',
                marginTop: '5px',
            }}>
            </div>
            <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', height: '90vh', width: '100%', flexDirection: 'row' }}>
                    <Box sx={{
                        display: 'flex',
                        height: '100%',
                        width: '20%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                    >
                        {showStoreOnlineWidget === true && (
                            <Paper sx={{ width: '90%', marginTop: 1 }} elevation={10} >
                                <CustomLinearProgress
                                    title="Stores Online"
                                    subTitle={widget.onlineStoreText}
                                    value={widget.onlineStore}
                                    color={widget.onlineStoreColor}
                                />
                            </Paper>
                        )}
                        {showAttendedLanesWidget === true && (
                            <Paper sx={{ width: '90%', marginTop: 1 }} elevation={10}>
                                <CustomLinearProgress
                                    title="Attended Lanes Up"
                                    subTitle={widget.laneUpText}
                                    value={widget.laneUp}
                                    color={widget.laneUpColor}
                                />
                            </Paper>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', width: '80%', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <Autocomplete
                                key={autocompleteKey}
                                disableClearable
                                sx={{ padding: 1, width: '70%' }}
                                freeSolo
                                filterOptions={filterOptions}
                                onChange={handleFilterSelected}
                                getOptionLabel={(option) => option.display}
                                options={filteredFilters}
                                renderOption={(params, option) => {
                                    return (
                                        <li {...params} key={option.id}>
                                            {option.display}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => <TextField {...params} label={'Filter Options'}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            const inputValue = event.target.value;
                                            const selectedOption = filteredFilters.find(
                                                (option) => (option.display).toUpperCase() === inputValue.toUpperCase()
                                            );
                                            if (selectedOption) {
                                                handleFilterSelected(event, selectedOption);
                                            }
                                        }
                                    }} />}
                            />
                            <Typography sx={{ alignSelf: 'center' }}>Only Stores with Problems</Typography>

                            <Switch
                                sx={{ alignSelf: 'center' }}
                                onChange={toggleShowOnlyDownStores}
                                checked={showOnlyDownStores}
                                color='success'
                            />
                        </Box>
                        <AppliedFilterDisplay
                            filtersApplied={filtersApplied}
                            handleFilterDelete={handleFilterDelete}
                        />
                        <Card elevation={10} sx={{ margin: 1, display: 'flex', flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                            >{places?.length > 0 && mapParams ?
                                <GoogleMap
                                    places={places}
                                    setMapParams={setMapParams}
                                    mapParams={mapParams}
                                    isFilterSelect={isFilterSelect}
                                /> : <CircularProgress />}
                            </Box>
                        </Card>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', paddingRight: 8 }}>
                    <Button
                        color='info'
                        variant='contained'
                        onClick={handleSubmitMap}
                        sx={{
                            width: '200px',
                            height: '40px',
                        }}
                    >
                        Save Current View
                    </Button>
                    <Snackbar
                        open={open}
                        autoHideDuration={SuccessToastDuration}
                        onClose={() => setOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <SnackbarContent
                            message={message}
                            style={{ backgroundColor: message === 'Default map view saved successfully' ? '#5BA52E' : 'red' }}
                        />
                    </Snackbar>
                </Box>
                <Box sx={{ alignItems: 'center' }}>
                    <Copyright />
                </Box>
            </Box>
        </Root>
    );
}


