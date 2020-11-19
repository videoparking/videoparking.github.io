import React, { useState, useEffect }  from 'react';
import './App.css';
import API from './api';
import URLImage from './URLImage'
import PreviewZonesComponent from './PreviewZonesComponent'
import PreviewDetectionsComponent from './PreviewDetectionsComponent'
import {Layer, Stage, Text, Group} from 'react-konva';
import { useDoubleTap } from 'use-double-tap';

const trace = console.log;

const locations = [
    "8f38301f7f70d7d1/1",
    "a07345b2737af5f/1",
]

const detections_sample = [
    {
        "zone": "a",
        "bbox_w": "376",
        "bbox_h": "309",
        "bbox_x": "1310",
        "bbox_y": "324",
        "att_y": "1300",
        "att_x": "0",
        "location": "8f38301f7f70d7d1",
        "camera": "1",
        "detector_hostname": "videoparking-detector-67cf67cd55-8kmll",
        "object": "car",
        "measure_value": 0.7678198218345642,
        "measure_name": "confidence",
        "time": "2020-11-16 00:38:00.000000000"
    },
    {
        "zone": "a",
        "bbox_w": "379",
        "bbox_h": "269",
        "bbox_x": "2115",
        "bbox_y": "265",
        "att_y": "1300",
        "att_x": "0",
        "location": "8f38301f7f70d7d1",
        "camera": "1",
        "detector_hostname": "videoparking-detector-67cf67cd55-8kmll",
        "object": "car",
        "measure_value": 0.7678198218342,
        "measure_name": "confidence",
        "time": "2020-11-16 00:38:00.000000000"
    },    
];


async function getPicData(location) {
    const response = await API.get(`view?location=${location}`);
    console.log("response:", response);
    return response.data;

    // return new Promise( (resolutionFunc,rejectionFunc) => {
    // 		resolutionFunc({
    // 				url: "https://www.ima-home.be/layout/uploads/2020/06/ima-slide1.jpg",
    // 				message: "xxxxx",
    // 		});
    // });
}

function calc_vw() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

function calc_vh() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}

function App() {
    const [state, setState] = useState({
	picSrc: undefined,
	firstPic: true,
        location: locations[0],
        vw: calc_vw(),
        vh: calc_vh(),
        scale: 0.25,
        detections: [],
    });

    const makeStyle = (url, frameTime) => {
        // See:
        // - https://css-tricks.com/almanac/properties/f/filter/
        // - https://css-tricks.com/gooey-effect/
        // - https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Resizing_background_images
        const now = new Date();
        const frameAge = (now.getTime() - new Date(frameTime).getTime())/1000; // in sec
        const expectedAge = 5 + 60; // sec
        const blur = 0;

        const saturationF = (sec) => {
            /*
             * Saturation [0-100] for:
             *   - 1 min is 100% (full color)
             *   - 5 min is 0% (no colors)
             */
            const x = sec / 60.0; // min, fractions
            return Math.max(0, Math.min(100, 100 - 25 * x));
        }

        const saturation = saturationF(frameAge - expectedAge);

        return {
            backgroundImage:`url(${url})`,
            backgroundColor: '#282c34',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            filter: `blur(${blur}px) saturate(${saturation}%)`,
        };
    };

    const refreshPic = () => {
	getPicData(state.location).then(data => {
	    trace(data);
	    const duration = (data.duration ? data.duration : 60);
            const url = data.url;
            const frameTime = data.frameTime;
            const style = makeStyle(url, frameTime);
            //console.log(">>>>>", url);
            const newState = {
                ...state,
		picSrc: url,
		firstPic: false,
		duration: duration,
                frameTime: frameTime,
                style: style,
                vw: calc_vw(),
                vh: calc_vh(),
                detections: data.detections || [],
	    }
            console.log(newState);
	    setState(newState);
	    document.title = data.message + `, parking at ${state.location} ${new Date(frameTime)}`;
	}).catch(err => {
            console.log(err);
	    const duration = 30;
            const style = makeStyle(state.picSrc, state.frameTime);
            const retries = state.retries ? (state.retries + 1) : 0;
	    setState({
                ...state,
		picSrc: state.picSrc,
		firstPic: false,
		duration: duration,
                style: style,
                retries: retries,
                vw: calc_vw(),
                vh: calc_vh(),
                detections: [],
	    });
	    document.title = `Retrying (${retries})` + (state.frameTime ? ` from ${state.frameTime} ...` : '...');
        });
    };
		
    useEffect(() => {
	const renewInterval = state.firstPic ? 0 : state.duration;
	console.log('Timeout till renew:', renewInterval);
	const timer = setTimeout(refreshPic, renewInterval*1000);
	// Clear timeout if the component is unmounted
	return () => clearTimeout(timer);
    });

    const setNextLocation = () => {
	const current = locations.indexOf(state.location);
        const next = (current + 1) % locations.length;
        const location = locations[next];
	console.log("location:", location);
	setState({
            ...state,
	    firstPic: true,
            location: location,
            vw: calc_vw(),
            vh: calc_vh(),
	});
	//refreshPic();
    };

    const bind = useDoubleTap((event) => {
        // Your action here
        setNextLocation();
        console.log('Double tapped');
    });

    return (
	<div className="App"
             {...bind}
	>
	    <div className="App-header">
                <Stage
                    width={state.vw}
                    height={state.vh}
                    style={{backgroundColor:'dimgray'}}
                >
                    <Layer>
                        <URLImage
                            src={state.picSrc}
                            scale={state.scale}
                        />
                    </Layer>
                    <Layer>
                        <PreviewZonesComponent
                            location={state.location}
                            scale={state.scale}
                            color="magenta"
                        />
                    </Layer>
                    <Layer>
                        <PreviewDetectionsComponent
                            detections={state.detections}
                            scale={state.scale}
                            color="yellow"
                        />
                    </Layer>
                    <Layer>
                        <Group
                            x={state.vw - 200}
                            y={3}
                        >
                            <Text
                                text={`Info:
  screen: ${state.vw}x${state.vh}
  scale: ${state.scale}
  location: ${state.location}
  frame time: ${state.frameTime}
  detections: ${state.detections.length}
`}
                                fontSize={10}
                                fill={"lawngreen"}
                            />
                        </Group>
                        <Group
                            x={state.vw - 180}
                            y={state.vh - 30}
                        >
                            <Text
                                text={`Help:
  - Double-tap to select next location
`}
                                fontSize={10}
                                fill={"black"}
                            />
                        </Group>
                    </Layer>                
                </Stage>
	    </div>
	</div>
    );
}

export default App;
