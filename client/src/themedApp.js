import React, { Component} from 'react';
import App from './App';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

/* Change the theme properties here */
const theme = createMuiTheme({
    palette: {
        primary: {
            light : blue[300],
            main : blue[500],
            dark: blue[700],
            contrastText: '#fff'
        },
        secondary: {
            light : pink[300],
            main: pink[500],
            dark: pink[700],
            contrastText: '#fff'
        }
    }
});

class ThemedApp  extends Component{
    render(){
        return(
            <MuiThemeProvider theme={theme} >
                <App />
            </MuiThemeProvider>
        )
    }
}

export default ThemedApp;