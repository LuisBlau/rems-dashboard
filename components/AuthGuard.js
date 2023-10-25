/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../pages/UserContext';
import { AccessDenied } from './AccessDenied';
import _ from 'lodash';

export const Guard = ({ children }) => {
    const context = useContext(UserContext);
    const [isAllowed, setIsAllowed] = useState(false)

    const pasAdvancedPages = [
        'StoreOverview',
        // Software Distribution Pages
        'DeployStatus', // Software Distribution
        'DeploymentFileUpload', // Upload a File
        'CreateDeploymentConfig', // Create Deployment Configuration
        'DeploySchedule', // Schedule a Deployment
        'DistributionLists', // Select Agents (agent list)

        // Diagnostics Pages
        'DocCollection', // Doc Collection
        'Dumps', // Dumps
        'ChecExtracts', // Extract
        'DataCapture', // Data Capture

        // Administration Pages
        'snmp',
        'versionOverview',
        'versionMismatch'
    ];

    const commandCenterPages = [
        // Pages exclusively for use in the command center
        'CommandCenterOverview'
    ]

    const toshibaAdminPages = [
        'ToshibaAdministrativeSettings' // admin config panel
    ]

    useEffect(() => {
        if (context.userRoles) {
            if (pasAdvancedPages.includes(context.currentPage)) {
                if (context.userRetailers) {
                    let index = -1
                    context.userRetailers.forEach(retailer => {
                        index = _.findIndex(Object.keys(retailer.configuration), (e) => {
                            return e === "pas_subscription_tier"
                        }, 0)
                        if (index !== -1) {
                            if (Object.values(retailer.configuration)[index] === 'advanced') {
                                setIsAllowed(true)
                            }
                        }
                    });
                }
            } else if (commandCenterPages.includes(context.currentPage)) {
                setIsAllowed(!!context.userRoles.includes('commandCenterViewer'))
            } else if (toshibaAdminPages.includes(context.currentPage)) {
                setIsAllowed(!!context.userRoles.includes('toshibaAdmin'))
            } else {
                setIsAllowed(true)
            }
        }
    }, [context])

    return <>{isAllowed ? children : <AccessDenied />}</>;
};
