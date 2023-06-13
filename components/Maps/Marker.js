/* eslint-disable react/prop-types */
import { Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

import React, { useContext, useState } from 'react';
import UserContext from '../../pages/UserContext';

function StoreInfoPanel({ text }) {
    const infoWindowStyle = {
        position: 'absolute',
        bottom: 12,
        width: "fit-content",
        padding: 10,
        fontSize: 14,
        zIndex: 100,
        elevation: 10,
    };
    return (
        <Paper style={infoWindowStyle}>
            <Typography>{text}</Typography>
        </Paper>
    );
}

const Marker = ({ text, markerColor, storeId, retailer_id, pointCount, isCluster, points, cluster, supercluster, mapRef, lat, lng, tenant_id }) => {
    const context = useContext(UserContext)
    const router = useRouter();
    const [showStoreInfo, setShowStoreInfo] = useState(false);
    const markerStyle = {
        border: '1px solid white',
        borderRadius: '50%',
        height: 12,
        width: 12,
        backgroundColor: markerColor || 'blue',
        cursor: 'pointer',
        zIndex: 10,
        position: 'relative'
    };

    if (!isCluster) {
        if (_.some(context.userRetailers, retailer => retailer.configuration && retailer.configuration.pas_subscription_tier === 'advanced' && tenant_id === undefined)) {
            return (
                <div
                    onClick={() => window.location.href = ('/storeOverview?storeName=' + storeId + '&retailer_id=' + retailer_id)}
                    style={markerStyle}
                    onMouseEnter={(e) => { setShowStoreInfo(true); e.currentTarget.parentElement.style['z-index'] = 1; }}
                    onMouseLeave={(e) => { setShowStoreInfo(false); e.currentTarget.parentElement.style['z-index'] = 0; }}
                >
                    <div style={{ "whiteSpace": "nowrap", "display": showStoreInfo ? "inline-block" : "none" }}>{<StoreInfoPanel text={text} />}</div>
                </div>
            );
        } else if (_.some(context.userRetailers, retailer => retailer.configuration && retailer.configuration.pas_subscription_tier === 'advanced')) {
            return (
                <div
                    onClick={() => window.location.href = ('/storeOverview?storeName=' + storeId + '&retailer_id=' + retailer_id + '&tenant_id=' + tenant_id)}
                    //onClick={() => window.open('/storeOverview?storeName=' + storeId + '&retailer_id=' + retailer_id + '&tenant_id=' + tenant_id)}
                    
                    style={markerStyle}
                    onMouseEnter={(e) => { setShowStoreInfo(true); e.currentTarget.parentElement.style['z-index'] = 1; }}
                    onMouseLeave={(e) => { setShowStoreInfo(false); e.currentTarget.parentElement.style['z-index'] = 0; }}
                >
                    <div style={{ "whiteSpace": "nowrap", "display": showStoreInfo ? "inline-block" : "none" }}>{<StoreInfoPanel text={text} />}</div>
                </div>
            );
        } else {
            return (
                <div
                    style={markerStyle}
                    onMouseEnter={(e) => { setShowStoreInfo(true); e.currentTarget.parentElement.style['z-index'] = 1; }}
                    onMouseLeave={(e) => { setShowStoreInfo(false); e.currentTarget.parentElement.style['z-index'] = 0; }}
                >
                    <div style={{ "whiteSpace": "nowrap", "display": showStoreInfo ? "inline-block" : "none" }}>{<StoreInfoPanel text={text} />}</div>
                </div>
            );
        }
    } else {
        const clusterMarker = {
            color: '#ffffff',
            background: '#1978c8',
            borderRadius: '50%',
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: `${10 * (pointCount / points.length) * 5}px`,
            height: `${10 * (pointCount / points.length) * 5}px`,
            cursor: 'pointer'
        }

        return (
            <div style={clusterMarker}
                onClick={() => {
                    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                    const latitude = lat
                    const longitude = lng
                    mapRef.current.setZoom(expansionZoom)
                    mapRef.current.panTo({ lat: latitude, lng: longitude })
                }}>
                {pointCount}
            </div>
        )
    }

};

export default Marker;
