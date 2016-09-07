import React from 'react'
import { render } from 'react-dom'
import { Redirect, Router, Route, browserHistory } from 'react-router'

import './style.css'

import App from './components/App'

import Home from './components/Home'
import Grid from './components/Grid'
import About from './components/About'

render(
    (<Router history={browserHistory}>
        <Route components={App}>
            <Route path="home" components={Home} />
            <Route path="grid" components={Grid} />
            <Route path="about" components={About} />
        </Route>
        <Redirect from="*" to="/home" />
    </Router>),
    document.getElementById('app-container')
);