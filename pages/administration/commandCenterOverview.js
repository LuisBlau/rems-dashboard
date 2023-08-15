/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { CustomLinearProgress } from '../../components/LinearProgress';
import { styled } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import GoogleMap from '../../components/Maps/GoogleMap';
import { useMsal } from '@azure/msal-react';
import { Button, Card, Paper, Snackbar, SnackbarContent, CircularProgress } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { now } from 'lodash';

const PREFIX = 'commandCenterOverview';

const classes = {
    content: `${PREFIX}-content`,
};
import UserContext from '../UserContext';

const Root = styled('main')(() => ({
    [`&.${classes.content}`]: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#BEBEBE'
    },
}));

const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => option.str
});

function AppliedFilterDisplay({ filtersApplied, handleFilterDelete }) {
    return (
        <Stack sx={{ paddingLeft: 2, paddingBottom: 2 }} direction="row" spacing={1}>
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

export default function CommandCenterOverview() {
    const [places, setPlaces] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedFilterRetailer, setSelectedFilterRetailer] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [allRetailers, setAllRetailers] = useState([]);
    const [showStoreOnlineWidget, setShowStoreOnlineWidget] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAttendedLanesWidget, setShowAttendedLanesWidget] = useState(false);
    const [showOnlyDownStores, setShowOnlyDownStores] = useState(false);
    const [pasSubscriptionTier, setPasSubscriptionTier] = useState(false);
    const [b2bFlag, setB2bFlag] = useState(false);
    const [showFilterBar, setShowFilterBar] = useState(false);
    const [allFilters, setAllFilters] = useState([]);
    const [storesOnline, setStoresOnline] = useState(0);
    const [pullStorePeriodically, setPullStorePeriodically] = useState(0);
    const [lanesUp, setLanesUp] = useState(null)
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [isFilterSelect, setIsFilterSelect] = useState(false);
    const [mapParams, setMapParams] = useState(null)
    const [storesOnlineWidgetErrorPercentage, setStoresOnlineWidgetErrorPercentage] = useState(0)
    const [attendedLanesOnlineWidgetErrorPercentage, setAttendedLanesOnlineWidgetErrorPercentage] = useState(0)
    const [filteredFilters, setFilteredFilters] = useState([]);
    const [autocompleteKey, setAutocompleteKey] = useState('');
    const [configItems, setConfigItems] = useState([])
    const context = useContext(UserContext)
    const [isRefetch, setIsRefetch] = useState(null);
    const { accounts } = useMsal();
    const username = accounts.length > 0 ? accounts[0].username : '';
    const SuccessToastDuration = 4000;

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

    const handleFilterSelected = (e, selectedValue) => {
        if (selectedValue !== null) {
            if (selectedValue.type === 'Store') {
                setSelectedStore({ id: selectedValue.id, name: selectedValue.name });
            } else if (selectedValue.type === 'Retailer') {
                setSelectedFilterRetailer({ id: selectedValue.id, name: selectedValue.name });
            } else if (selectedValue.type === 'Country') {
                setSelectedCountry({ id: selectedValue.id, name: selectedValue.name });
            } else if (selectedValue.type === 'Continent') {
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

    const toggleShowOnlyDownStores = () => {
        setShowOnlyDownStores(!showOnlyDownStores);
    };

    const handleFilterDelete = (filter) => () => {
        if (Object.keys(filter)[0] === 'Store') {
            setSelectedStore(null);
        } else if (Object.keys(filter)[0] === 'Retailer') {
            setSelectedFilterRetailer(null);
        } else if (Object.keys(filter)[0] === 'Country') {
            setSelectedCountry(null);
        } else if (Object.keys(filter)[0] === 'Continent') {
            setSelectedContinent(null);
        }
        // this is a little hack to place the map to the selected filter
        setIsFilterSelect(true)
        setMapParams({
            userMapCenter: { ...mapParams.userMapCenter },
            userMapZoom: 3,
        })
        setTimeout(() => {
            setIsFilterSelect(false)
        }, 500);
    };

    const applyAllPreviouslyAppliedFilters = () => {
        if (filtersApplied.length !== 0) {
            let filteredPlaces = [...allPlaces]
            filtersApplied.forEach((filter) => {
                if (Object.keys(filter)[0] === 'Retailer') {
                    filteredPlaces = filteredPlaces.filter((x) => x.retailer_id === selectedFilterRetailer.id);
                } else if (Object.keys(filter)[0] === 'Store') {
                    filteredPlaces = filteredPlaces.filter((x) => x._id === selectedStore.id);
                } else if (Object.keys(filter)[0] === 'Country') {
                    filteredPlaces = filteredPlaces.filter((x) => x.country === selectedCountry.id);
                } else if (Object.keys(filter)[0] === 'Continent') {
                    filteredPlaces = filteredPlaces.filter((x) => x.continent === selectedContinent.name);
                }
            });
            setPlaces(filteredPlaces);

        } else {
            setPlaces(allPlaces);
        }
    }

    const [widget, setWidget] = useState({
        onlineStore: 0,
        onlineStoreText: '0/0',
        onlineStoreColor: 'success',
        laneUp: 0,
        laneUpText: '0/0',
        laneUpColor: 'success'
    })

    useEffect(() => {
        if (context?.retailerConfigs?.length > 0) {
            // fetch configuration info
            const configurationArray = context.retailerConfigs;
            const configurationInfo = [];
            configurationArray.forEach(configObject => {
                const innerArray = Object.values(configObject)[0];
                configurationInfo.push(innerArray);
            });
            setConfigItems(configurationInfo)
            setStoresOnlineWidgetErrorPercentage(configurationInfo?.find(item => item.configName === 'storesOnlineWidgetErrorPercentage').configValue);
            setAttendedLanesOnlineWidgetErrorPercentage(configurationInfo?.find(item => item.configName === 'laneWidgetRedWhenAbovePercent').configValue);
            setPullStorePeriodically(configurationInfo?.find(item => item.configName === 'pullStorePeriodically').configValue);
            setShowStoreOnlineWidget(configurationInfo?.find(item => item.configName === 'commandCenterOverviewStoreOnlineWidget').configValue);
            setShowAttendedLanesWidget(configurationInfo?.find(item => item.configName === 'commandCenterOverviewAttendedLanesUpWidget').configValue);
        }
    }, [context.retailerConfigs]);

    useEffect(() => {
        if (configItems.length > 0) {
            if (storesOnline && lanesUp) {
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
    }, [configItems, storesOnline, lanesUp, storesOnlineWidgetErrorPercentage, attendedLanesOnlineWidgetErrorPercentage,])

    async function fetchData(isRefetch = false) {
        const stores = [];
        const localAllFilters = [];

        const localCountries = [];
        const localContinents = [];
        const localRetailers = [];
        const localStores = [];
        if (allRetailers.length === 0) {
            await axios.get('/api/REMS/getAllRetailerDetails').then(function (res) {
                setAllRetailers(res.data);
            })
        }

        await axios.get('/api/REMS/allStores').then(function (res) {
            setLoading(false);
            let totalStoreCount = 0;
            let onlineStoreCount = 0;
            let onlineAgentsCount = 0;
            let totalOnlineAgentsCount = 0;
            let onlineLanesCount = 0;
            let totalLanesCount = 0;
            res.data.forEach((store) => {
                totalStoreCount++;
                //find count total store and find count stores that has online=true
                if (store.online) onlineStoreCount++;
                if (!isNaN(store.onlineAgents))
                    onlineAgentsCount = onlineAgentsCount + store.onlineAgents;
                if (!isNaN(store.totalAgents))
                    totalOnlineAgentsCount = totalOnlineAgentsCount + store.totalAgents;

                if (!isNaN(store.onlineLanes))
                    onlineLanesCount = onlineLanesCount + store.onlineLanes;
                if (!isNaN(store.totalLanes))
                    totalLanesCount = totalLanesCount + store.totalLanes;

                // only able to map stores we have the lat/lng for
                if (store.geometry && store.country && store.continent && store.retailer_id) {

                    if (store.totalAgents > 0 && (store.onlineAgents / store.totalAgents) * 100 < 80) {
                        // red
                        store.status = '#FF0000';
                    } else if (store.totalAgents === 0 || (store.onlineAgents / store.totalAgents) * 100 >= 80) {
                        // green
                        store.status = '#00FF00';
                    } else {
                        // blue
                        store.status = '#0000FF';
                    }
                    if (localContinents.findIndex((x) => x.name === store.continent) === -1) {
                        localContinents.push({
                            id: `continent-${store.continent}`,
                            name: `${store.continent}`,
                            display: `${store.continent}`,
                            type: 'Continent',
                            str: `${store.continent}`
                        });
                    }
                    if (localCountries.findIndex((x) => x.name === store.country) === -1) {
                        localCountries.push({
                            id: `${store.country}`,
                            name: `${store.country}`,
                            type: 'Country',
                            display: `${store.country}`,
                            continent: `${store.continent}`,
                            str: `${store.continent} ${store.country}`
                        });
                    }
                    if (store.tenant_id === undefined) {
                        if (localRetailers.findIndex((x) => x.id === store.retailer_id) === -1) {
                            localRetailers.push({
                                id: `${store.retailer_id}`,
                                type: 'Retailer',
                                name: '',
                                display: '',
                                continent: `${store.continent}`,
                                country: `${store.country}`,
                                str: `${store.continent} ${store.country}`
                            });
                        }
                    } else {
                        if (localRetailers.findIndex((x) => x.id === store.tenant_id) === -1) {
                            localRetailers.push({
                                id: `${store.tenant_id}`,
                                type: 'Retailer',
                                subtype: 'Tenant',
                                name: '',
                                display: '',
                                continent: `${store.continent}`,
                                country: `${store.country}`,
                                str: `${store.continent} ${store.country}`
                            });
                        }
                    }
                    if (store.tenant_id === undefined) {
                        localStores.push({
                            id: `${store._id}`,
                            type: 'Store',
                            name: `${store.storeName}`,
                            display: `${store.storeName}`,
                            continent: `${store.continent}`,
                            country: `${store.country}`,
                            retailer: `${store.retailer_id}`,
                            str: `${store.continent} ${store.country}`
                        });
                    } else {
                        localStores.push({
                            id: `${store._id}`,
                            type: 'Store',
                            name: `${store.storeName}`,
                            display: `${store.storeName}`,
                            continent: `${store.continent}`,
                            country: `${store.country}`,
                            retailer: `${store.tenant_id}`,
                            str: `${store.continent} ${store.country}`
                        });
                    }
                    stores.push(store);
                }
            });

            localAllFilters.push(...localContinents, ...localCountries, ...localRetailers, ...localStores);
            setStoresOnline({ 'online': onlineStoreCount, 'total': totalStoreCount, 'percentUp': ((onlineStoreCount / totalStoreCount) * 100) });
            setLanesUp({ 'online': onlineLanesCount, 'total': totalLanesCount, 'percentUp': ((onlineLanesCount / totalLanesCount) * 100) });
            setAllPlaces(stores);
            setAllFilters(localAllFilters);
            if (!isRefetch) {
                setPlaces(stores);
                setFilteredFilters(localAllFilters);
            }
        });
    }

    useEffect(() => {
        let totalStoreCount = 0;
        let onlineStoreCount = 0;
        let onlineAgentsCount = 0;
        let totalOnlineAgentsCount = 0;
        let onlineLanesCount = 0;
        let totalLanesCount = 0;
        let placesResult = places;
        if (showOnlyDownStores) {
            placesResult = places.filter((x) => x.status === '#FF0000')
        }
        placesResult?.filter((item) => {
            if (b2bFlag === true && pasSubscriptionTier === true) {
                return item.isB2B && ['advanced', 'lite'].includes(item.tier);
            } else if (b2bFlag === true && pasSubscriptionTier === false) {
                return item.isB2B;
            } else if (b2bFlag === false && pasSubscriptionTier === true) {
                return ['advanced', 'lite'].includes(item.tier);
            } else {
                return true;
            }
        }).map((store) => {
            totalStoreCount++;
            //find count total store and find count stores that has online=true
            if (store.online) onlineStoreCount++;
            if (!isNaN(store.onlineAgents))
                onlineAgentsCount = onlineAgentsCount + store.onlineAgents;
            if (!isNaN(store.totalAgents))
                totalOnlineAgentsCount = totalOnlineAgentsCount + store.totalAgents;

            if (!isNaN(store.onlineLanes))
                onlineLanesCount = onlineLanesCount + store.onlineLanes;
            if (!isNaN(store.totalLanes))
                totalLanesCount = totalLanesCount + store.totalLanes;
            setStoresOnline({ 'online': onlineStoreCount, 'total': totalStoreCount, 'percentUp': ((onlineStoreCount / totalStoreCount) * 100) });
            setLanesUp({ 'online': onlineLanesCount, 'total': totalLanesCount, 'percentUp': ((onlineLanesCount / totalLanesCount) * 100) });
        })

    }, [filtersApplied, places, b2bFlag, pasSubscriptionTier, showOnlyDownStores])

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, []);

    useEffect(() => {
        if (allRetailers && pullStorePeriodically > 0) {
            const interval = setInterval(() => {
                setIsRefetch(Math.random());
                fetchData(true)
            }, pullStorePeriodically);
            return () => clearInterval(interval);
        }
    }, [pullStorePeriodically]);

    useEffect(() => {
        if (allFilters.length > 0 && allRetailers.length > 0) {
            allFilters.forEach((filter) => {
                let detail;
                if (filter.type === 'Retailer' && filter.name === '') {
                    detail = allRetailers.find((x) => x.retailer_id === filter.id);
                    if (detail !== undefined) {
                        filter.name = detail.description;
                        filter.display = `${filter.name}${filter.display}`;
                        filter.str = `${filter.str} ${filter.name}`;
                        if (detail?.configuration?.isB2B === 'true') {
                            filter.isB2B = true;
                        } else {
                            filter.isB2B = false;
                        }
                        filter.tier = detail?.configuration?.pas_subscription_tier;
                    }
                } else if (filter.type === 'Store') {
                    detail = allRetailers.find((x) => x.retailer_id === filter.retailer);
                    if (detail !== undefined) {
                        filter.str = `${filter.str} ${detail.description} ${filter.name}`;
                        if (detail?.configuration?.isB2B === 'true') {
                            filter.isB2B = true;
                        } else {
                            filter.isB2B = false;
                        }
                        filter.tier = detail?.configuration?.pas_subscription_tier;
                    }
                }
            });
        }
    }, [allFilters, allRetailers]);

    useEffect(() => {
        if (selectedContinent !== null && selectedCountry !== null && selectedFilterRetailer !== null) {
            let temp = [...filtersApplied];
            temp.splice(3);
            if (selectedStore !== null) temp.push({ Store: selectedStore.name });
            setFiltersApplied(temp);
        } else if (((selectedContinent === null) + (selectedCountry === null) + (selectedFilterRetailer === null)) === 1) {
            let temp = [...filtersApplied];
            temp.splice(2);
            if (selectedStore !== null) temp.push({ Store: selectedStore.name });
            setFiltersApplied(temp);
        } else if (((selectedContinent === null) + (selectedCountry === null) + (selectedFilterRetailer === null)) === 2) {
            let temp = [...filtersApplied];
            temp.splice(1);
            if (selectedStore !== null) temp.push({ Store: selectedStore.name });
            setFiltersApplied(temp);
        } else {
            let temp = [...filtersApplied];
            temp.splice(0);
            if (selectedStore !== null) temp.push({ Store: selectedStore.name });
            setFiltersApplied(temp);
        }
    }, [selectedStore]);

    useEffect(() => {
        if (selectedStore !== null) {
            setSelectedStore(null);
        }
        if (selectedContinent !== null && selectedCountry !== null) {
            let temp = [...filtersApplied];
            temp.splice(2);
            if (selectedFilterRetailer !== null) temp.push({ Retailer: selectedFilterRetailer.name });
            setFiltersApplied(temp);
        } else if ((selectedContinent === null) ^ (selectedCountry === null)) {
            let temp = [...filtersApplied];
            temp.splice(1);
            if (selectedFilterRetailer !== null) temp.push({ Retailer: selectedFilterRetailer.name });
            setFiltersApplied(temp);
        } else {
            let temp = [...filtersApplied];
            temp.splice(0);
            if (selectedFilterRetailer !== null) temp.push({ Retailer: selectedFilterRetailer.name });
            setFiltersApplied(temp);
        }
    }, [selectedFilterRetailer]);

    useEffect(() => {
        if (selectedStore !== null) {
            setSelectedStore(null);
        }
        let temp = [...filtersApplied];
        if (selectedContinent !== null) {
            if (selectedCountry !== null) {
                if (temp.length > 1 && Object.keys(temp[1])[0] === 'Country') {
                    temp[1] = { Country: selectedCountry.name };
                } else {
                    let rest = temp.splice(1);
                    rest.unshift({ Country: selectedCountry.name });
                    temp = [...temp, ...rest];
                }
            } else {
                if (temp.length > 1 && Object.keys(temp[1])[0] === 'Country') {
                    let rest = temp.splice(1);
                    rest.shift();
                    temp = [...temp, ...rest];
                }
            }
        } else {
            if (selectedCountry !== null) {
                if (temp.length > 0 && Object.keys(temp[0])[0] === 'Country') {
                    temp[0] = { Country: selectedCountry.name };
                } else {
                    temp.unshift({ Country: selectedCountry.name });
                }
            } else {
                temp.shift();
            }
        }
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
            filteredPlaces = filteredPlaces.filter((x) => x.continent === selectedContinent.name);

            tempFiltersFiltered = allFilters.filter((x) => x.type !== 'Continent' && x.continent === selectedContinent.name);
        }
        if (selectedCountry) {
            filteredPlaces = filteredPlaces.filter((x) => x.country === selectedCountry.id);

            tempFiltersFiltered = allFilters.filter((x) => x.type !== 'Continent' && x.type !== 'Country' && x.country === selectedCountry.id);
        }
        if (selectedFilterRetailer) {
            filteredPlaces = filteredPlaces.filter((x) => (x?.retailer_id === selectedFilterRetailer.id || x?.tenant_id === selectedFilterRetailer.id));

            if (selectedCountry) {
                tempFiltersFiltered = allFilters.filter((x) => (x.type === 'Store' && x.retailer === selectedFilterRetailer.id));
            } else {
                tempFiltersFiltered = allFilters.filter((x) => (x.type === 'Store' && x.retailer === selectedFilterRetailer.id) || x.type === 'Country');
            }
            if (selectedContinent) {
                tempFiltersFiltered = tempFiltersFiltered.filter((x) => x.continent === selectedContinent.name);
            }
        }
        if (selectedStore) {
            filteredPlaces = filteredPlaces.filter((x) => x._id === selectedStore.id);
        }
        if (filtersApplied.length === 0) {
            tempFiltersFiltered = [...allFilters];
        }
        setFilteredFilters(tempFiltersFiltered);
        setPlaces(filteredPlaces);
    }, [allPlaces, filtersApplied]);

    useEffect(() => {
        if (places.length > 0 && allPlaces.length > 0 && allRetailers.length > 0) {
            places.forEach((place) => {
                const storeRetailer = allRetailers.find((x) => x.retailer_id === place.retailer_id || x.retailer_id === place?.tenant_id);
                if (storeRetailer !== undefined) {
                    place.description = storeRetailer.description;
                    if (storeRetailer?.configuration?.isB2B === 'true') {
                        place.isB2B = true;
                    } else {
                        place.isB2B = false;
                    }
                    place.tier = storeRetailer?.configuration?.pas_subscription_tier;
                }
            });
        }
    }, [places, allPlaces, allRetailers]);

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

    let placesResult = places;
    if (showOnlyDownStores) {
        placesResult = places?.filter((x) => x.status === '#FF0000')
    }
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
                <Box sx={{ display: 'flex', height: '98vh', width: '100%', flexDirection: 'row' }}>
                    <Box sx={{
                        display: 'flex',
                        height: '90%',
                        width: '20%',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                        <Box sx={{
                            display: 'flex',
                            height: '10%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 1
                        }}>
                            <Typography sx={{ alignSelf: 'center' }}>Show/Hide Search bar</Typography>
                            <Switch
                                color="success" checked={showFilterBar}
                                onChange={() => setShowFilterBar(!showFilterBar)}
                            />
                        </Box>
                        <Button
                            color='info'
                            variant='contained'
                            onClick={handleSubmitMap}
                        >Save Current View</Button>
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', height: '100%', justifyContent: 'space-around' }}>
                            {showStoreOnlineWidget === true && (
                                <Paper sx={{ width: '100%', backgroundColor: '#f5f5f5', marginTop: 5 }} elevation={10} >
                                    <CustomLinearProgress
                                        title="Stores Online"
                                        subTitle={widget.onlineStoreText}
                                        value={widget.onlineStore}
                                        color={widget.onlineStoreColor}
                                    />
                                </Paper>
                            )}

                            {showAttendedLanesWidget === true && (
                                <Paper sx={{ width: '100%', marginTop: 1 }} elevation={10}>
                                    <CustomLinearProgress
                                        title="Attended Lanes Up"
                                        subTitle={widget.laneUpText}
                                        value={widget.laneUp}
                                        color={widget.laneUpColor}
                                    />
                                </Paper>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', height: '100%' }}>
                        {
                            !showFilterBar && (
                                <>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                        <Autocomplete
                                            key={autocompleteKey}
                                            disableClearable
                                            sx={{ padding: 1, width: '70%' }}
                                            freeSolo
                                            filterOptions={filterOptions}
                                            onChange={handleFilterSelected}
                                            getOptionLabel={(option) => option.display}
                                            options={filteredFilters.filter((item) => {
                                                if (item.type !== 'Retailer' && item.type !== 'Store') return true;
                                                if (b2bFlag === true && pasSubscriptionTier === true) {
                                                    return item.isB2B && ['advanced', 'lite'].includes(item.tier);
                                                } else if (b2bFlag === true && pasSubscriptionTier === false) {
                                                    return item.isB2B;
                                                } else if (b2bFlag === false && pasSubscriptionTier === true) {
                                                    return ['advanced', 'lite'].includes(item.tier);
                                                }
                                                return true;
                                            })}
                                            renderOption={(params, option) => {
                                                return (
                                                    <li {...params} key={option.id}>
                                                        {option.display}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => <TextField sx={{ backgroundColor: 'white' }} {...params} label={'Filter Options'} />}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Switch
                                                    sx={{ alignSelf: 'center' }}
                                                    onChange={toggleShowOnlyDownStores}
                                                    checked={showOnlyDownStores}
                                                    color="success"
                                                />
                                                <Typography sx={{ alignSelf: 'center' }}>Problems</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Switch
                                                    sx={{ alignSelf: 'center' }}
                                                    onChange={() => setPasSubscriptionTier(p => !p)}
                                                    checked={pasSubscriptionTier}
                                                    color="success"
                                                />
                                                <Typography sx={{ alignSelf: 'center' }}>PAS</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>

                                                <Switch
                                                    sx={{ alignSelf: 'center' }}
                                                    onChange={() => setB2bFlag(p => !p)}
                                                    checked={b2bFlag}
                                                    color="success"
                                                />
                                                <Typography sx={{ alignSelf: 'center' }}>B2B</Typography>

                                            </Box>
                                        </Box>
                                    </Box>
                                    <AppliedFilterDisplay
                                        filtersApplied={filtersApplied}
                                        handleFilterDelete={handleFilterDelete}
                                    />
                                </>
                            )
                        }
                        <Card elevation={10} sx={{ margin: 1, display: 'flex', flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                                {loading && <CircularProgress />}
                                {placesResult?.length > 0 && mapParams ?
                                    <GoogleMap
                                        places={placesResult.filter((item) => {
                                            if (b2bFlag === true && pasSubscriptionTier === true) {
                                                return item.isB2B && ['advanced', 'lite'].includes(item.tier);
                                            } else if (b2bFlag === true && pasSubscriptionTier === false) {
                                                return item.isB2B;
                                            } else if (b2bFlag === false && pasSubscriptionTier === true) {
                                                return ['advanced', 'lite'].includes(item.tier);
                                            } else {
                                                return true;
                                            }
                                        })}
                                        isFilterSelect={isFilterSelect}
                                        setMapParams={setMapParams}
                                        mapParams={mapParams}
                                    /> : <Typography variant='h5'>{!loading && 'No store'}</Typography>}
                            </Box>
                        </Card>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Root >
    );
}

