import React, {Component} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {TextField, Button} from '@material-ui/core';

class Join extends Component{
    constructor(props){
        super(props);
        this.state = {
            loginEmail : '',
            loginPassword : '',
            signupEmail : '',
            signupPassword : '',
            signupPassword2 : '',
            signupName : '',
            showLogin : true
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.toggleCard = this.toggleCard.bind(this);
    }
    handleInputChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    login(){
        var self = this;
        axios.post('/api/login',{"email":this.state.loginEmail,"password":this.state.loginPassword})
            .then((res)=>{
                if(res.data.success){
                    localStorage.setItem("token",  res.data.token);
                    document.getElementById('goHome').click();
                }else{
                    console.log(res)
                }
            })
    }
    signup(){
        var self = this,
            signupData = {"email":this.state.signupEmail,"password":this.state.signupPassword,"password2":this.state.signupPassword2,"name":this.state.signupName};
        axios.post('/api/register',signupData)
            .then((res)=>{
                if(res.data.success){
                    localStorage.setItem("token",  res.data.token);
                    // Apply authorization token to every request if logged in
                    axios.defaults.headers.common["authorization"] = res.data.token;
                    document.getElementById('goHome').click();
                }else{
                    console.log(res);
                }
            })
            .catch(err=>{console.log(err)})
    }
    toggleCard(){
        this.setState({
            showLogin : !this.state.showLogin
        },()=>{
            if(!this.state.showLogin) {
                document.getElementById('signinCard').classList.add("transition");
                setTimeout(() => {
                    document.getElementById('signinCard').classList.remove("transition");
                }, 500);
            }
        })
    }
    render(){
        return(<div className={'m-auto text-center container row justify-content-center'}>
            <Link to={'/'} style={{display : 'none'}} id={'goHome'} />
            <div className={'sign-in join-card col-12 col-md-4 '+(this.state.showLogin?'active':'')} id={'signinCard'}>
                <FontAwesomeIcon icon={'user-circle'} color={'#000'} size={'2x'}/>
                <h5>Login</h5>
                <TextField label={'Email'} value={this.state.loginEmail} onChange={this.handleInputChange} name={"loginEmail"} type={'email'} className={'m-2'}/>
                <TextField label={'Password'} value={this.state.loginPassword} onChange={this.handleInputChange} name={"loginPassword"} type={'password'} className={'m-2'}/>
                <Button color={'primary'} variant={'contained'} onClick={this.login} className={'m-2'}>Login</Button>
                <h6 onClick={this.toggleCard} className={'cursor-pointer'}>New User?</h6>
            </div>
            <div className={'sign-up join-card col-12 col-md-4 '+(this.state.showLogin?'':'active')}>
                <h5>Register</h5>
                <input value={this.state.signupEmail} onChange={this.handleInputChange} name={"signupEmail"} type={'email'} placeholder={'Email'}/>
                <input value={this.state.signupPassword} onChange={this.handleInputChange} name={"signupPassword"} type={'password'} placeholder={'Password'}/>
                <input value={this.state.signupPassword2} onChange={this.handleInputChange} name={"signupPassword2"} type={'password'} placeholder={'Confirm Password'}/>
                <input value={this.state.signupName} onChange={this.handleInputChange} name={"signupName"} type={'text'} placeholder={'Name'}/>
                <button onClick={this.signup}>Sign Up</button>
                <h6 onClick={this.toggleCard}>Already having an account?</h6>
            </div>
        </div>)
    }
}

export default Join;