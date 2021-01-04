import React  from 'react';
import './App.css';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import MapView from './MapView';
import CamView from './CamView';


const locations = [
    "8f38301f7f70d7d1/1",
    "a07345b2737af5f/1",
    "e92114fcbfd5688/1"
]


function App() {

    return (
        <div>
            <h1>VideoParking</h1>
            <HashRouter>
                <nav>
                    <ul>
                        <li><Link to="/map/52.371809,5.188753">Map</Link></li>
                        <li><Link to="/cam/8f38301f7f70d7d1/1">Camera 8f38301f7f70d7d1/1</Link></li>
                        <li><Link to="/cam/a07345b2737af5f/1">Camera a07345b2737af5f/1</Link></li>
                        <li><Link to="/cam/e92114fcbfd5688/1">Camera e92114fcbfd5688/1</Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/map/:latLng">
                        <MapView />
                    </Route>
                    <Route path="/cam/:location/:camera/:zone">
                        <CamView />
                    </Route>
                    <Route path="/cam/:location/:camera">
                        <CamView />
                    </Route>
                    <Route path="/">
                        <MapView />
                    </Route>
                </Switch>
            </HashRouter>
        </div>
    );
}


export default App;
