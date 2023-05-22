/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import Cookies from 'universal-cookie';

const UserContext = React.createContext();

export const UserContextProvider = (props) => {
    const [userRoles, setUserRoles] = useState(null);
    const [userRetailers, setUserRetailers] = useState(null);
    const [currentPage, setCurrentPage] = useState('');
    const [openedMenuItems, setOpenedMenuItems] = useState([]);
    const [hasChildren, setHasChildren] = useState(false);
    const { accounts } = useMsal();
    const [userDetails, setUserDetails] = useState(null)
    const username = accounts.length > 0 ? accounts[0].username : '';
    const [selectedRetailer, setSelectedRetailer] = useState('')
    const [selectedRetailerDescription, setSelectedRetailerDescription] = useState('')
    const [selectedRetailerIsTenant, setSelectedRetailerIsTenant] = useState(null)
    const [selectedRetailerParentRemsServerId, setSelectedRetailerParentRemsServerId] = useState(null)
    const cookies = new Cookies();

    const getRoles = async () => {
        if (!userRoles) {
            try {
                setUserRoles(userDetails.role);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getUserDetails = async () => {
        if (!userRoles) {
            try {
                const u = await axios
                    .get('/api/REMS/getUserDetails?email=' + username)
                    .then((resp) => resp.data || null);
                if (u) {
                    setUserDetails(u);
                }
                setUserDetails(u);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getRetailers = async () => {
        if (!userRetailers) {
            try {
                let u = userDetails.retailer

                const allRetailerDetails = await axios.get('/api/REMS/getAllRetailerDetails').then((resp) => resp.data)
                allRetailerDetails.sort((a, b) => a.description.localeCompare(b.description))
                if (u[0] === 'All') {
                    u = allRetailerDetails
                } else {
                    u.forEach((retailer, index) => {
                        u[index] = allRetailerDetails.find(x => x.description === retailer)
                    });
                }
                setUserRetailers(u)
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getSelectedRetailer = async () => {
        if (userRetailers)
            if (selectedRetailer === '' && cookies.get('retailerId') !== undefined && cookies.get('retailerId') !== '') {
                if (userRetailers.some(x => x.retailer_id === cookies.get('retailerId'))) {
                    setSelectedRetailer(cookies.get('retailerId'));
                } else {
                    setSelectedRetailer(userRetailers[0].retailer_id);
                }
            } else if (selectedRetailer !== '' && cookies.get('retailerId') !== selectedRetailer) {
                cookies.set('retailerId', selectedRetailer, { path: '/' });
            } else if (selectedRetailer === '') {
                setSelectedRetailer(userRetailers[0].retailer_id)
            }
    }

    useEffect(() => {
        if (!userDetails) {
            getUserDetails();
        }
    }, []);

    useEffect(() => {
        if (userDetails) {
            if (!userRoles) {
                getRoles();
            }
            if (!userRetailers) {
                getRetailers();
            }
        }
    }, [userDetails])

    useEffect(() => {
        if (selectedRetailer !== '') {
            if (_.find(userRetailers, x => x.retailer_id === selectedRetailer).isTenant === true) {
                setSelectedRetailerIsTenant(true)
                axios.get(`/api/REMS/retrieveTenantParentAndDescription?retailerId=${selectedRetailer}`).then(function (res) {
                    setSelectedRetailerDescription(res.data.description)
                    setSelectedRetailerParentRemsServerId(res.data.retailer_id)
                })
            } else {
                setSelectedRetailerIsTenant(false)
                setSelectedRetailerParentRemsServerId(null)
            }
        }
    }, [selectedRetailer])

    useEffect(() => {
        if (!selectedRetailer && userRetailers) {
            getSelectedRetailer();
        }
    }, [userRetailers])

    if (props.pageName !== currentPage) {
        setCurrentPage(props.pageName);
    }
    const value = {
        userRoles,
        currentPage,
        userRetailers,
        openedMenuItems,
        userDetails,
        setOpenedMenuItems,
        hasChildren,
        setHasChildren,
        selectedRetailer,
        setSelectedRetailer,
        setUserDetails,
        selectedRetailerIsTenant,
        selectedRetailerDescription,
        selectedRetailerParentRemsServerId
    };

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    );
};

export const UserConsumer = UserContext.Consumer;
export default UserContext;
