import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import LandingPage from './views/LandingPage'
import DataPage from './views/DataPage'

import Nav from './components/Nav'


function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route path='/data' component={DataPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
