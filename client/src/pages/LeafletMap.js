import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, { divIcon, latLng, map, marker } from "leaflet";
import styled from 'styled-components';
import localforage from 'localforage';
import 'leaflet-offline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faMapMarker, faHouseUser, faMapMarkerAlt, faPaw, faPersonBooth, faHandsHelping, faPeopleArrows, faPeopleCarry, faHandHolding, faHandHoldingHeart, faHandHoldingMedical, faHandHoldingWater, faHandSparkles, faHandshakeSlash, faHandPeace, faHandSpock, faRunning, faWalking } from "@fortawesome/free-solid-svg-icons";
import randomColor from "randomcolor";
import io from 'socket.io-client';

import K9Logo from "../assets/K9-logo.webp";
import { MarkerList } from "../Component/MarkerList";
import useGeoLocation from '../Component/useGeoLocation';
import Markers from '../Component/Markers';
var idx = 0

export default function LeafletMap() {

    // Map initial position
    const location = useGeoLocation();
    const [mapStart, setMapStart] = useState({
        lat: -7.7956,
        lng: 110.3695,
        zoom: 6,
        maxZoom: 19,
    });
    const [count, setCount] = useState(0)
    const [dogList, setDogList] = useState({ no: 5, lat: 7, lng: 109, gas: 5, status: 'T' })
    const [lat, setLat] = useState(-7.799653)
    const [lng, setLng] = useState(110.352157)
    const [markers, setMarkers] = useState([])

    useEffect(() => {
        let map = L.DomUtil.get('map-id')
        if (map == null) {
            map = L.map('map-id');
            const offlineLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', localforage, {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abc',
                minZoom: 15,
                maxZoom: 18,
                crossOrigin: true
            });
            offlineLayer.addTo(map);
        }
    }, []);
    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.on('serialdata', (data) => {
            setDogList({ lat: data.lat, lng: data.lng, gas: data.gas, status: data.status })
            setLat(data.lat);
            setLng(data.lng);
        })
    }, [])

    useEffect(() => {
        setCount(count + 1)
    }, [lat, lng])

    function handleClick(e) {
        setMarkers(old => [...old, [e.latlng.lat, e.latlng.lng]])
    }

    function remove(index) {
        setMarkers([])
    }

    const rescueMarker = divIcon({
        html: renderToStaticMarkup(
            <div style={{ position: 'relative' }}>
                <FontAwesomeIcon
                    icon={faRunning}
                    style={{
                        fontSize: 'calc(0.5rem + 3vmin)',
                        color: 'black',
                        position: 'absolute'
                    }} />

                <FontAwesomeIcon
                    icon={faRunning}
                    style={{
                        fontSize: 'calc(0.5rem + 2.5vmin)',
                        color: 'green',
                        top: '90%',
                        left: '23%',
                        position: 'absolute'
                    }} />
            </div>
        ),
    });

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
    return (
        <Container>
            <div className='box'>
                <div className='title'>
                    <img src={K9Logo} alt="K9 Logo"></img>
                    <h1>Live-Loc K9 Tracking App</h1>
                </div>
                <p className='desc'>Inovasi Rompi Anjing Pelacak Guna Meningkatkan Efisiensi Proses Evakuasi Korban Bencana Alam</p>
                <p style={{ margin: 0 }}>Legenda:</p>
                <div className='legend'>
                    <span><FontAwesomeIcon icon={faPaw} /> Anjing</span>
                    <span><FontAwesomeIcon icon={faHouseUser} /> Rescue Post</span>
                    <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Korban</span>
                    <span><FontAwesomeIcon icon={faCloud} /> Gas</span>
                    <span><FontAwesomeIcon icon={faRunning} /> Tim Penyelamat</span>
                </div>
                <div className='dog-list'>
                    <div className='dog'>
                        <div style={{ padding: '2vmin' }}>
                            <FontAwesomeIcon
                                icon={faPaw}
                                style={{
                                    fontSize: 'calc(0.5rem + 4vmin)',
                                    color: 'black',
                                }} />
                        </div>
                        <p>
                            <strong>Anjing no: {1}</strong>, <small><span>perpindahan ke-{count}</span></small>
                            <div>
                                <p>lat: {dogList.lat}, long: {dogList.lng}</p>
                            </div>
                        </p>

                    </div>
                </div>
            </div>
            <div id="map-id">
                <Map onclick={handleClick} center={(location.loaded) ? [location.coordinates.lat, location.coordinates.lng] :
                    [mapStart.lat, mapStart.lng]}
                    zoom={(location.loaded) ? 15 : mapStart.zoom}
                    maxZoom={mapStart.maxZoom}
                    id="map">
                    <TileLayer
                        attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <Marker icon={gpsMarker} draggable={true} position={[location.coordinates.lat, location.coordinates.lng]}>
                        <Popup
                            tipSize={5}
                            anchor="bottom-right"
                            longitude={location.coordinates.lng}
                            latitude={location.coordinates.lat}
                        >
                            <p>Lokasi Anda di sini</p>
                        </Popup>
                    </Marker>

                    {markers.map((marker, index) => {
                        return (
                            <Marker key={index} icon={rescueMarker} ondblclick={remove} draggable={true} position={marker}>
                                <Popup
                                    tipSize={5}
                                    anchor="bottom-right"
                                    longitude={lat}
                                    latitude={lng}
                                >
                                    <label for="tim">Tim Penyelamat:</label><br/>
                                    <input id="tim" type="text"/>
                                </Popup>
                            </Marker>
                        )

                    })}
                    <Markers />
                </Map>
            </div >
        </Container >
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    /* overflow: hidden; */
    margin: 0;
    padding: 0;
    .leaflet-div-icon {
        background: transparent;
        border: none;
    }  
    h1{
        font-size: calc(0.5rem + 3vmin);
    }

    p{
        font-size: calc(0.5rem + 1.5vmin);
    }


    .leaflet-container {
        height: 100%;
        width: 100%;
        /* float: right; */
    }

    #map-id{
        width: 65%;
    }

    .box{
        width: 35%;
        display: flex;
        flex-direction: column;
        padding: 5vmin;
        .title{
            display: flex;
            align-items: center;
            
            img{
                height: 8vmin;
                padding: 2vmin;
            }
        }

        .dog-list{
            width: 100%;
            align-items: flex-start;

            .dog{
                width: 100%;
                height: auto;
                display: flex;
                align-items: center;
                img{
                    width: 10%;
                    padding: 1vmin;
                    cursor: pointer;
                }

                p{
                    width: 900%;
                    div{
                    display: flex;
                    width: 100%;
                    height: auto;
                    padding: 0;
                    p{
                        margin: 0 5% 0 0;
                    }
                }
                }

                
            }
        }
        .legend{
            display: 'flex';
            span{
                white-space: nowrap;
                margin-right: 2vmin;
            }
        }
                
    }
    @media (max-width: 1000px){
        flex-direction: column;
        overflow: hidden;
        .box{
            order:2;
            width: 100%;
            height: 30%;
            /* height: 30%; */
            overflow-y: scroll;
        }

        #map-id{
            width:100%;
            height: 70%;
        }
        
    }

`
