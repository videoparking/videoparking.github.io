import React from 'react';
import {Rect, Text, Group} from 'react-konva';


class PreviewDetectionsComponent extends React.Component {
    state = {
        detections: this.props.detections.map((e) => this.norm(e)),
    };
    componentDidMount() {
        //
    }
    componentDidUpdate(oldProps) {
        if (oldProps.detections !== this.props.detections) {
            const normed = this.props.detections.map((e) => this.norm(e))
            this.setState({
                detections: normed
            });
        }
    }
    componentWillUnmount() {
        //
    }
    norm(d) {
        const dn = {
            "object": d.object,
            "confidence": parseFloat(d["measure_value"]),
            "bbox": {
                "x": parseInt(d.att_x) + parseInt(d.bbox_x) - parseInt(d.bbox_w)/2,
                "y": parseInt(d.att_y) + parseInt(d.bbox_y) - parseInt(d.bbox_h)/2,
                "width": parseInt(d.bbox_w),
                "height": parseInt(d.bbox_h),
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
