import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom'

const CheckAuthentication = (WrappedComponent)=>{
    class AuthHOC extends Component{
        constructor(props){
            super(props);
            this.state = {
                userId : '',
                isLoading : false,
                error : false
            }
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
        render(){
            if(this.state.userId) {
                return <WrappedComponent />
            }else if(this.state.error) {
                return <Redirect to={'/login'}/>
            }
            return (<div><h5>Loading</h5></div>)
        }
    }
    return AuthHOC;
};

export default CheckAuthentication;