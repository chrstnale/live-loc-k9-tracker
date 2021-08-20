import { Map, Marker, Popup, TileLayer, ZoomControl, Polyline } from 'react-leaflet';
import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, { divIcon, map } from "leaflet";
import styled from 'styled-components';
import MarkerClusterGroup from "react-leaflet-markercluster";
import localforage from 'localforage';
import 'leaflet-offline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCloud, faDog, faDotCircle, faMap, faMapMarked, faMapMarker, faMapMarkerAlt, faMarker, faPaw, faSearch } from "@fortawesome/free-solid-svg-icons";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import randomColor from "randomcolor";


import K9Logo from "../assets/K9-logo.webp";
import DogEmoticon from "../assets/dog.webp";
import { MarkerList } from "./MarkerList";
import { object } from 'prop-types';

export default function LeafletMap() {
    // Map initial position

    const [mapStart, setMapStart] = useState({
        lat: -7.7956,
        lng: 110.3695,
        zoom: 13,
        maxZoom: 25,
    });

    useEffect(() => {
        let maps = L.DomUtil.get('map-id');
        if (maps == null) {
            maps = L.map('map-id');
            const offlineLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', localforage, {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: 'abc',
                minZoom: 15,
                maxZoom: 30,
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
    for(var i = 0;i<dogList.length;i++){
        distMarkerList.push([])
        latlngs.push([])
        markerColors.push(randomColor())
    }

    // Separate every dogs data to new array fom MarkerList
    for(var i = 0; i < MarkerList.length; i++) {
        for(var j = 0;j<dogList.length;j++){
            if(MarkerList[i].no === dogList[j].no){
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
        for(var j = 0;j<dogList.length;j++){
            if(MarkerList[i].no === dogList[j].no){
                latlngs[j].push(
                    [MarkerList[i].lat, MarkerList[i].lng]
                );
            }
        }
    }
    function getColor(index){
        console.log('markerColorss huaasuu', markerColors[index])
        return markerColors[index]
    }

    function getMarker(index){
        const dogMarker = divIcon({
            html: renderToStaticMarkup(
            <div>
            <FontAwesomeIcon
                icon={faPaw}
                style={{
                    fontSize: 'calc(0.5rem + 2vmin)',
                    color: getColor(index),
                    }} />
            </div>),
        });
        console.log('markerColorss huaa', markerColors[index])
        return dogMarker;
    }
    function getPin(index){
        const pinMarker = divIcon({
            html: renderToStaticMarkup(<FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{
                    fontSize: 'calc(0.5rem + 3vmin)',
                    color: markerColors[index],
                    zIndex: 2000
                }} />),
        });
        return pinMarker;
    }
    const trackMarker = divIcon({
        // html: renderToStaticMarkup(<FontAwesomeIcon 
        //   icon={faCircle}
        // style={{fontSize: 'calc(0.5rem + 0.1vmin)', color: 'grey',}}/>),
    });
    const cautionGasMarker = divIcon({
        html: renderToStaticMarkup(<FontAwesomeIcon
            icon={faCloud}
            style={{ fontSize: 'calc(0.5rem + 1vmin)', color: 'yellow' }} />),
    });
    const warningGasMarker = divIcon({
        html: renderToStaticMarkup(<FontAwesomeIcon
            icon={faCloud}
            style={{ fontSize: 'calc(0.5rem + 1vmin)', color: 'red' }} />),
    });

    console.log('dogList', dogList)
    console.log('distMarkerList', distMarkerList)
    console.log('MarkerList', MarkerList)
    console.log('Latlngs 0', latlngs[0])
    console.log('Latlngs 1', latlngs[1])
    console.log('Our colors', markerColors)


    return (
        <Container>
            <div className='box'>
                <div className='title'>
                    <img src={K9Logo} alt="K9 Logo"></img>
                    <h1>Live-Loc K9 Tracking App</h1>
                </div>
                <p>Inovasi Rompi Anjing Pelacak Guna Meningkatkan Efisiensi Proses Evakuasi Korban Bencana Alam</p>
                <div className='dog-list'>

                    {dogList.map((dog, index) => {
                        return (
                            <div className='dog'>
                                <FontAwesomeIcon icon={faPaw} style={{ fontSize: 'calc(0.5rem + 5vmin)' }} onClick={() => setMapStart({
                                    lat: MarkerList[(MarkerList.length - 1)].lat,
                                    lng: MarkerList[(MarkerList.length - 1)].lng,
                                })} />
                                <p>
                                    <strong>Anjing no: {dog.no}</strong>, 
                                    <div>
                                        <br />
                                        <p>- Mark: {dog.Status}<br />- Gas: {dog.gas}</p>
                                        <p>- Lat: {dog.lat}<br />- Long: {dog.lng}</p>
                                    </div>
                                </p>

                            </div>
                        )
                    })}


                </div>
            </div>
            <div id="map-id">
                <Map center={[mapStart.lat, mapStart.lng]} zoom={mapStart.zoom} maxZoom={mapStart.maxZoom} id="map">
                    <TileLayer
                        attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    {
                        distMarkerList.map((dog,markerIndex) => {
                            console.log('doggy', dog)
                            return(
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
                                            <p>
                                                <strong>Anjing no: {marker.no}</strong>, data ke {index + 1}
                                                <br />
                                                Status Pencarian: {((marker.Status === "T") ? 'Track' : 'Pin')}
                                                <br />
                                                Status Gas: {marker.gas}
                                                <br />
                                                Latitude: {marker.lat}
                                                <br />
                                                Longitude: {marker.lng}
                                            </p>
                                        </Popup>
                                    </Marker>
                                );
                            })

                            )
                           
                        })
                    }
                    {latlngs.map((line, index) => {
                        return(
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
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 5vmin;
        float: left;
        flex-wrap: wrap;
        align-items: center;
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
            height: auto;

            .dog{
                margin-bottom: 5vmin;
                width: 100%;
                height: auto;
                display: flex;
                align-items: center;
                img{
                    width: 10%;
                    padding: 2vmin;
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
                
    }
    @media (max-width: 1024px){
        flex-direction: column;
        .box{
            order:2;
            width: 100vw;
            height: 30vh;
            
        }

        .map-id{
            width:100vw;
            height: 70vh;;
        }
        
    }
`
