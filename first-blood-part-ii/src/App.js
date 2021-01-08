import React  from 'react';
import './App.css';
import { HashRouter, Link, Route, Switch } from 'react-router-dom';
import MapView from './MapView';
import CamView from './CamView';
import OnboardView from './OnboardView';


function App() {

    const renderNav = () => {
        return (
            <div>
                <h1>VideoParking</h1>
                <nav>
                    <ul>
                        <li>a07345b2737af5f/1 &gt; <Link to="/cam/a07345b2737af5f/1">Camera</Link></li>
                        <li>8f38301f7f70d7d1/1 &gt; <Link to="/cam/8f38301f7f70d7d1/1">Camera</Link> &gt; <Link to="/52.371809,5.188753">Map</Link></li>
                        <li>e92114fcbfd5688/1 &gt; <Link to="/cam/e92114fcbfd5688/1">Camera</Link> &gt; <Link to="/59.9373297,30.4832178">Map</Link></li>
                    </ul>
                </nav>
            </div>
        );
    }

    return (
        <div>
            <HashRouter>
                <Switch>
                    <Route path="/nav">
                        {renderNav()}
                    </Route>
                    <Route path="/cam/:location/:camera/:zone">
                        <CamView />
                    </Route>
                    <Route path="/cam/:location/:camera">
                        <CamView />
                    </Route>
                    <Route path="/:latLng">
                        <MapView />
                    </Route>
                    <Route path="/">
                        <OnboardView />
                    </Route>
                </Switch>
            </HashRouter>
        </div>
    );
}


export default App;
