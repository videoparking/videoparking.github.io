import React, { useState, useEffect } from 'react';
import {Shape, Group, Text, Line} from 'react-konva';
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

    const isDrawing = React.useRef(false);

    useEffect(() => {
        loadZones();
    }, [props.location]);

    useEffect(() => {
        setState({
            ...state,
            stats: norm(props.stats),
        });
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

    const polygon = (zone) => {
        const scaled = (e) =>  e * props.scale;
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
    
    return (
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
                    stroke={props.color}
                    strokeWidth={1}
                    closed={true}
                />
            </Group>
        )
    );
}


export default PreviewZonesComponent;
