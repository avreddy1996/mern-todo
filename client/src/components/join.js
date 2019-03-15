import React, {Component} from "react";
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom'
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
            showLogin : true,
            isVerifyOtp : false,
            otp : '',
            message : ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.toggleCard = this.toggleCard.bind(this);
    }
    componentDidMount(){
        var self = this;
        this.setState({
            isLoading : true,
            error : false
        });
        axios.post('/api/isAuthorised')
            .then((res)=>{
                if(res.data && res.data.authorized){
                    self.setState({
                        userId : res.data.id,
                        isLoading : false,
                    })
                }
            })
            .catch((err)=>{
                console.log(err);
                this.setState({
                    userId : '',
                    isLoading : false,
                    error : true
                })
            })
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
                    axios.defaults.headers.common["authorization"] = res.data.token;
                    document.getElementById('goHome').click();
                }else{
                    console.log(res)
                }
            });
    }
    signup(){
        var self = this,
            signupData = {
                "email":this.state.signupEmail,
                "password":this.state.signupPassword,
                "password2":this.state.signupPassword2,
                "name":this.state.signupName
            };
        var url = '/api/register';
        if(this.state.isVerifyOtp){
            url = '/api/verifyUser';
            signupData.otp = this.state.otp;
        }
        axios.post(url,signupData)
            .then((res)=>{
                if(res.data.success){
                    if(self.state.isVerifyOtp){
                        localStorage.setItem("token",  res.data.token);
                        // Apply authorization token to every request if logged in
                        axios.defaults.headers.common["authorization"] = res.data.token;
                        document.getElementById('goHome').click();
                    }else{
                        self.setState({
                            isVerifyOtp : true,
                            otp : '',
                            message : 'Otp Generated, '+res.data.otp+' is your otp.'
                        });
                    }
                }else{
                    console.log(res);
                    self.setState({
                        message : 'Unknown Error'
                    })
                }
            })
            .catch(err=>{
                console.log(err);
                self.setState({
                    message : err.response.data
                })
            })
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
        if(this.state.isLoading){
            return <div><h6>Loading</h6></div>
        }else if(this.state.userId){
            return <Redirect to={'/'} />
        }
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
                {this.state.isVerifyOtp ?
                    <input value={this.state.otp} onChange={this.handleInputChange} name={'otp'} type={'text'} placeholder={'Otp'}/>
                    :
                    ''
                }
                <h6>{this.state.message}</h6>
                <button onClick={this.signup}>Sign Up</button>
                <h6 onClick={this.toggleCard}>Already having an account?</h6>
            </div>
        </div>)
    }
}

export default Join;