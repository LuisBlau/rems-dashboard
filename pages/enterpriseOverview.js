/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
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
    Snackbar, SnackbarContent, Tooltip, Fade,
} from '@mui/material';
import axios from 'axios';
import _, { isEmpty, now } from 'lodash';
import Copyright from '../components/Copyright';
import { CustomLinearProgress } from '../components/LinearProgress';
import { useContext } from 'react';
import UserContext from './UserContext';
import { useMsal } from '@azure/msal-react';
import StoresOnlineList from '../components/EnterpriseOverview/StoresOnlineList';
import AttendedLanesList from '../components/EnterpriseOverview/AttendedLanesList';
import DeviceList from '../components/EnterpriseOverview/DeviceList';
import moment from 'moment';
import MobileHandheldsList from '../components/EnterpriseOverview/MobileHandheldsList';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Link from 'next/link';
import RsmpPeripheralsList from '../components/EnterpriseOverview/RsmpPeripheralsList';
import PeripheralsList from '../components/EnterpriseOverview/PeripheralsList';
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
    let par = ''
    if (typeof window !== 'undefined') {
        par = window.location.search;
    }
    const [places, setPlaces] = useState([]);
    const [devices, setDevices] = useState([])
    const [handhelds, setHandhelds] = useState([])
    const [peripherals, setPeripherals] = useState([])
    const [rsmpPeripherals, setRsmpPeripherals] = useState([])
    const [attendedLanes, setAttendedLanes] = useState(null)
    const [allPlaces, setAllPlaces] = useState([]);
    const [selectedContinent, setSelectedContinent] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [filtersApplied, setFiltersApplied] = useState([]);
    const [allFilters, setAllFilters] = useState([]);
    const [filteredFilters, setFilteredFilters] = useState([]);
    const [allRetailers, setAllRetailers] = useState([]);
    const [showOnlyDownStores, setShowOnlyDownStores] = useState(false);
    const [storesOnline, setStoresOnline] = useState(null);
    const [autocompleteKey, setAutocompleteKey] = useState('');
    const [lanesUp, setLanesUp] = useState(null);
    const [devicesUp, setDevicesUp] = useState(null);
    const [handheldsUp, setHandheldsUp] = useState(null)
    const [peripheralsUp, setPeripheralsUp] = useState(null)
    const [rsmpPeripheralsUp, setRsmpPeripheralsUp] = useState(null)
    const [pullStorePeriodically, setPullStorePeriodically] = useState(0);
    const [isFilterSelect, setIsFilterSelect] = useState(false);
    const [showStoreOnlineWidget, setShowStoreOnlineWidget] = useState(false);
    const [isListView, setIsListView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAttendedLanesWidget, setShowAttendedLanesWidget] = useState(false);
    const [showDevicesWidget, setShowDevicesWidget] = useState(false);
    const [showRsmpPeripheralsWidget, setShowRsmpPeripheralsWidget] = useState(false);
    const [showPeripheralsWidget, setShowPeripheralsWidget] = useState(false);
    const [showHandheldsWidget, setShowHandheldsWidget] = useState(false);
    const [devicesWidgetErrorPercentage, setDevicesWidgetErrorPercentage] = useState(0)
    const [storesOnlineWidgetErrorPercentage, setStoresOnlineWidgetErrorPercentage] = useState(0)
    const [attendedLanesOnlineWidgetErrorPercentage, setAttendedLanesOnlineWidgetErrorPercentage] = useState(0)
    const [configInfo, setConfigInfo] = useState([]);
    const [allStores, setAllStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [filteredPeripherals, setFilteredPeripherals] = useState([])
    const [onlineStoreWidget, setOnlineStoreWidget] = useState({
        onlineStore: 0,
        onlineStoreText: null,
        onlineStoreColor: 'success',
    });
    const [laneUpWidget, setLaneUpWidget] = useState({
        laneUp: 0,
        laneUpText: null,
        laneUpColor: 'success',
        loading: true
    });
    const [devicesUpWidget, setDevicesUpWidget] = useState({
        devicesUp: 0,
        devicesUpText: null,
        devicesUpColor: 'success'
    })
    const [handheldsUpWidget, setHandheldsUpWidget] = useState({
        handheldsUp: 0,
        handheldsUpText: null,
        handheldsUpColor: 'success'
    })
    const [rsmpPeripheralsUpWidget, setRsmpPeripheralsUpWidget] = useState({
        rsmpPeripheralsUp: 0,
        rsmpPeripheralsUpText: null,
        rsmpPeripheralsUpColor: 'success'
    })
    const [peripheralsUpWidget, setPeripheralsUpWidget] = useState({
        peripheralsUp: 0,
        peripheralsUpText: null,
        peripheralsUpColor: 'success'
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
    const [goodStoreStatusPercentage, setGoodStoreStatusPercentage] = useState(0);
    const [poorStoreStatusPercentage, setPoorStoreStatusPercentage] = useState(0);
    const [isStoresOnlineListView, setIsStoresOnlineListView] = useState(false)
    const [isRsmpPeripheralsListView, setIsRsmpPeripheralsListView] = useState(false)
    const [isPeripheralsListView, setIsPeripheralsListView] = useState(false)
    const [isAttendedLanesListView, setIsAttendedLanesListView] = useState(false)
    const [isDevicesListView, setIsDevicesListView] = useState(false)
    const [disconnectTimeLimit, setDisconnectTimeLimit] = useState(24)
    const [isHandheldsListView, setIsHandheldsListView] = useState(false)
    const [remsAreGood, setRemsAreGood] = useState(true)

    useEffect(() => {
        setSelectedRetailer('');
        setPeripheralsUp(null)
        setRsmpPeripheralsUp(null)
        setHandheldsUp(null)
        setDevicesUp(null);
        setLaneUpWidget({
            laneUp: 0,
            laneUpText: null,
            laneUpColor: 'success',
            loading: true
        });
        setOnlineStoreWidget(null);
        setStoresOnline(null);
        setLanesUp(null);
        setDevicesUpWidget(null)
        setPlaces([])
        setAllPlaces([])
        setAllStores([])
        setAttendedLanes([])
        setDevices([])
        setPeripherals([])
        setRsmpPeripherals([])
        setHandhelds([])
        setFilteredFilters([])
        setShowAttendedLanesWidget(false);
        setShowDevicesWidget(false);
        setShowStoreOnlineWidget(false);
        setShowRsmpPeripheralsWidget(false)
        setShowPeripheralsWidget(false);
        setConfigInfo([]);
        setSelectedContinent(null);
        setSelectedCountry(null);
        setSelectedStore(null);
        setFiltersApplied([]);
        setIsListView(false);
        setIsAttendedLanesListView(false);
        setIsDevicesListView(false);
        setIsHandheldsListView(false);
        setIsPeripheralsListView(false);
        setIsStoresOnlineListView(false)
        if (context?.selectedRetailer) {
            setTimeout(() => {
                setSelectedRetailer(context.selectedRetailer);
            }, 500);
        }
        if (context?.selectedRetailer) {
            axios.get(`/api/retailers/getConfiguration?isAdmin=true&retailerId=${context.selectedRetailer}`).then(function (res) {
                const configurationArray = res.data.configuration;
                const configurationInfo = [];
                configurationArray.forEach(configObject => {
                    const innerArray = Object.values(configObject)[0];
                    configurationInfo.push(innerArray);
                });
                setDisconnectTimeLimit(configurationInfo.find(item => item.configName === 'storeDisconnectTimeLimit').configValue)
            })
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
    }, [context?.userDetails?.userDefinedMapConfig])

    useEffect(() => {
        if (context?.retailerConfigs?.length > 0) {
            // fetch configuration info
            const configurationArray = context.retailerConfigs;
            const configurationInfo = [];
            configurationArray.forEach(configObject => {
                const innerArray = Object.values(configObject)[0];
                configurationInfo.push(innerArray);
            });
            setConfigInfo(configurationInfo)
            setShowRsmpPeripheralsWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewRsmpPeripheralsWidget').configValue)
            setShowPeripheralsWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewPeripheralsWidget').configValue)
            setShowHandheldsWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewHandheldsWidget').configValue)
            setShowStoreOnlineWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewStoreOnlineWidget').configValue)
            setShowDevicesWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewDevicesWidget').configValue)
            setDevicesWidgetErrorPercentage(configurationInfo.find(item => item.configName === 'deviceWidgetRedWhenAbovePercent').configValue)
            setShowAttendedLanesWidget(configurationInfo.find(item => item.configName === 'enterpriseOverviewAttendedLanesUpWidget').configValue)
            setStoresOnlineWidgetErrorPercentage(configurationInfo.find(item => item.configName === 'storesOnlineWidgetErrorPercentage').configValue)
            setAttendedLanesOnlineWidgetErrorPercentage(configurationInfo.find(item => item.configName === 'laneWidgetRedWhenAbovePercent').configValue)
            setPullStorePeriodically(configurationInfo.find(item => item.configName === 'pullStorePeriodically').configValue)
            setPoorStoreStatusPercentage(configurationInfo.find(item => item.configName === 'PoorStoreStatusPercentage').configValue)
            setGoodStoreStatusPercentage(configurationInfo.find(item => item.configName === 'GoodStoreStatusPercentage').configValue)
        }
    }, [context?.retailerConfigs, selectedRetailer])

    useEffect(() => {
        if (configInfo.length > 0 && storesOnline) {
            setOnlineStoreWidget({
                onlineStore: storesOnline?.percentUp,
                onlineStoreText: `${storesOnline?.online}/${storesOnline?.total}`,
                onlineStoreColor: storesOnline?.percentUp > storesOnlineWidgetErrorPercentage ? 'success' : 'error',
            });
        }
    }, [storesOnline, configInfo, storesOnlineWidgetErrorPercentage])

    useEffect(() => {
        if (configInfo.length > 0 && lanesUp) {
            setLaneUpWidget({
                laneUp: lanesUp?.percentUp,
                laneUpText: `${lanesUp?.online}/${lanesUp?.total}`,
                laneUpColor: lanesUp?.percentUp > attendedLanesOnlineWidgetErrorPercentage ? 'success' : 'error',
                loading: false
            });
        }
    }, [lanesUp, configInfo, attendedLanesOnlineWidgetErrorPercentage])


    useEffect(() => {
        if (configInfo.length > 0 && devicesUp) {
            setDevicesUpWidget({
                devicesUp: devicesUp?.percentUp,
                devicesUpText: `${devicesUp?.online}/${devicesUp?.total}`,
                devicesUpColor: devicesUp?.percentUp > devicesWidgetErrorPercentage ? 'success' : 'error'
            });
        }
    }, [devicesUp, configInfo, devicesWidgetErrorPercentage])

    useEffect(() => {
        setHandheldsUpWidget({
            handheldsUp: handheldsUp?.percentUp,
            handheldsUpText: `${handheldsUp?.online}/${handheldsUp?.total}`,
            handheldsUpColor: handheldsUp?.percentUp > 50 ? 'success' : 'error'
        })
    }, [handheldsUp])

    useEffect(() => {
        setPeripheralsUpWidget({
            peripheralsUp: peripheralsUp?.percentUp,
            peripheralsUpText: `${peripheralsUp?.online}/${peripheralsUp?.total}`,
            peripheralsUpColor: peripheralsUp?.percentUp > 50 ? 'success' : 'error'
        })
    }, [peripheralsUp])

    useEffect(() => {
        setRsmpPeripheralsUpWidget({
            rsmpPeripheralsUp: rsmpPeripheralsUp?.percentUp,
            rsmpPeripheralsUpText: `${rsmpPeripheralsUp?.online}/${rsmpPeripheralsUp?.total}`,
            rsmpPeripheralsUpColor: rsmpPeripheralsUp?.percentUp > 50 ? 'success' : 'error'
        })
    }, [rsmpPeripheralsUp])

    const handleFilterSelected = (e, selectedValue) => {
        setLoading(true);
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
                setIsFilterSelect(false);
                setLoading(false);
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

    const toggleShowOnlyDownStores = () => {
        setShowOnlyDownStores(!showOnlyDownStores)
    };

    useEffect(() => {
        async function fetchData() {
            await axios.get(`/api/retailers/getAllDetails`).then(function (res) {
                setAllRetailers(res.data);
            })
            await axios.get(`/api/REMS/versionsData?retailer_id=T0BGBBL`).then(function (res) {
                let allRemsAreGood = true
                res.data.rem.forEach(remsServer => {
                    let lastUpdateUnix = remsServer.last_heartbeat_sec
                    let oneHourAgo = moment().subtract(1, 'hours').unix()
                    if (lastUpdateUnix < oneHourAgo) {
                        allRemsAreGood = false
                    }
                })
                setRemsAreGood(allRemsAreGood)
            })
        }
        fetchData()
    }, []);


    function fetchStore(isRefresh = false) {
        const localStoresNoAddress = [];
        const stores = [];
        const localAllFilters = [];
        const localCountries = [];
        const localContinents = [];
        const localStores = [];

        setLoading(true);
        axios.get(`/api/stores/getForRetailer?retailerId=${selectedRetailer}&isTenant=${context.selectedRetailerIsTenant}`).then(function (res) {
            setLoading(false);
            let counter = 0;
            let onlineCounter = 0;
            let upLanes = 0;
            let totalLanes = 0;
            res.data.map((store) => {
                store["label"] = store.storeName;
                const storeRetailer = allRetailers.find((x) => x.retailer_id === store.retailer_id || x?.retailer_id === store?.tenant_id);
                if (storeRetailer !== undefined) {
                    store["description"] = storeRetailer.description
                }
                // only able to map stores we have the lat/lng for
                if (store.geometry && store.continent && store.retailer_id) {
                    // color the marker based on online status
                    if (store.onlineLanes && store.totalLanes) {
                        upLanes += store.onlineLanes
                        totalLanes += store.totalLanes
                    }
                    const signal = store?.onlineAgents / store?.totalAgents * 100;
                    // default orange
                    store.status = '#FA8128';
                    if (store?.online === true) {
                        onlineCounter++
                    } else {
                        store.online = false
                    }
                    if (signal > goodStoreStatusPercentage && store?.online) {
                        // green
                        store.status = '#00FF00';
                    } else if (signal > poorStoreStatusPercentage && signal <= goodStoreStatusPercentage && store?.online) {
                        //yellow
                        store.status = '#FFFF00';
                    }
                    if (store?.last_updated_sec && moment(store?.last_updated_sec * 1000).diff(Date.now(), 'hours') < - disconnectTimeLimit) {
                        // disconnected, red
                        store.status = '#FF0000'
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
                } else {
                    if (store?.online === true) {
                        onlineCounter++
                    }
                    localStoresNoAddress.push({
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
                }
            });
            localAllFilters.push(...localContinents, ...localCountries, ...localStores, ...localStoresNoAddress);
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
            setAllStores(res.data);
            setFilteredStores(res.data);
            setAllPlaces(stores);
            setAllFilters(localAllFilters);
            if (!isRefresh) {
                setPlaces(stores);
                setFilteredFilters(localAllFilters);
            }
        });
    }

    useEffect(() => {
        if (selectedRetailer) {
            let query = { params: { retailerId: selectedRetailer, isLab: false } };
            if (context.selectedRetailerIsTenant && context.selectedRetailerParentRemsServerId) {
                query = {
                    params: {
                        retailerId: context?.selectedRetailerParentRemsServerId,
                        tenantId: selectedRetailer,
                        isLab: true
                    }
                }
            }
            if (showAttendedLanesWidget === true || showAttendedLanesWidget === 'true') {

                axios.get(`/api/REMS/getAttendedLanes`, query).then(function (res) {
                    let totalAttendedLanes = 0
                    let onlineAttendedLanes = 0
                    let localAttendedLanes = []
                    if (res.data.length > 0) {
                        res.data.forEach(agent => {
                            localAttendedLanes.push(agent)
                            if (agent.online === true) {
                                onlineAttendedLanes++
                            }
                            totalAttendedLanes++
                        })
                        setAttendedLanes(localAttendedLanes)
                    }
                });
            }

            if (showDevicesWidget === true || showDevicesWidget === 'true') {
                axios.get(`/api/devices/getDevices`, query).then(function (res) {
                    let localDevices = []
                    if (res.data.length > 0) {
                        res.data.forEach((device, index) => {
                            device.id = index
                            localDevices.push(device)
                        });
                    }
                    setDevices(localDevices)
                    setFilteredDevices(res?.data)
                });
            }

            if (showPeripheralsWidget === true || showPeripheralsWidget === 'true') {
                axios.get(`/api/devices/getPeripherals`, query).then(function (res) {
                    let localPeripherals = []
                    if (res.data.length > 0) {
                        res.data.forEach((device, index) => {
                            device.id = index
                            localPeripherals.push(device)
                        });
                    }
                    setPeripherals(localPeripherals)
                    setFilteredPeripherals(res?.data)
                });
            }

            if (showHandheldsWidget === true || showHandheldsWidget === 'true') {
                axios.get(`/api/rsmpData/getMobileAssets`, query).then(function (res) {
                    let totalHandhelds = 0
                    let onlineHandhelds = 0
                    let localHandhelds = []
                    if (res.data.length > 0) {
                        res.data.forEach((handheld, index) => {
                            handheld.id = index
                            handheld.os = handheld.OsType + '-' + handheld.OsVersion
                            localHandhelds.push(handheld)
                            if (handheld.online === 'Operational') {
                                onlineHandhelds++
                            }
                            totalHandhelds++
                        });
                    }
                    setHandhelds(localHandhelds)
                    setHandheldsUp({ 'online': onlineHandhelds, 'total': totalHandhelds, 'percentUp': ((onlineHandhelds / totalHandhelds) * 100) })
                });
            }

            if (showPeripheralsWidget === true || showPeripheralsWidget === 'true') {
                axios.get(`/api/rsmpData/getWirelessPeripherals`, query).then(function (res) {
                    let totalPeripherals = 0
                    let onlinePeripherals = 0
                    let localPeripherals = []
                    if (res.data.length > 0) {
                        res.data.forEach((peripheral, index) => {
                            peripheral.id = index
                            localPeripherals.push(peripheral)
                            if (peripheral.online === true || peripheral.online === "true") {
                                onlinePeripherals++
                            }
                            totalPeripherals++
                        });
                    }
                    setRsmpPeripherals(localPeripherals)
                    setRsmpPeripheralsUp({ 'online': onlinePeripherals, 'total': totalPeripherals, 'percentUp': ((onlinePeripherals / totalPeripherals) * 100) })
                });
            }

        }
    }, [showHandheldsWidget, showPeripheralsWidget, showAttendedLanesWidget, showDevicesWidget, selectedRetailer, context?.selectedRetailerIsTenant, context?.selectedRetailerParentRemsServerId]);

    useEffect(() => {
        let totalDevices = 0;
        let onlineDevices = 0;
        if (filteredDevices.length > 0) {
            filteredDevices.map(device => {
                device.id = device._id
                if (device.online === 'true') {
                    onlineDevices++
                }
                totalDevices++
            });
            const percentUp = (onlineDevices / totalDevices) * 100;
            setDevicesUp({ 'online': onlineDevices, 'total': totalDevices, 'percentUp': isNaN(percentUp) ? 0 : percentUp })
        } else {
            setDevicesUp({ 'online': 0, 'total': 0, 'percentUp': 0 })
        }
    }, [filteredDevices])

    useEffect(() => {
        let totalPeripherals = 0;
        let onlinePeripherals = 0;
        if (filteredPeripherals.length > 0) {
            filteredPeripherals.map(device => {
                device.id = device._id
                if (device.online === 'true') {
                    onlinePeripherals++
                }
                totalPeripherals++
            });
            const percentUp = (onlinePeripherals / totalPeripherals) * 100;
            setPeripheralsUp({ 'online': onlinePeripherals, 'total': totalPeripherals, 'percentUp': isNaN(percentUp) ? 0 : percentUp })
        } else {
            setPeripheralsUp({ 'online': 0, 'total': 0, 'percentUp': 0 })
        }
    }, [filteredPeripherals])

    useEffect(() => {
        if (attendedLanes?.length >= 0) {
            let placesResult = allStores ?? [];
            if (filtersApplied.length > 0) {
                placesResult = places
            }
            if (showOnlyDownStores) {
                placesResult = places.filter((x) => x.online === false)
            }
            const response = attendedLanes?.filter(store => placesResult?.find(x => x?.storeName === store?.storeName)).map(r => ({ ...r, id: r._id }));
            let totalAttendedLanes = 0
            let onlineAttendedLanes = 0
            response.map(agent => {
                if (agent.online === true) {
                    onlineAttendedLanes++
                }
                totalAttendedLanes++
            })
            const percentUp = (onlineAttendedLanes / totalAttendedLanes) * 100;
            setLanesUp({ 'online': onlineAttendedLanes, 'total': totalAttendedLanes, 'percentUp': isNaN(percentUp) ? 0 : percentUp })
        }
    }, [attendedLanes, showOnlyDownStores, filtersApplied, places])

    useEffect(() => {
        let onlineCounter = 0;
        let placesResult = allStores;
        if (filtersApplied.length > 0) {
            placesResult = places
        }
        let counter = 0;
        let upLanes = 0;
        let totalLanes = 0;
        if (showOnlyDownStores) {
            placesResult = allStores.filter((x) => x?.online === false)
        }
        if (placesResult.length > 0) {
            placesResult?.map((store) => {
                // color the marker based on online status
                if (store.onlineLanes && store.totalLanes) {
                    upLanes += store.onlineLanes
                    totalLanes += store.totalLanes
                }
                const signal = store?.onlineAgents / store?.totalAgents * 100;

                // default to orange
                store.status = '#FA8128';
                if (store?.online === true) {
                    onlineCounter++
                } else {
                    store.online = false
                }
                if (signal > goodStoreStatusPercentage && store?.online) {
                    // green
                    store.status = '#00FF00';
                } else if (signal > poorStoreStatusPercentage && signal <= goodStoreStatusPercentage && store?.online) {
                    store.status = '#FFFF00';
                } else if ((store?.last_updated_sec && moment(store?.last_updated_sec * 1000).diff(Date.now(), 'hours') < - disconnectTimeLimit) || store?.online === false) {
                    store.status = '#FF0000'
                }
                counter++;
            });
            setStoresOnline({ 'online': onlineCounter, 'total': placesResult.length, 'percentUp': ((onlineCounter / filteredStores.length) * 100) });
        } else {
            setStoresOnline({ 'online': 0, 'total': filteredStores.length, 'percentUp': 0 });
        }
    }, [filtersApplied, places, showOnlyDownStores])

    useEffect(() => {
        if (selectedRetailer && allRetailers.length > 0) {
            fetchStore();
        }
    }, [selectedRetailer, allRetailers, showAttendedLanesWidget, showStoreOnlineWidget, showDevicesWidget]);

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
        axios.post(`/api/user/settingsSubmission`, { email: username, firstName: context.userDetails?.firstName, lastName: context.userDetails?.lastName, userDefinedMapConfig: mapParams })
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
        let filteredStores = [...allStores];
        let filteredDevices = [...devices];
        let filteredPeripherals = [...peripherals]
        let tempFiltersFiltered = [];
        if (selectedContinent) {
            filteredPlaces = filteredPlaces.filter((x) => x.continent === selectedContinent.id);
            filteredStores = filteredStores.filter((x) => x.continent === selectedContinent.id);
            filteredDevices = filteredDevices.filter((x) => {
                const findStore = filteredPlaces.find(p => p.storeName === x.storeName);
                return findStore ? true : false;
            })
            filteredPeripherals = filteredPeripherals.filter((x) => {
                const findStore = filteredPlaces.find(p => p.storeName === x.storeName);
                return findStore ? true : false;
            })
            tempFiltersFiltered = allFilters.filter((x) => x.type !== 'continent' && x.continent === selectedContinent.id);
        }
        if (selectedCountry) {
            filteredPlaces = filteredPlaces.filter((x) => x.country === selectedCountry.id);
            filteredStores = filteredStores.filter((x) => x.country === selectedCountry.id);
            filteredDevices = filteredDevices.filter((x) => {
                const findStore = filteredPlaces.find(p => p.storeName === x.storeName);
                return findStore ? true : false;
            })
            filteredPeripherals = filteredPeripherals.filter((x) => {
                const findStore = filteredPlaces.find(p => p.storeName === x.storeName);
                return findStore ? true : false;
            })
            tempFiltersFiltered = allFilters.filter((x) => x.type !== 'continent' && x.type !== 'country' && x.country === selectedCountry.id);
        }
        if (selectedStore) {
            filteredPlaces = filteredPlaces.filter((x) => x._id === selectedStore.id);
            filteredStores = filteredStores.filter((x) => x._id === selectedStore.id);
            filteredDevices = filteredDevices.filter((x) => x.storeName === selectedStore.name);
            filteredPeripherals = filteredPeripherals.filter((x) => x.storeName === selectedStore.name);
        }
        if (filtersApplied.length === 0) {
            tempFiltersFiltered = [...allFilters];
        }
        setFilteredStores(filteredStores)
        setFilteredFilters(tempFiltersFiltered);
        setFilteredPeripherals(filteredPeripherals)
        setPlaces(filteredPlaces);
        setFilteredDevices(filteredDevices)
    }, [allPlaces, filtersApplied, isRefetch]);

    function handleListViewPaperClicked(value, setter, viewName) {
        if (value === false) {
            setIsListView(true)
        } else {
            setIsListView(false)
        }

        if (viewName === 'storesOnline' && value === false) {
            setIsDevicesListView(false)
            setIsAttendedLanesListView(false)
            setIsHandheldsListView(false)
            setIsRsmpPeripheralsListView(false)
            setIsPeripheralsListView(false)
        }
        if (viewName === 'attendedLanes' && value === false) {
            setIsDevicesListView(false)
            setIsStoresOnlineListView(false)
            setIsHandheldsListView(false)
            setIsRsmpPeripheralsListView(false)
            setIsPeripheralsListView(false)
        }
        if (viewName === 'devices' && value === false) {
            setIsAttendedLanesListView(false)
            setIsStoresOnlineListView(false)
            setIsHandheldsListView(false)
            setIsRsmpPeripheralsListView(false)
            setIsPeripheralsListView(false)
        }
        if (viewName === 'handhelds' && value === false) {
            setIsAttendedLanesListView(false)
            setIsStoresOnlineListView(false)
            setIsDevicesListView(false)
            setIsRsmpPeripheralsListView(false)
            setIsPeripheralsListView(false)
        }
        if (viewName === 'rsmpPeripherals' && value === false) {
            setIsAttendedLanesListView(false)
            setIsStoresOnlineListView(false)
            setIsDevicesListView(false)
            setIsHandheldsListView(false)
            setIsPeripheralsListView(false)
        }
        if (viewName === 'peripherals' && value === false) {
            setIsAttendedLanesListView(false)
            setIsStoresOnlineListView(false)
            setIsDevicesListView(false)
            setIsHandheldsListView(false)
            setIsRsmpPeripheralsListView(false)
            setIsDevicesListView(false)
        }

        setter(prev => !prev)
    }

    let placesResult = [...places];
    let storesResult = [...filteredStores];
    let devicesResult = [...filteredDevices];
    let peripheralsResult = [...filteredPeripherals]
    if (showOnlyDownStores) {
        placesResult = places.filter((x) => x.online === false);
        storesResult = filteredStores.filter((x) => x.online === false)
        devicesResult = filteredDevices.filter((x) => x.online === 'false');
        peripheralsResult = filteredPeripherals.filter((x) => x.online === 'false')
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
                <Box sx={{ display: 'flex', width: '100%', height: '90Vh', flexDirection: 'row' }}>
                    <Box sx={{
                        display: 'flex',
                        height: '100%',
                        width: '14%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around'
                    }}
                    >
                        {showStoreOnlineWidget === true && (
                            <Paper onClick={() => handleListViewPaperClicked(isStoresOnlineListView, setIsStoresOnlineListView, 'storesOnline')} sx={[isStoresOnlineListView === false && { width: '90%', marginTop: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }, isStoresOnlineListView === true && { width: '90%', marginTop: 1, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center' }]} elevation={10} >
                                {!isEmpty(onlineStoreWidget?.onlineStoreText) ?
                                    <CustomLinearProgress
                                        title="Stores Online"
                                        subTitle={onlineStoreWidget?.onlineStoreText}
                                        value={onlineStoreWidget?.onlineStore}
                                        color={onlineStoreWidget?.onlineStoreColor}
                                    /> : <CircularProgress sx={{ margin: 2 }} />
                                }

                            </Paper>
                        )}
                        {showAttendedLanesWidget === true && (
                            <Paper onClick={() => handleListViewPaperClicked(isAttendedLanesListView, setIsAttendedLanesListView, 'attendedLanes')} sx={[isAttendedLanesListView === false && { width: '90%', marginTop: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }, isAttendedLanesListView === true && { width: '90%', marginTop: 1, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center' }]} elevation={10}>
                                {laneUpWidget?.loading && <CircularProgress sx={{ margin: 2 }} />}
                                {!laneUpWidget?.loading && !isEmpty(laneUpWidget?.laneUpText) &&
                                    <CustomLinearProgress
                                        title="Agents Online"
                                        subTitle={laneUpWidget?.laneUpText}
                                        value={laneUpWidget?.laneUp}
                                        color={laneUpWidget?.laneUpColor}
                                    />
                                }
                            </Paper>
                        )}
                        {(showDevicesWidget === true && devicesUp) && (
                            <Paper onClick={() => handleListViewPaperClicked(isDevicesListView, setIsDevicesListView, 'devices')} sx={[isDevicesListView === false && { width: '90%', marginTop: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }, isDevicesListView === true && { width: '90%', marginTop: 1, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center' }]} elevation={10}>
                                {!isEmpty(devicesUpWidget?.devicesUpText) ?
                                    <CustomLinearProgress
                                        title="SNMP Devices"
                                        subTitle={devicesUpWidget?.devicesUpText}
                                        value={devicesUpWidget?.devicesUp}
                                        color={devicesUpWidget?.devicesUpColor}
                                    /> : <CircularProgress sx={{ margin: 2 }} />
                                }
                            </Paper>
                        )}
                        {(showPeripheralsWidget === true && peripheralsUp) && (
                            <Paper onClick={() => handleListViewPaperClicked(isPeripheralsListView, setIsPeripheralsListView, 'peripherals')} sx={[isPeripheralsListView === false && { width: '90%', marginTop: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }, isPeripheralsListView === true && { width: '90%', marginTop: 1, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center' }]} elevation={10}>
                                {!isEmpty(peripheralsUpWidget?.peripheralsUpText) ?
                                    <CustomLinearProgress
                                        title="Peripherals"
                                        subTitle={peripheralsUpWidget?.peripheralsUpText}
                                        value={peripheralsUpWidget?.peripheralsUp}
                                        color={peripheralsUpWidget?.peripheralsUpColor}
                                    /> : <CircularProgress sx={{ margin: 2 }} />
                                }
                            </Paper>
                        )}
                        {(showHandheldsWidget === true && handheldsUp) && (
                            <Paper onClick={() => handleListViewPaperClicked(isHandheldsListView, setIsHandheldsListView, 'handhelds')} sx={[isHandheldsListView === false && { width: '90%', marginTop: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }, isHandheldsListView === true && { width: '90%', marginTop: 1, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center' }]} elevation={10}>
                                {!isEmpty(handheldsUpWidget?.handheldsUpText) ?
                                    <CustomLinearProgress
                                        title="Mobile Handhelds"
                                        subTitle={handheldsUpWidget?.handheldsUpText}
                                        value={handheldsUpWidget?.handheldsUp}
                                        color={handheldsUpWidget?.handheldsUpColor}
                                    /> : <CircularProgress sx={{ margin: 2 }} />
                                }
                            </Paper>
                        )}
                        {(showRsmpPeripheralsWidget === true && rsmpPeripheralsUp) && (
                            <Paper onClick={() => handleListViewPaperClicked(isRsmpPeripheralsListView, setIsRsmpPeripheralsListView, 'rsmpPeripherals')} sx={[isRsmpPeripheralsListView === false && { width: '90%', marginTop: 1, backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center' }, isRsmpPeripheralsListView === true && { width: '90%', marginTop: 1, backgroundColor: '#ddd', display: 'flex', justifyContent: 'center' }]} elevation={10}>
                                {!isEmpty(rsmpPeripheralsUpWidget?.rsmpPeripheralsUpText) ?
                                    <CustomLinearProgress
                                        title="Mobile Printers"
                                        subTitle={rsmpPeripheralsUpWidget?.rsmpPeripheralsUpText}
                                        value={rsmpPeripheralsUpWidget?.rsmpPeripheralsUp}
                                        color={rsmpPeripheralsUpWidget?.rsmpPeripheralsUpColor}
                                    /> : <CircularProgress sx={{ margin: 2 }} />
                                }
                            </Paper>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', width: '86%', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {!remsAreGood &&
                                <Tooltip title="REMS Connection is Disrupted" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 400 }}>
                                    <Link href={'/administration/versionOverview'}>
                                        <Paper elevation={5} sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            width: 50,
                                            height: 50,
                                            justifyContent: 'center',
                                            marginRight: 2
                                        }}>
                                            <WifiOffIcon color='error' fontSize='large' />
                                        </Paper>
                                    </Link>
                                </Tooltip>
                            }
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
                        {!isListView &&
                            <Card elevation={10} sx={{ margin: 1, display: 'flex', flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {loading ? <CircularProgress /> :
                                        placesResult?.length > 0 && mapParams ?
                                            <GoogleMap
                                                places={placesResult}
                                                setMapParams={setMapParams}
                                                mapParams={mapParams}
                                                isFilterSelect={isFilterSelect}
                                            /> : <Typography>No Store Address</Typography>}
                                </Box>
                            </Card>

                        }
                        {isStoresOnlineListView && <StoresOnlineList context={context} disconnectTimeLimit={disconnectTimeLimit} places={storesResult} poorStoreStatusPercentage={poorStoreStatusPercentage} goodStoreStatusPercentage={goodStoreStatusPercentage} selectedRetailer={context.selectedRetailer} />}
                        {isAttendedLanesListView && <AttendedLanesList context={context} disconnectTimeLimit={disconnectTimeLimit} places={placesResult} selectedRetailer={context.selectedRetailer} attendedList={attendedLanes} />}
                        {isDevicesListView === true && <DeviceList devices={devicesResult} />}
                        {isPeripheralsListView === true && <PeripheralsList peripherals={peripheralsResult} />}
                        {isHandheldsListView === true && <MobileHandheldsList handhelds={handhelds} />}
                        {isRsmpPeripheralsListView === true && <RsmpPeripheralsList peripherals={rsmpPeripherals} />}
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'end', paddingRight: 8 }}>
                    {!isListView &&
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
                    }
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


