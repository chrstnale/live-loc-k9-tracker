import { Map, Marker, Popup, TileLayer, ZoomControl,Polyline} from 'react-leaflet';
import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L, {divIcon} from "leaflet";
import styled from 'styled-components';
import MarkerClusterGroup from "react-leaflet-markercluster";
import localforage from 'localforage';
import 'leaflet-offline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog, faMap, faMapMarked, faMapMarker, faMapMarkerAlt, faMarker, faPaw, faSearch } from "@fortawesome/free-solid-svg-icons";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';


import K9Logo from "../assets/K9-logo.webp";
import DogEmoticon from "../assets/dog.webp";
import { MarkerList } from "./MarkerList";

//Custom marker Icons
// const trackMarker = new L.icon({
//     iconUrl: require('../assets/track.webp').default,
//     iconSize: new L.Point(15, 15)
// });
// const dogMarker = new L.icon({
//     iconUrl: require('../assets/dog.webp').default,
//     iconSize: new L.Point(30, 30)
// });
// const pinMarker = new L.icon({
//     iconUrl: require('../assets/pin.webp').default,
//     iconSize: new L.Point(25, 41),
// });

// const searchControl = new GeoSearchControl({ //geosearch object
//     provider: new OpenStreetMapProvider(),
//     // style: 'button',
//     showMarker: true,
//     autoComplete: true,
//     showPopup: false,
//     autoClose: true,
//     retainZoomLevel: false,
//     animateZoom: true,
//     keepResult: false,
//     searchLabel: 'Cari...'
// });
// function LocationMarker() {
//     const [position, setPosition] = useState(null)
//     const map = useMapEvents({
//       click() {
//         map.locate()
//       },
//       locationfound(e) {
//         setPosition(e.latlng)
//         map.flyTo(e.latlng, map.getZoom())
//       },
//     })
//     return position === null ? null : (
//       <Marker position={position}>
//         <Popup>You are here</Popup>
//       </Marker>
//     )
//   }

export default function LeafletMap() {
    // Map initial position

    const [mapStart, setMapStart] = useState({
        lat: -7.7956,
        lng: 110.3695,
        zoom: 13,
        maxZoom: 25,
    });

    var latlngs = [
        [-7.689503, 110.420798],
        [-7.689506, 110.420801],
        [-7.689511, 110.420810],
        [-7.689513, 110.420814],

    ];

    useEffect(() => {
        const maps = L.map('map-id');
        const offlineLayer = L.tileLayer.offline('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', localforage, {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abc',
            minZoom: 15,
            maxZoom: 30,
            crossOrigin: true
        });
        offlineLayer.addTo(maps);
        // var polyline = L.polyline(latlngs, {color: 'red'}).addTo(maps);
        // var OSMRoads = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: mapStart.maxZoom,
        //     maxNativeZoom: 16, 
        // });
        // OSMRoads.addTo(maps);
    }, []);

    const dogMarker = divIcon({
      html: renderToStaticMarkup(<FontAwesomeIcon 
        icon={faDog}
      style={{fontSize: 'calc(0.5rem + 2vmin)'}}/>),
    });
    const trackMarker = divIcon({
        html: renderToStaticMarkup(<FontAwesomeIcon 
        icon={faPaw} 
        style={{fontSize: 'calc(0.5rem + 0.2vmin)'}}/>),
      });
    const pinMarker = divIcon({
    html: renderToStaticMarkup(<FontAwesomeIcon 
        icon={faMapMarkerAlt} 
        style={{fontSize: 'calc(0.5rem + 5vmin)',
                color: 'red',
            zIndex: 2000}}/>),
    });


    return (
        <Container>
            <div className='box'>
                <div className='title'>
                    <img src={K9Logo} alt="K9 Logo"></img>
                    <h1>Live-Loc K9 Tracking App</h1>
                </div>
                <p>Inovasi Rompi Anjing Pelacak Guna Meningkatkan Efisiensi Proses Evakuasi Korban Bencana Alam</p>
                <div className='dog-list'>
                    <div className='dog'>
                        <FontAwesomeIcon icon={faDog} style={{fontSize: 'calc(0.5rem + 5vmin)'}} onClick={() => setMapStart({
                            lat: MarkerList[(MarkerList.length-1)].lat,
                            lng: MarkerList[(MarkerList.length-1)].lng,
                        })}/>
                        <p>
                            <strong>Anjing no: 1</strong>, data ke-1
                            <div>
                                <br/>
                                <p>- Mark: Track<br />- Gas: 4.0</p>
                                <p>- Lat: lat<br />- Long: long</p>
                            </div>
                        </p>

                    </div>
                </div>
            </div>
            <div id="map-id">
                <Map center={[mapStart.lat, mapStart.lng]} zoom={mapStart.zoom} maxZoom={mapStart.maxZoom} id="map">
                    <TileLayer
                        attribution="&copy; <a href=&quot;https://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    {/* <MarkerClusterGroup> */}
                    {MarkerList.map((marker, index) => {
                        let post = [marker.lat, marker.lng];
                        return (
                            <Marker key={index} position={post} icon={((marker.Status == 'P') ? pinMarker : ((index == (MarkerList.length - 1)) ? dogMarker : trackMarker))}>
                                <Popup
                                    tipSize={5}
                                    anchor="bottom-right"
                                    longitude={marker.lng}
                                    latitude={marker.lat}
                                >
                                    <p>
                                        <strong>Anjing no: {marker.no} </strong>
                                        , data ke-{index}
                                        <br />
                                        Status Pencarian: {((marker.status == "T") ? 'Track' : 'Pin')}
                                        <br />
                                        {/* Status Gas: {marker.gas}
                                            <br /> */}
                                        Latitude: {marker.lat}
                                        <br />
                                        Longitude: {marker.lng}
                                    </p>
                                </Popup>
                            </Marker>
                        );


                    })}

                    {/* </MarkerClusterGroup> */}
                    {/* {MarkerList.map((marker, index) => {
                        let post = [marker.lat, marker.lng];
                        return ( */}
                    {/* );
                })} */}
                    <Polyline color="purple" positions={latlngs} />

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
