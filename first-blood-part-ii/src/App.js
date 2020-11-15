import React, { useState, useEffect }  from 'react';
import './App.css';
import API from './api';
import CanvasComponent from './CanvasComponent'
const trace = console.log;

const locations = [
    "a07345b2737af5f/1",
    "8f38301f7f70d7d1/1",
]

var currentLocation = 0;

function location() {
    return locations[currentLocation];
}

async function getPicData() {
    const response = await API.get(`view?location=${location()}`);
    console.log("response:", response);
    return response.data;

    // return new Promise( (resolutionFunc,rejectionFunc) => {
    // 		resolutionFunc({
    // 				url: "https://www.ima-home.be/layout/uploads/2020/06/ima-slide1.jpg",
    // 				message: "xxxxx",
    // 		});
    // });
}

function App() {
    const [state, setState] = useState({
	picSrc: undefined,
	firstPic: true,
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
	getPicData().then(data => {
	    trace(data);
	    const duration = (data.duration ? data.duration : 60);
            const url = data.url;
            const frameTime = data.frameTime;
            const style = makeStyle(url, frameTime);
	    setState({
		picSrc: url,
		firstPic: false,
		duration: duration,
                frameTime: frameTime,
                style: style,
	    });
	    document.title = data.message + `, parking at ${location()} ${new Date(frameTime)}`;
	}).catch(err => {
            console.log(err);
	    const duration = 30;
            const style = makeStyle(state.picSrc, state.frameTime);
            const retries = state.retries ? (state.retries + 1) : 0;
	    setState({
		picSrc: state.picSrc,
		firstPic: false,
		duration: duration,
                frameTime: state.frameTime,
                style: style,
                retries: retries,
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
	currentLocation = (currentLocation + 1) % locations.length;
	console.log("location:", location());

	refreshPic();
    };

    const touchEndEventHandler = (event) => {
	setNextLocation();
    };

    const mouseUpEventHandler = (event) => {
	setNextLocation();
    };

    return (
	<div className="App"
	     onTouchEnd={e => touchEndEventHandler(e)}
	     onMouseUp={() => mouseUpEventHandler()}
	>
	    <div className="App-header">
                <CanvasComponent/>
	    </div>
	</div>
    );
}

export default App;
