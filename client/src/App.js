import React, { Component } from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import ContactsList from "./components/contacts";
import CreateContact from './components/create-contact'

class App extends Component {
    render() {
        return <Router>
            <Switch>
                <Route exact path='/' component={ContactsList} />
                <Route path='/addContact' component={CreateContact} />
            </Switch>
        </Router>;
    }
}

export default App;