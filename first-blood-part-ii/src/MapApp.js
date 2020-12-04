import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect }  from 'react';
import './MapApp.css';
import API from './api';
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, Popup, useMapEvents } from 'react-leaflet';

// see https://github.com/Leaflet/Leaflet/issues/4968
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
let DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [24,36],
    iconAnchor: [12,36]
});
L.Marker.prototype.options.icon = DefaultIcon;

const trace = console.log;

const locations = {
    "8f38301f7f70d7d1/1": {
        pos: [52.371809, 5.188753],
        zones: {
            "a": {
                polygon: [
                    [52.371880, 5.1887],
                    [52.371822, 5.18895],
                    [52.371754, 5.18890],
                    [52.371803, 5.188663]
                ]
            },
            "b": {
                polygon: [
                    [52.372080, 5.188689],
                    [52.372062, 5.188753],
                    [52.371978, 5.188710],
                    [52.371993, 5.188643]
                ]
            }
        }
    }, // 52.371809, 5.188753 -- 52*22'18.5"N 5*11'19.5"E
    //"a07345b2737af5f/1": {},
}

async function getStats(location) {
    const response = await API.get(`view?location=${location}`);
    console.log("response:", response);
    return response.data;

    return new Promise( (resolutionFunc,rejectionFunc) => {
	resolutionFunc({
            "frameTime": "2020-11-29T23:56:20.437Z",
            "expiresAt": "2020-11-30T00:06:20.437Z",
            "duration": 60,
            "renewAfter": "2020-11-30T00:02:20.437Z",
            "message": "You are ace",
            "stats": [
                {
                    "location": "8f38301f7f70d7d1",
                    "camera": "1",
                    "zone": "_unknown",
                    "time": "2020-11-27 14:20:00.000000000",
                    "last_detected_cars": "0",
                    "period_for_max": "3 15:27:00.000000000",
                    "max_detected_cars": "9"
                },
                {
                    "location": "8f38301f7f70d7d1",
                    "camera": "1",
                    "zone": "a",
                    "time": "2020-11-29 23:56:00.000000000",
                    "last_detected_cars": "8",
                    "period_for_max": "6 23:53:00.000000000",
                    "max_detected_cars": "11"
                },
                {
                    "location": "8f38301f7f70d7d1",
                    "camera": "1",
                    "zone": "b",
                    "time": "2020-11-29 23:56:00.000000000",
                    "last_detected_cars": "1",
                    "period_for_max": "6 23:53:00.000000000",
                    "max_detected_cars": "3"
                }
            ]
	});
    });
}


function MapApp() {

    const [state, setState] = useState({
        stats: [],
        location: "8f38301f7f70d7d1/1",
	first: true,
    });

    const refreshStats = () => {
	getStats(state.location).then(data => {
	    trace(data);
	    const duration = (data.duration ? data.duration : 60);
            const frameTime = data.frameTime;
            const newS = {
                ...state,
		first: false,
		duration: duration,
                frameTime: frameTime,
                stats: data.stats || [],
	    };
            console.log(newS);
	    setState(newS);
	    document.title = data.message + `, parking at ${state.location} ${new Date(frameTime)}`;
	}).catch(err => {
            console.log(err);
	    const duration = 30;
            const retries = state.retries ? (state.retries + 1) : 0;
	    setState({
                ...state,
		first: false,
		duration: duration,
                retries: retries,
                stats: [],
	    });
	    document.title = `Retrying (${retries})` + (state.frameTime ? ` from ${state.frameTime} ...` : '...');
        });
    };
		
    useEffect(() => {
	const renewInterval = state.first ? 0 : state.duration;
	console.log('Timeout till renew:', renewInterval);
	const timer = setTimeout(refreshStats, renewInterval*1000);
	// Clear timeout if the component is unmounted
	return () => clearTimeout(timer);
    });

    const startLocation = locations["8f38301f7f70d7d1/1"];

    /*
    function LocationMarker() {
        const [position, setPosition] = useState(null)
        const map = useMapEvents({
            click() {
                map.locate()
            },
            locationfound(e) {
                setPosition(e.latlng)
                map.flyTo(e.latlng, map.getZoom())
            },
        })

        return position === null ? null : (
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }
    */

    const Zones = (stats) => {
        const loc = startLocation;
        return (
            stats.map((s) => {
                const locationId = s["location"]+"/"+s["camera"];
                const loc = locations[locationId];
                if (loc) {
                    trace(loc);
                    const zone = loc.zones[s["zone"]];
                    if (zone) {
                        trace(zone);
                        const markerPos = zone.polygon[0];
                        trace(markerPos);
                        const maxCars = parseInt(s["max_detected_cars"]);
                        const lastCars = parseInt(s["last_detected_cars"]);
                        const cap = lastCars/maxCars;
                        trace(cap);
                        var pathOptions = { fillColor: 'blue' };
                        if (cap < 0.5) { pathOptions = { fillColor: 'green' } }
                        else if (cap < 0.8) { pathOptions = { fillColor: 'red' } }
                        else if (cap < 1.1) { pathOptions = { fillColor: 'black' } }
                        
                        return (
                            <div key={locationId+"-"+s["zone"]} >
                                <Marker position={markerPos} />
                                <Polygon
                                    pathOptions={pathOptions}
                                    positions={zone.polygon}
                                >
                                    <Popup>
                                        {s["last_detected_cars"]} cars parked by {s["time"]} <br />
                                        {s["max_detected_cars"]} max (for period of {s["time"]}) <br />
                                        {(100*cap).toLocaleString(undefined, {maximumFractionDigits:0})+'%'} full
                                    </Popup>
                                    {/*
                                       <Tooltip direction="bottom"
                                       offset={[0, 0]}
                                       opacity={1}
                                       permanent
                                       >
                                       {s["last_detected_cars"]}/{s["max_detected_cars"]}
                                       </Tooltip>
                                     */}
                                </Polygon>
                            </div>
                        );
                    } else {
                        trace(s["zone"]);
                        return null;
                    }
                } else {
                    trace(locationId);
                    return null;
                }
            })
        );
    }
    
    return (
        <MapContainer
            center={startLocation.pos}
            zoom={18}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='<a href="http://videoparking.live/copyright">VideoParking.live</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/*<LocationMarker />*/}
            {Zones(state.stats)}
        </MapContainer>
    );
}

export default MapApp;
