import React from 'react';
import {Rect, Text, Group} from 'react-konva';

const detections_sample = [
    {
        "zone": "a",
        "bbox": [1310, 324, 376, 309],
        "att_y": "1300",
        "att_x": "0",
        "location": "8f38301f7f70d7d1",
        "camera": "1",
        "detector_hostname": "videoparking-detector-67cf67cd55-8kmll",
        "object": "car",
        "measure_value::double": "0.7678198218345642",
        "measure_name": "confidence",
        "time": "2020-11-16 00:38:00.000000000"
    },
    {
        "zone": "a",
        "bbox": [2115, 265, 379, 269],
        "att_y": "1300",
        "att_x": "0",
        "location": "8f38301f7f70d7d1",
        "camera": "1",
        "detector_hostname": "videoparking-detector-67cf67cd55-8kmll",
        "object": "car",
        "measure_value::double": "0.7678198218342",
        "measure_name": "confidence",
        "time": "2020-11-16 00:38:00.000000000"
    },    
];

class PreviewDetectionsComponent extends React.Component {
    state = {
        detections: detections_sample.map((e) => this.norm(e)),
    };
    norm(d) {
        const dn = {
            "object": d.object,
            "confidence": parseFloat(d["measure_value::double"]),
            "bbox": {
                "x": parseInt(d.att_x) + parseInt(d.bbox[0]) - parseInt(d.bbox[2])/2,
                "y": parseInt(d.att_y) + parseInt(d.bbox[1]) - parseInt(d.bbox[3])/2,
                "width": parseInt(d.bbox[2]),
                "height": parseInt(d.bbox[3]),
            },
        };
        return (dn);
    }
    scaled(e) {
        return e * this.props.scale;
    }
    render() {
        return (
            this.state.detections.map(d =>
                <Group
                    key={d.confidence} // hope confidence will differ at least in grains
                    x={this.scaled(d.bbox.x)}
                    y={this.scaled(d.bbox.y)}
                >
                    <Text
                        text={d.object + " " + d.confidence.toFixed(2)}
                        x={3}
                        fontSize={10}
                        fill={this.props.color}
                    />
                    <Rect
                        width={this.scaled(d.bbox.width)}
                        height={this.scaled(d.bbox.height)}
                        stroke={this.props.color}
                        strokeWidth={1}
                    />
                </Group>
            )
        );
    }
}

export default PreviewDetectionsComponent;
