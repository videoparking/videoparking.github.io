import React from 'react';
import {Konva, Shape, Group, Text} from 'react-konva';
import API from './zonesApi';

const trace = console.log;

async function getZonesData(location) {
    const response = await API.get(`${location}/zones-v1.json`);
    console.log("response:", response);
    return response.data;
}

class PreviewZonesComponent extends React.Component {
    state = {
        zones: [],
    };
    componentDidMount() {
        this.loadZones();
    }
    componentDidUpdate(oldProps) {
        if (oldProps.location !== this.props.location) {
            this.loadZones();
        }
    }
    componentWillUnmount() {
        ///
    }
    loadZones() {
        getZonesData(this.props.location).then(data => {
            trace(data);
            this.setState({
                zones: data.zones,
            });
        }).catch(err => {
            console.log("ERROR:",err);
            this.setState({
                zones: [],
            });
        });
    }
    drawPolygon(zone) {
        const scaled = (e) =>  e * this.props.scale;
        function func(ctx) {
            if (zone) {
                const p = zone.polygon;
                ctx.beginPath();
                ctx.moveTo(scaled(p[0][0]), scaled(p[0][1]));
                for (var i = 1; i < p.length; i++) {
                    ctx.lineTo(scaled(p[i][0]), scaled(p[i][1]));
                }
                ctx.closePath();
                // Konva specific method
                ctx.fillStrokeShape(this);
            } else {
                console.log("no zones to preview");
            }
        }
        return func;
    }
    render() {
        return (
            this.state.zones.map((zone) =>
                <Group
                    key={zone.name}
                    x={0}
                    y={0}
                >
                    <Text
                        text={zone.name}
                        x={3 + zone.polygon[0][0] * this.props.scale}
                        y={zone.polygon[0][1] * this.props.scale}
                        fontSize={10}
                        fill={this.props.color}
                    />
                    <Shape
                        stroke={this.props.color}
                        strokeWidth={1}
                        sceneFunc={this.drawPolygon(zone)}
                    />
                </Group>
            )
        );
    }
}


export default PreviewZonesComponent;
