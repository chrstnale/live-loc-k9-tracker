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
import Markers from '../Component/Markers';

export default function LeafletMap() {

    // Map initial position
    const location = useGeoLocation();
    const [mapStart, setMapStart] = useState({
        lat: -7.7956,
        lng: 110.3695,
        zoom: 6,
        maxZoom: 19,
    });
    // const [markers, setMarkers] = useState(MarkerList)
    const [markerList, setMarkerList] = useState([])
    // const [latlngs, setLatLngs] = useState([[8,110]])
    // console.log(markerList)
    // console.log(latlngs)
    const [lat, setLat] = useState(-7.8754)
    const [lng, setLng] = useState(110.4262)
    console.log('lat:', lat)
    console.log('lng:', lng)

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
        // L.polyline([[lat,lng],[-7.864,110.4352]], {color:'red'}).addTo(map)
    }, []);

    // const socket = io("http://localhost:5000");
    // socket.on('serialdata', (data) => {
    //     // updateMarker(data.lat, data.lng); 
    //     // setLat(data.lat);
    //     // setLng(data.lng);
    // })

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
                <p style={{padding: '1vmin', margin: 0}}>Legenda:</p>
                <div className='legend'>
                <span><FontAwesomeIcon icon={faPaw} /> Anjing</span>
                <span><FontAwesomeIcon icon={faHouseUser} /> Rescue Post</span>
                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> Korban</span>
                <span><FontAwesomeIcon icon={faCloud} /> Gas</span>
                </div>
                <div className='dog-list'>

                </div>
            </div>
            <div id="map-id">
                <Map center={(location.loaded) ? [location.coordinates.lat, location.coordinates.lng] :
                    [mapStart.lat, mapStart.lng]}
                    zoom={(location.loaded) ? 15 : mapStart.zoom}
                    maxZoom={mapStart.maxZoom}
                    id="map">
                    <TileLayer
                        attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    <Marker icon={gpsMarker} position={[location.coordinates.lat, location.coordinates.lng]}>
                        <Popup
                            tipSize={5}
                            anchor="bottom-right"
                            longitude={location.coordinates.lng}
                            latitude={location.coordinates.lat}
                        >
                            <p>Your location is here</p>
                        </Popup>
                    </Marker>
                    <Markers/>
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
    overflow: hidden;
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
        float: right;
    }

    #map-id{
        width: 70vw;
        height: 100vh;
    }

    .box{
        width: 30vw;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 5vmin;
        float: left;
        flex-wrap: wrap;
        align-items: left;
        .title{
            display: flex;
            align-items: center;
            
            img{
                height: 8vmin;
                padding: 2vmin;
            }
        }

        .desc{
            margin: 1vmin;
        }

        .dog-list{
            width: 100%;
            align-items: flex-start;
            height: 50%;
            overflow: auto;

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
            font-size: 'calc(0.5rem + 1.5vmin)';
            display: 'flex';
            padding-bottom: 2vmin;
            span{
                white-space: nowrap;
                padding: 1.5vmin;
            }
        }
                
    }
    @media (max-width: 1024px){
        flex-direction: column;
        padding: 5vmin;
        .box{
            order:2;
            width: 100%;
            height: 30vh;
            
        }

        .map-id{
            width:100%;
            height: 70vh;;
        }
        
    }

`
