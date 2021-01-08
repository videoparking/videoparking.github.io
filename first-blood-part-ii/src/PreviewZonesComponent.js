import React, { useState, useEffect } from 'react';
import {Group, Text, Line, Circle} from 'react-konva';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import API from './zonesApi';


async function getZonesData(location) {
    if (location) {
        const response = await API.get(`${location}/zones-v1.json`);
        console.log("response:", response);
        return response.data;
    } else {
        return undefined;
    }
}

function norm(stats) {
    const s = {};
    stats.map(e =>
        s[e.zone] = e
    );
    return s;
}

const PreviewZonesComponent = (props) => {
    const [state, setState] = useState({
        zones: [],
        stats: norm(props.stats),
    });

    const normStats = () => {
        setState({
            ...state,
            stats: norm(props.stats),
        });
    }

    useEffect(() => {
        normStats();
    }, [props.stats]);
    
    const loadZones = () => {
        getZonesData(props.location).then(data => {
            console.log(data);
            setState({
                zones: data.zones,
                stats: norm(props.stats),
            });
        }).catch(err => {
            console.log("ERROR:",err);
            setState({
                zones: [],
            });
        });
    };
    
    useEffect(() => {
        loadZones();
    }, [props.location]);

    const scaled = (e) => e * props.scale;
    const descaled = (e) => e / props.scale;

    const polygon = (zone) => {
        return zone.polygon.map(([x,y]) => [scaled(x), scaled(y)]).flat();
    }
    
    const info = (name) => {
        if (state.stats) {
            const stats = state.stats[name];
            if (stats) {
                return `${name} ${stats.last_detected_cars}/${stats.max_detected_cars}`;
            } else {
                return name;
            }
        }
    };

    const ppoints = (zone) => {
        const p = zone.polygon;
        var px = [];
        for (var i = 0; i < p.length; i++) {
            const [x,y] = p[i];
            px[i] = {x:x,y:y,i:i};
        }
        console.log("ppoints:", px);
        return px;
    }

    const update_zones = (zone_name, pi, x, y) => {
        var zones = []
        for (var i = 0; i < state.zones.length; i++) {
            const zone = state.zones[i];
            if (zone.name === zone_name) {
                zone.polygon[pi] = [x,y];
                zone.modified = true;
            }
            zones[i] = zone;
        }
        return zones;
    }

    const clone_zone_edge = (zone_name, pi) => {
        var zones = []
        for (var i = 0; i < state.zones.length; i++) {
            const zone = state.zones[i];
            if (zone.name === zone_name) {
                zone.polygon.splice(pi, 0, zone.polygon[pi]);
                zone.modified = true;
            }
            zones[i] = zone;
        }
        return zones;
    }

    const pickNewName = (names) => {
        return String.fromCharCode('a'.charCodeAt(0) + names.length);
    };

    const addNewZone = () => {
        let [x,y,h,w] = [100,100,500,500];
        let newName = pickNewName(state.zones.map(zone => zone.name));
        let newZone = {
            name: newName,
            polygon: [
                [x, y],
                [x+w, y],
                [x+w, y+h],
                [x, y+h],
            ],
            modified: true
        };
        console.log('Adding new zone', newName);
        setState({
            ...state,
            zones: [...state.zones, newZone],
        });
    };
    
    const setEventKey = (key) => {
        console.log("key:", key);
        if (key === 'e') {
            downloadFile(
                `${props.location}/zones-v1.json`,
                JSON.stringify(
                    {
                        "base_resolution": props.baseResolution,
                        "zones": state.zones
                    },
                    null,
                    2
                )
            );
        } else if (key === 'a') {
            addNewZone();
        }
    };

    /**
     * See https://github.com/axetroy/react-download/blob/master/src/react-download.jsx
     */
    const downloadFile = (fileName, fileContent) => {
        function fake_click(obj) {
            let ev = document.createEvent("MouseEvents");
            ev.initMouseEvent(
                "click",
                true,
                false,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            );
            obj.dispatchEvent(ev);
        }
        function export_raw(name, data) {
            let urlObject = window.URL || window.webkitURL || window;
            let export_blob = new Blob([data]);

            if ('msSaveBlob' in navigator) {
                // Prefer msSaveBlob if available - Edge supports a[download] but
                // ignores the filename provided, using the blob UUID instead.
                // msSaveBlob will respect the provided filename
                navigator.msSaveBlob(export_blob, name);
            } else if ('download' in HTMLAnchorElement.prototype) {
                let save_link = document.createElementNS(
                    "http://www.w3.org/1999/xhtml",
                    "a"
                );
                save_link.href = urlObject.createObjectURL(export_blob);
                save_link.download = name;
                fake_click(save_link);
            } else {
                throw new Error("Neither a[download] nor msSaveBlob is available");
            }
        }
        export_raw(fileName, fileContent);
    }
    
    const ren = () => (
        state.zones.map((zone) =>
            <Group
                key={zone.name}
                x={0}
                y={0}
            >
                <Text
                    text={info(zone.name)}
                    x={3 + zone.polygon[0][0] * props.scale}
                    y={zone.polygon[0][1] * props.scale}
                    fontSize={10}
                    fill={props.color}
                />
                <Line
                    points={polygon(zone)}
                    stroke={zone.modified ? props.modifiedColor : props.color}
                    strokeWidth={1}
                    closed={true}
                />
                {ppoints(zone).map(({x,y,i}) =>
                    <Circle
                        key={zone.name + "-p-" + i}
                        x={scaled(x)}
                        y={scaled(y)}
                        radius={5}
                        fill={zone.modified ? props.modifiedColor : props.color}
                        draggable
                        onDragStart={e => {
                            console.log(">>", e);
                            let newZones = e.evt.shiftKey ? { zones: clone_zone_edge(zone.name, i) } : {};
                            setState({
                                ...state,
                                isDragging: true,
                                ...newZones
                            });
                        }}
                        onDragMove={e => {
                            if (e.evt.movementX !== 0 || e.evt.movementY !== 0) {
                                console.log(">>>", e);
                                setState({
                                    ...state,
                                    isDragging: true,
                                    zones: update_zones(zone.name, i, descaled(e.target.x()), descaled(e.target.y())),
                                });
                            }
                        }}
                        onDragEnd={e => {
                            console.log(">>>>", e);
                            setState({
                                ...state,
                                isDragging: false,
                                zones: update_zones(zone.name, i, descaled(e.target.x()), descaled(e.target.y())),
                            });
                        }}
                    />
                )}
            </Group>
            )
    );

    return (
        <Group>
            {ren()}
            <KeyboardEventHandler handleKeys={['e', 'a']} onKeyEvent={(key, e) => setEventKey(key)}/>
        </Group>
    );
}


export default PreviewZonesComponent;
