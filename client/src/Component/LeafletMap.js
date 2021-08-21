import { Map, Marker, Popup, TileLayer, ZoomControl, Polyline } from 'react-leaflet';
import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, { divIcon, map } from "leaflet";
import styled from 'styled-components';
import MarkerClusterGroup from "react-leaflet-markercluster";
import localforage from 'localforage';
import 'leaflet-offline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faCircle, faCloud, faDog, faDotCircle, faHouseUser, faLaptopHouse, faMap, faMapMarked, faMapMarker, faMapMarkerAlt, faMarker, faPaw, faSearch } from "@fortawesome/free-solid-svg-icons";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import randomColor from "randomcolor";


import K9Logo from "../assets/K9-logo.webp";
import DogEmoticon from "../assets/dog.webp";
import { MarkerList } from "./MarkerList";
import { object } from 'prop-types';
import useGeoLocation from './useGeoLocation';

export default function LeafletMap() {

    const location = useGeoLocation();
    // Map initial position

    const [mapStart, setMapStart] = useState({
        lat: -7.7956,
        lng: 110.3695,
        zoom: 13,
        maxZoom: 19,
    });

    const [rescueMarker, setRescueMarker] = useState([])
    function addMarker(e) {
        setRescueMarker(old => [...old, e.latlng])
      }
    let maps = L.DomUtil.get('map-id')
    useEffect(() => {
        if (maps == null) {
            maps = L.map('map-id');
            const offlineLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', localforage, {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abc',
                minZoom: 15,
                maxZoom: 18,
                crossOrigin: true
            });
            offlineLayer.addTo(maps);
        }
    }, []);


    // const pinMarker = divIcon({
    //     html: renderToStaticMarkup(<FontAwesomeIcon
    //         icon={faMapMarkerAlt}
    //         style={{
    //             fontSize: 'calc(0.5rem + 3vmin)',
    //             color: 'red',
    //             zIndex: 2000
    //         }} />),
    // });

    var dogList = MarkerList.filter((elem, index) =>
        MarkerList.findIndex(obj => obj.no === elem.no) === index);
    // Create an empty array of array based on amount of dogs
    var latlngs = [];
    var distMarkerList = [];
    var markerColors = [];
    for (var i = 0; i < dogList.length; i++) {
        distMarkerList.push([])
        latlngs.push([])
        markerColors.push(getColor(i))
        console.log('latlngss', latlngs)
    }

    // Separate every dogs data to new array fom MarkerList
    for (var i = 0; i < MarkerList.length; i++) {
        for (var j = 0; j < dogList.length; j++) {
            if (MarkerList[i].no === dogList[j].no) {
                distMarkerList[j].push(MarkerList[i])
                console.log(distMarkerList)
            }
        }
    }

    // Reverse distMarkerList
    // for(var i = 0;i<dogList.length;i++){
    //     distMarkerList[i].reverse()
    // }

    for (let i = 0; i < MarkerList.length; i++) {
        for (var j = 0; j < dogList.length; j++) {
            if (MarkerList[i].no === dogList[j].no) {
                latlngs[j].push(
                    [MarkerList[i].lat, MarkerList[i].lng]
                );
            }
        }
    }
    function getColor(index) {
        var color;
        switch (index){
            case 0:
                color = '#86efa0'; 
                break;
            case 1:
                color = '#e0b05e'; 
                break;
            case 2:
                color = '#fc8082'; 
                break;
            case 3:
                color = '#cc6ae2'; 
                break;
            case 4:
                color = '#58d3a2';          
                break;
            case 5:
                color = '#4834a3'; 
                break;
            default:
                color = randomColor();
                break;
        }
        return color;

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
                            color: getColor(index),
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
                            color: getColor(index),
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
        // html: renderToStaticMarkup(<FontAwesomeIcon 
        //   icon={faCircle}
        // style={{fontSize: 'calc(0.5rem + 0.1vmin)', color: 'grey',}}/>),
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

    console.log('dogList', dogList)
    console.log('distMarkerList', distMarkerList)
    console.log('MarkerList', MarkerList)
    console.log('Latlngs 0', latlngs[0])
    console.log('Latlngs 1', latlngs[1])


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
                    {dogList.map((dog, index) => {
                        return (
                            <div className='dog'>
                                <div style={{padding: '2vmin'}}>
                                    <FontAwesomeIcon
                                        icon={faPaw}
                                        style={{
                                            fontSize: 'calc(0.5rem + 4vmin)',
                                            color: getColor(index),
                                        }} />
                                </div>
                                <p>
                                    <strong>Anjing no: {dog.no}</strong>, <small><span>data ke-{distMarkerList[index].length}</span></small>
                                    <div>
                                        <p>lat: {dog.lat}, long: {dog.lng}</p>
                                    </div>
                                </p>

                            </div>
                        )
                    })}
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
                    {
                        distMarkerList.map((dog, markerIndex) => {
                            console.log('doggy', dog)
                            return (
                                dog.map((marker, index) => {
                                    console.log('marker lat', marker.lat)
                                    let post = [marker.lat, marker.lng];
                                    return (
                                        <Marker key={index} position={post}
                                            icon={
                                                marker.Status === 'P' ? getPin(markerIndex) :
                                                    index === (dog.length - 1) ? getMarker(markerIndex) :
                                                        marker.gas > 0.7 ? warningGasMarker :
                                                            marker.gas > 0.4 ? cautionGasMarker :
                                                                trackMarker}>
                                            <Popup
                                                tipSize={5}
                                                anchor="bottom-right"
                                                longitude={marker.lng}
                                                latitude={marker.lat}
                                            >
                                                <span>
                                                    <strong>Anjing no: {marker.no}</strong>, <small><span>data ke {index + 1}</span></small>
                                                    <ul style={{margin: 0, paddingLeft: '3vmin'}}>
                                                        <li>status: {((marker.Status === "T") ? 'mencari' : 'pin!')}</li>
                                                        <li>gas: {marker.gas}</li>
                                                        <li>latitude: {marker.lat}</li>
                                                        <li>longitutde: {marker.lng}</li>
                                                    </ul>
                                                </span>
                                            </Popup>
                                        </Marker>
                                    );
                                })

                            )

                        })
                    }
                    {latlngs.map((line, index) => {
                        return (
                            // Warninggggg!!!, getColor can get wrong index + 1
                            <Polyline color={markerColors[index]} positions={line} />
                        )
                    })}

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
