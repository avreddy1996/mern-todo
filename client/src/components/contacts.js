import React, {Component} from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import { Checkbox, Avatar, } from '@material-ui/core';

class ContactsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            list : [],
            addingItem : false,
            itemName : '',
            loading : false,
            selectAll : false
        };
        this.getData = this.getData.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleContactSelect = this.handleContactSelect.bind(this);
    }
    componentDidMount(){
        this.getData();
    }
    getData(){
        var self = this;
        axios.get('/api/getContacts')
            .then((res)=>{
                if(res.data.success){
                    self.setState({
                        list : res.data.data
                    })
                }else{
                    console.log(res)
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    handleSelectAll = name => e =>{
        this.setState({
            [name] : e.target.checked
        },()=>{
            var list = this.state.list;
            list.forEach((listItem)=>{
                listItem.selected = this.state.selectAll;
            });
            this.setState({
                list : list
            })
        })
    };
    deleteItem(index){
        var url = '/api/deleteData';
        var self = this;
        axios.post(url, { id : this.state.list[index]._id})
            .then((res)=>{
                if(res.data.success){
                    var list = self.state.list;
                    list.splice(index,1);
                    self.setState({
                        list
                    })
                }else{
                    console.log(res.data.error)
                }
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    handleContactSelect(index, isChecked){
        var list = this.state.list;
        list[index].selected = isChecked;
        this.setState({
            list : list
        })
    }
    render(){
        return(
            <div>
                {/*<a href="/addContact">+ Add contact</a>*/}
                <table>
                    <thead>
                        <tr>
                            <th>
                                <Checkbox  onChange={this.handleSelectAll('selectAll')} color={"primary"} checked={this.state.selectAll}/>
                            </th>
                            <th>
                                Name
                            </th>
                            <th>
                                Email
                            </th>
                            <th>
                                Phone
                            </th>
                            <th>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map((item, index)=>{
                            return <ContactRow data={item} key={index} handleSelect={(isChecked)=>{this.handleContactSelect(index, isChecked)}}/>
                        })}
                    </tbody>
                </table>
                <Link to={'/addContact'} className={'add-fab-button'}>+ <span>Add&nbsp;Contact</span></Link>
            </div>
        )
    }
}

class ContactRow extends Component{
    constructor(props){
        super(props);
        this.state = {
            selected : this.props.data.selected
        };
        this.handleContactSelect = this.handleContactSelect.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({
            selected : props.data.selected
        })
    }
    handleContactSelect(e){
        this.props.handleSelect(e.target.checked);
    }
    render(){
        var contact = this.props.data;
        return(
            <tr>
                <td>
                    <Checkbox checked={this.state.selected?'true':''} onChange={this.handleContactSelect} color={"primary"} />
                </td>
                <td>
                    <div style={{display:'flex', alignItems: 'center',flexDirection:'row'}}>
                        <Avatar src={contact.image} alt={contact.first_name} />
                        <h5>{contact.first_name}</h5>
                    </div>
                </td>
                <td>
                    <h5>{contact.emails.length>0?contact.emails[0].email_id:''}</h5>
                </td>
                <td>
                    <h5>{contact.phones.length>0?contact.phones[0].phone_num:''}</h5>
                </td>
                <td>

                </td>
            </tr>
        )
    }
}
export default ContactsList;