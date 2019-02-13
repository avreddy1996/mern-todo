import React, { Component } from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import axios from "axios";
import ContactsList from "./components/contacts";
import CreateContact from './components/create-contact';
import Join from './components/join';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Navbar from "./components/navBar";

library.add(faCamera, faPlus, faTimes, faUserCircle);

class App extends Component {
    render() {
        var token = localStorage.getItem('token');
        if (token) {
            // Apply authorization token to every request if logged in
            axios.defaults.headers.common["authorization"] = token;
        } else {
            // Delete auth header
            delete axios.defaults.headers.common["authorization"];
        }
        return <Router>
            <>
                <Navbar token={token}/>
                <Switch>
                    <Route exact path='/' component={ContactsList} />
                    <Route path='/addContact' component={CreateContact} />
                    <Route path='/login' component={Join} />
                </Switch>
            </>
        </Router>;
    }
}

export default App;