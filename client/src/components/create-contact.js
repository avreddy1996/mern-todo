import React, {Component} from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField, Fab, FormControl, Select, MenuItem, Button } from '@material-ui/core'

class CreateContact extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            emails : [{type:'Home', email_id: ''}],
            phones : [{type:'Home', phone_num: ''}],
            imageFile : '/media/default.png'
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.addPhone = this.addPhone.bind(this);
        this.removeEmail = this.removeEmail.bind(this);
        this.removePhone = this.removePhone.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this)
    }
    handleEmailChange(e,index){
        var emails = this.state.emails;
        emails[index][e.target.name] = e.target.value;
        this.setState({
            emails : emails
        });
    }
    handlePhoneChange(e,index){
        var phones = this.state.phones;
        phones[index][e.target.name] = e.target.value;
        this.setState({
            phones : phones
        });
    }
    handleInputChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmit(e){
        e.preventDefault();
        var contact = new FormData();
        contact.append('avatar', this.state.originalImageFile);
        contact.append('first_name', this.state.firstName);
        contact.append('last_name', this.state.lastName);
        contact.append('emails', JSON.stringify(this.state.emails));
        contact.append('phones', JSON.stringify(this.state.phones));
        var self = this;
        axios.post('/api/putContact',contact,{"Accept" : "application/json"},)
            .then((res)=>{
                if(res.data.success){
                    document.getElementById('goBack').click();
                }else{
                    console.log(res.data);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }
    addEmail(e){
        e.preventDefault();
        var emails = this.state.emails;
        emails.push({type:'Home', email_id: ''});
        this.setState({
            emails : emails
        });
    }
    addPhone(e){
        e.preventDefault();
        var phones = this.state.phones;
        phones.push({type:'Home', phone_num: ''});
        this.setState({
            phones : phones
        });
    }
    handleImageUpload(e){
        if(e.target.files[0]) {
            this.setState({
                imageFile: URL.createObjectURL(e.target.files[0]),
                originalImageFile : e.target.files[0]
            })
        }
    }
    removeEmail(e,index){
        var emails = this.state.emails;
        emails.splice(index,1);
        this.setState({
            emails : emails
        });
    }
    removePhone(e,index){
        var phones = this.state.phones;
        phones.splice(index, 1);
        this.setState({
            phones : phones
        })
    }
    render(){
        return (<div>
            <a href={'/'} id={'goBack'} style={{display:'none'}}>hidden</a>
            <div className={'form-container'}>
                <label htmlFor={'fileInput'} className={'form-image'}>
                    <div className={'square-image'}>
                        <img src={this.state.imageFile} className={'width-100'}/>
                    </div>
                    <div className={'input-file'}>
                        <input type={'file'} onChange={this.handleImageUpload} id={'fileInput'}/>
                        <FontAwesomeIcon icon={'camera'} color={'#000'}/>
                    </div>
                </label>
                <div style={{margin : 'auto', display : 'flex', flexDirection: 'column', alignItems : 'center', justifyContent: 'center'}}>
                    <div>
                        <TextField onChange={this.handleInputChange} name={'firstName'} label={'First Name'} value={this.state.firstName}/>
                        <TextField onChange={this.handleInputChange} name={'lastName'} label={'Last Name'} value={this.state.lastName}/>
                        <div className={'mt-2 mb-2'} onClick={this.addEmail}>
                            <Fab size={'small'} color={'secondary'} className={'mr-2'}>
                                <FontAwesomeIcon icon={'plus'} color={'#fff'}/>
                            </Fab>
                            Add Email
                        </div>
                        {this.state.emails.map((email, index)=>{
                            return (<div className={'form-group d-flex align-items-center justify-content-center'} key={index}>
                                <FormControl className={'mr-2'}>
                                    <Select value={this.state.emails[index].type} onChange={(e)=>{this.handleEmailChange(e, index)}} inputProps={{
                                        name: 'type',
                                        id: 'email-'+index,
                                    }}>
                                        <MenuItem value={'Home'}>Home</MenuItem>
                                        <MenuItem value={'Work'}>Work</MenuItem>
                                        <MenuItem value={'Personal'}>Personal</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField placeholder={'Email'} value={this.state.emails[index].email_id} name={'email_id'} onChange={(e)=>{this.handleEmailChange(e, index)}} style={{flexGrow:1}}/>
                                <FontAwesomeIcon icon={'times'} className={'ml-2 text-danger'} style={{cursor : 'pointer'}} onClick={(e)=>{this.removeEmail(e,index)}}/>
                            </div>)
                        })}
                        <div className={'mt-2 mb-2'} onClick={this.addPhone}>
                            <Fab size={'small'} color={'secondary'} className={'mr-2'}>
                                <FontAwesomeIcon icon={'plus'} color={'#fff'}/>
                            </Fab>
                            Add Phone
                        </div>
                        {this.state.phones.map((email, index)=>{
                            return (<div className={'form-group d-flex align-items-center justify-content-center'} key={index}>
                                <FormControl className={'mr-2'}>
                                    <Select value={this.state.phones[index].type} onChange={(e)=>{this.handlePhoneChange(e, index)}} inputProps={{
                                        name: 'type',
                                        id: 'phone-'+index,
                                    }}>
                                        <MenuItem value={'Home'}>Home</MenuItem>
                                        <MenuItem value={'Work'}>Work</MenuItem>
                                        <MenuItem value={'Personal'}>Personal</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField placeholder={'Email'} value={this.state.phones[index].phone_num} name={'phone_num'} onChange={(e)=>{this.handlePhoneChange(e, index)}} style={{flexGrow:1}}/>
                                <FontAwesomeIcon icon={'times'} className={'ml-2 text-danger'} style={{cursor : 'pointer'}} onClick={(e)=>{this.removePhone(e,index)}}/>
                            </div>)
                        })}
                    </div>
                    <Button variant={"contained"} color={'primary'} onClick={this.handleSubmit}>Submit</Button>
                </div>
            </div>
        </div>)
    }
}
export default CreateContact;