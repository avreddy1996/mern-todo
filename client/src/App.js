import React, { Component } from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import ContactsList from "./components/contacts";
import CreateContact from './components/create-contact';
import Join from './components/join';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faCamera, faPlus, faTimes);

class App extends Component {
    render() {
        return <Router>
            <>
                <AppBar position={"sticky"}>
                    <Toolbar>
                        <IconButton color={"inherit"}>
                            <Menu />
                        </IconButton>
                        <Typography color={"inherit"} variant={"h5"}>
                            Contacts
                        </Typography>
                        <div style={{flexGrow:1}} ></div>
                    </Toolbar>
                </AppBar>
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