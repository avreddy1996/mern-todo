import React, {Component} from "react";
import axios from "axios";
class CreateContact extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            emails : [],
            phones : [],
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.addPhone = this.addPhone.bind(this);
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
        var contact = {};
        contact.first_name = this.state.firstName;
        contact.last_name = this.state.lastName;
        contact.emails = this.state.emails;
        contact.phones = this.state.phones;
        var self = this;
        axios.post('/api/putContact',contact)
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
    render(){
        return (<div>
            <a href={'/'} id={'goBack'} style={{display:'none'}}>hidden</a>
            <form >
                <input onChange={this.handleInputChange} name={'firstName'} placeholder={'first name'} value={this.state.firstName}/>
                <input onChange={this.handleInputChange} name={'lastName'} placeholder={'last name'}/>
                <button onClick={this.addEmail}>+ Add Email</button>
                {this.state.emails.map((email, index)=>{
                    return (<div className={'form-group'} key={index}>
                        <select value={this.state.emails[index].type} onChange={(e)=>{this.handleEmailChange(e, index)}} name={'type'}>
                            <option value={'Home'}>Home</option>
                            <option value={'Work'}>Work</option>
                            <option value={'Personal'}>Personal</option>
                        </select>
                        <input value={this.state.emails[index].email_id} name={'email_id'} onChange={(e)=>{this.handleEmailChange(e, index)}}/>
                    </div>)
                })}
                <button onClick={this.addPhone}>+ Add Phone</button>
                {this.state.phones.map((phone, index)=>{
                    return (<div className={'form-group'} key={index}>
                        <select value={this.state.phones[index].type} onChange={(e)=>{this.handlePhoneChange(e, index)}} name={'type'}>
                            <option value={'Home'}>Home</option>
                            <option value={'Work'}>Work</option>
                            <option value={'Personal'}>Personal</option>
                        </select>
                        <input value={this.state.phones[index].phone_num} name={'phone_num'} onChange={(e)=>{this.handlePhoneChange(e, index)}}/>
                    </div>)
                })}
                <button type={'submit'} onClick={this.handleSubmit}>Submit</button>
            </form>
        </div>)
    }
}
export default CreateContact;