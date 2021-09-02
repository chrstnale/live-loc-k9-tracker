import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, { divIcon, latLng } from "leaflet";
import styled from 'styled-components';
import localforage from 'localforage';
import 'leaflet-offline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faMapMarker, faHouseUser, faMapMarkerAlt, faPaw } from "@fortawesome/free-solid-svg-icons";
import randomColor from "randomcolor";
import io from 'socket.io-client';

import K9Logo from "../assets/K9-logo.webp";
import { MarkerList } from "../Component/MarkerList";
import useGeoLocation from '../Component/useGeoLocation';

export default function Markers() {
    const [lat, setLat] = useState(-7.8744)
    const [lng, setLng] = useState(110.4252)
    const [status, setStatus] = useState("T")
    const [gas, setGas] = useState(1)
    const [markers, setMarkers] = useState([])



    useEffect(()=>{
        const socket = io("http://localhost:5000");
        socket.on('serialdata', (data) => {
            // updateMarker(data.lat, data.lng); 
            setLat(data.lat);
            setLng(data.lng);
            setStatus(data.status);
            setGas(data.gas);
        })
        // addMarker(lat,lng)
    }, [])

    function addMarker(lat,lng){ 
        // if(gas > 4 || status === 'P'){
            const marker = <Marker position={[lat,lng]}
                icon = {
                status === 'P' ? getPin() :
                    gas > 7 ? warningGasMarker :
                        gas > 4 ? cautionGasMarker :
                            null}>
                <Popup
                    tipSize={5}
                    anchor="bottom-right"
                    longitude={lat}
                    latitude={lng}
                >
                </Popup>
            </Marker>
            setMarkers(marker)
        // }
    }

    function getMarker(index) {
        const dogMarker = divIcon({
            html: renderToStaticMarkup(
                <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon
                        icon={faPaw}
                        style={{
                            fontSize: 'calc(0.5rem + 2.5vmin)',
                            color: 'black',
                            position: 'absolute',
                        }} />
                    <FontAwesomeIcon
                        icon={faPaw}
                        style={{
                            fontSize: 'calc(0.5rem + 2vmin)',
                            color: 'blue',
                            position: 'absolute',
                            top: '70%',
                            left: '5%'
                        }} />
                </div>),
            shadowSize: 'calc(0.5rem + 2vmin)', // size of the shadow
            shadowAnchor: [4, 62],  // the same for the shadow
        });
        return dogMarker;
    }

    const gpsMarker = divIcon({
        html: renderToStaticMarkup(
            <div style={{ position: 'relative' }}>
                <FontAwesomeIcon
                    icon={faHouseUser}
                    style={{
                        fontSize: 'calc(0.5rem + 4.5vmin)',
                        color: 'white',
                        zIndex: 2999,
                        position: 'absolute',
                    }} />
                <FontAwesomeIcon
                    icon={faHouseUser}
                    style={{
                        fontSize: 'calc(0.5rem + 4vmin)',
                        color: 'black',
                        position: 'absolute',
                        top: '70%',
                        left: '5%',
                        zIndex: 3000,

                    }} />
            </div>
        ),
    })

    function getPin(index) {
        const pinMarker = divIcon({
            html: renderToStaticMarkup(
                <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon
                        icon={faMapMarker}
                        style={{
                            fontSize: 'calc(0.5rem + 3.5vmin)',
                            color: 'black',
                            zIndex: 1999,
                            position: 'absolute',
                        }} />
                    <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        style={{
                            fontSize: 'calc(0.5rem + 3vmin)',
                            color: 'red',
                            position: 'absolute',
                            top: '70%',
                            left: '5%',
                            zIndex: 2000,

                        }} />
                </div>),
        });
        return pinMarker;
    }
    const trackMarker = divIcon({

    });
    const cautionGasMarker = divIcon({
        html: renderToStaticMarkup(
            <div style={{ position: 'relative' }}>
                <FontAwesomeIcon
                    icon={faCloud}
                    style={{
                        fontSize: 'calc(0.5rem + 1.5vmin)',
                        color: 'black',
                        position: 'absolute'
                    }} />

                <FontAwesomeIcon
                    icon={faCloud}
                    style={{
                        fontSize: 'calc(0.5rem + 1vmin)',
                        color: 'yellow',
                        top: '70%',
                        left: '10%',
                        position: 'absolute'
                    }} />
            </div>
        ),
    });
    const warningGasMarker = divIcon({
        html: renderToStaticMarkup(
            <div style={{ position: 'relative' }}>
                <FontAwesomeIcon
                    icon={faCloud}
                    style={{
                        fontSize: 'calc(0.5rem + 1.5vmin)',
                        color: 'black',
                        position: 'absolute'
                    }} />

                <FontAwesomeIcon
                    icon={faCloud}
                    style={{
                        fontSize: 'calc(0.5rem + 1vmin)',
                        color: 'red',
                        top: '70%',
                        left: '10%',
                        position: 'absolute'
                    }} />
            </div>
        ),
    });


    return(
        <div id='marker-list'>
                    <Marker icon={getMarker()} position={[lat,lng]}>
                        <Popup
                            tipSize={5}
                            anchor="bottom-right"
                            longitude={lat}
                            latitude={lng}
                        >
                        </Popup>
                    </Marker>
                    {/* <Polyline positions={[[lat,lng],[-7.864,110.4352]]}/> */}
                    
                {markers}
        </div>
    )

}
