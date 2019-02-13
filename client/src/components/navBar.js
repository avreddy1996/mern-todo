import {AppBar, IconButton, Toolbar, Typography,Menu, MenuItem} from "@material-ui/core";
import {AccountCircle, MenuRounded} from "@material-ui/icons";
import React,{Component} from "react";
import axios from "axios";
import {Link} from 'react-router-dom';

class Navbar extends Component{
    constructor(props){
        super(props);
        this.state = {
            isDrawerOpen : false,
            anchorEl : null
        };
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.logout = this.logout.bind(this);
    }
    openMenu(e){
        this.setState({
            anchorEl : e.currentTarget
        })
    }
    closeMenu(){
        this.setState({
            anchorEl : null
        })
    }
    logout(){
        localStorage.clear();
        delete axios.defaults.headers.common["authorization"];
        this.closeMenu();
        document.getElementById('goBack').click();
    }
    render(){
        return (
            <AppBar position={"sticky"}>
                <Toolbar>
                    <IconButton color={"inherit"}>
                        <MenuRounded />
                    </IconButton>
                    <Typography color={"inherit"} variant={"h5"}>
                        Contacts
                    </Typography>
                    <div style={{flexGrow:1}} ></div>
                    {this.props.token && <div>
                        <IconButton
                            aria-owns={'menu-appbar'}
                            aria-haspopup="true"
                            onClick={this.openMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.closeMenu}
                        >
                            <MenuItem onClick={this.closeMenu}>Profile</MenuItem>
                            <MenuItem onClick={this.closeMenu}>My account</MenuItem>
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                        </Menu>
                    </div>
                    }
                </Toolbar>
                <Link to={'/login'} style={{display : 'none'}} id={'goBack'}/>
            </AppBar>
        )
    }
}

export default Navbar;