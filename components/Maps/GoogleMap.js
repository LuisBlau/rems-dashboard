/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from 'react';
import GoogleMapReact from 'google-maps-react-markers'
import Marker from './Marker';
import useSupercluster from 'use-supercluster';
import UserContext from '../../pages/UserContext';

const defaultProps = {
    center: {
        lat: 38.8097343,
        lng: -90.5556199,
    },

    zoom: 1,
};

export default function GoogleMap({ places, mapParams, setMapParams, isFilterSelect }) {

    const mapRef = useRef();
    const [zoom, setZoom] = useState(mapParams?.userMapZoom)
    const [ready, setReady] = useState(false);
    const [mapBounds, setMapBounds] = useState(null);
    const [center, setCenter] = useState({ lat: mapParams?.userMapCenter?.lat, lng: mapParams?.userMapCenter?.lng })

    useEffect(() => {
        if (mapParams && ready) {
            setZoom(mapParams?.userMapZoom);
            setCenter({
                lat: mapParams?.userMapCenter?.lat,
                lng: mapParams?.userMapCenter?.lng
            });
        }
    }, [mapParams, ready]);

    useEffect(() => {
        if (places.length > 0 && ready) {
            setCenter({ lat: places[0].geometry.location.lat, lng: places[0].geometry.location.lon })
            if (!isFilterSelect) {
                mapRef.current.panTo({ lat: center?.lat, lng: center?.lng });
            } else {
                mapRef.current.panTo({ lat: places[0].geometry.location.lat, lng: places[0].geometry.location.lon });
            }
            if (places.length === 1) {
                mapRef.current.setZoom(8)
            } else {
                mapRef.current.setZoom(zoom)
            }
        }
    }, [places, ready, isFilterSelect]);

    const points = places.map(place => ({
        type: "Feature",
        properties: {
            cluster: false,
            placeId: place._id,
            storeName: place.storeName,
            state: place.state,
            city: place.city,
            status: place.status,
            retailer: place.retailer_id,
            description: place.description
        },
        geometry: {
            type: "Point",
            coordinates:
                [
                    place.geometry.location.lon,
                    place.geometry.location.lat
                ]
        }
    }))

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds: mapBounds,
        zoom,
        options: {
            radius: 50,
            maxZoom: 20
        }
    })

    const onMapChange = ({ bounds, zoom, center }) => {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        setZoom(zoom)
        setMapBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()])
        setCenter({ lng: center[0], lat: center[1] })
        if (setMapParams) setMapParams({
            userMapZoom: zoom,
            userMapCenter: {
                lat: center[1],
                lng: center[0]
            }
        })
    }
    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100%', width: '100%' }}>
            <GoogleMapReact
                apiKey="AIzaSyC9kO_fPMLPqUdLK_Y0_gSgworlvu1gkU8"
                defaultCenter={center}
                defaultZoom={zoom}
                options={
                    {
                        mapTypeControl: true,
                        fullscreenControl: true,
                        maxZoom: 20,
                        minZoom: 2,
                        rotateControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        mapTypeId: "hybrid",
                        zoomControl: false
                    }
                }
                onGoogleApiLoaded={({ map }) => {
                    mapRef.current = map
                    setReady(true)
                }}
                onChange={onMapChange}
            >
                {clusters.map((cluster, index) => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, point_count: pointCount } = cluster.properties
                    if (isCluster) {
                        return (
                            <Marker
                                key={index}
                                lat={latitude}
                                lng={longitude}
                                pointCount={pointCount}
                                isCluster={isCluster}
                                points={points}
                                supercluster={supercluster}
                                cluster={cluster}
                                mapRef={mapRef}
                            />
                        )
                    }
                    return (
                        <Marker
                            key={index}
                            text={`${cluster.properties.description} : ${cluster.properties.storeName} - ${cluster.properties.city}, ${cluster.properties.state}`}
                            lat={latitude}
                            lng={longitude}
                            markerColor={cluster.properties.status}
                            storeId={cluster.properties.storeName}
                            retailer_id={cluster.properties.retailer}
                        />
                    )
                })}
            </GoogleMapReact>
        </div>
    );
}
