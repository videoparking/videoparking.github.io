import React, { useState, useEffect }  from 'react';
import { useParams } from 'react-router-dom';
import './CamView.css';
import API from './api';
import URLImage from './URLImage'
import PreviewZonesComponent from './PreviewZonesComponent'
import PreviewDetectionsComponent from './PreviewDetectionsComponent'
import {Layer, Stage, Text, Group} from 'react-konva';

const trace = console.log;

// const detections_sample = [
//     {
//         "zone": "a",
//         "bbox_w": "376",
//         "bbox_h": "309",
//         "bbox_x": "1310",
//         "bbox_y": "324",
//         "att_y": "1300",
//         "att_x": "0",
//         "location": "8f38301f7f70d7d1",
//         "camera": "1",
//         "detector_hostname": "videoparking-detector-67cf67cd55-8kmll",
//         "object": "car",
//         "measure_value": 0.7678198218345642,
//         "measure_name": "confidence",
//         "time": "2020-11-16 00:38:00.000000000"
//     },
//     {
//         "zone": "a",
//         "bbox_w": "379",
//         "bbox_h": "269",
//         "bbox_x": "2115",
//         "bbox_y": "265",
//         "att_y": "1300",
//         "att_x": "0",
//         "location": "8f38301f7f70d7d1",
//         "camera": "1",
//         "detector_hostname": "videoparking-detector-67cf67cd55-8kmll",
//         "object": "car",
//         "measure_value": 0.7678198218342,
//         "measure_name": "confidence",
//         "time": "2020-11-16 00:38:00.000000000"
//     },    
// ];


async function getPicData(location) {
    const response = await API.get(`view?location=${location}&image=yes&detections=yes`);
    console.log("response:", response);
    return response.data;

    // return new Promise( (resolutionFunc,rejectionFunc) => {
    // 		resolutionFunc({
    // 				image: { url: "https://www.ima-home.be/layout/uploads/2020/06/ima-slide1.jpg" },
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

function calc_scale(vw, vh, iw, ih) {
    if (vw && vh && iw && ih) {
        const scale_by_w = vw/iw;
        const scale_by_h = vh/ih;
        return Math.min(scale_by_w, scale_by_h);
    } else {
        return 0.25;
    }
}

function CamView() {

    const [state, setState] = useState({
	picSrc: undefined,
	firstPic: true,
        vw: calc_vw(),
        vh: calc_vh(),
        scale: calc_scale(calc_vw(), calc_vh()),
        detections: [],
        stats: [],
    });

    const { location, camera } = useParams();

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
	getPicData(location + "/" + camera).then(data => {
	    trace(data);
	    const duration = (data.duration ? data.duration : 60);
            const url = data.image.url;
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
                detections: data.detections || [],
                stats: data.stats || [],
	    }
	    setState(newState);
	    document.title = data.message + `, parking at ${location}/${camera} ${new Date(frameTime)}`;
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
                detections: [],
                stats: [],
	    });
	    document.title = `Retrying (${retries})` + (state.frameTime ? ` from ${state.frameTime} ...` : '...');
        });
    };

    if (location !== state.location || camera !== state.camera) {
        setState({
            ...state,
	    firstPic: true,
            location: location,
            camera: camera,
	});
	//refreshPic();
    }

    useEffect(() => {
	const renewInterval = state.firstPic ? 0 : state.duration;
	console.log('Timeout till renew:', renewInterval);
	const timer = setTimeout(refreshPic, renewInterval*1000);
	// Clear timeout if the component is unmounted
	return () => {
            console.log("Stopping renewal of CamView");
            clearTimeout(timer);
        };
    });

    const updateImageSize = (im) => {
        const vw = calc_vw();
        const vh = calc_vh();
        const iw = im ? im.width : state.iw;
        const ih = im ? im.height : state.ih;
        const scale = calc_scale(vw,vh,iw,ih);
        if (iw !== state.iw || ih !== state.ih ||
            vw !== state.vw || vh !== state.vh ||
            scale !== state.scale
           ) {
            const changes = {
                vw: vw,
                vh: vh,
                iw: iw,
                ih: ih,
                scale: scale,
            };
            console.log("[!] New state changes:", changes);
            setState({
                ...state,
                ...changes,
	    });
        }
    }

    return (
	<div className="CamView"
	>
	    <div className="CamView-header">
                <Stage
                    width={state.vw}
                    height={state.vh}
                    style={{backgroundColor:'dimgray'}}
                >
                    <Layer>
                        <URLImage
                            src={state.picSrc}
                            scale={state.scale}
                            onLoadImage={(i) => updateImageSize(i)}
                        />
                    </Layer>
                    <Layer>
                        <PreviewZonesComponent
                            location={location + "/" + camera}
                            stats={state.stats}
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
  location: ${location}
  camera: ${camera}
  frame time: ${state.frameTime}
  detections: ${state.detections.length}
  zones:
    ` + state.stats.map(stats => `${stats.zone}: ${stats.last_detected_cars}/${stats.max_detected_cars} [max of ${stats.period_for_max}]`).join(`
    `)}
                                fontSize={10}
                                fill={"magenta"}
                            />
                        </Group>
                        <Group
                            x={state.vw - 180}
                            y={state.vh - 30}
                        >
                            <Text
                                text={`Config:
  screen: ${state.vw}x${state.vh}
  scale: ${state.scale}
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

export default CamView;
