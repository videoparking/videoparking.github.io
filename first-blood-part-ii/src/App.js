import React, { useState, useEffect }  from 'react';
import './App.css';
import API from './api';

function Pic(props) {

		return (
						<img src={props.src} alt="Parking view" />
		);
}

async function getPicData() {
		const response = await API.get("view");
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
		
		useEffect(() => {
				const renewInterval = state.firstPic ? 0 : state.duration;
				console.log('Setting ' + renewInterval + ' sec timeout to renew...');
				const timer = setTimeout(() => {
						getPicData().then(data => {
								console.log(data);
								const duration = (data.duration ? data.duration : 60);
								setState({
										picSrc: data.url,
										firstPic: false,
										duration: duration,
								});
								document.title = data.message;
						});
				}, renewInterval*1000);
				// Clear timeout if the component is unmounted
				return () => clearTimeout(timer);
		});

		return (
						<div className="App">
						<div className="App-header">
						<Pic src={state.picSrc} />
						</div>
						</div>
		);

}

export default App;
