import React, {Component} from "react";
import axios from "axios";
class ContactsList extends Component{
    constructor(props){
        super(props);
        this.state = {
            list : [],
            addingItem : false,
            itemName : '',
            loading : false
        };
        this.getData = this.getData.bind(this);
        this.deleteItem = this.deleteItem.bind(this)
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
    render(){
        return(
            <div>
                <a href="/addContact">+ Add contact</a>
                <ul>{this.state.list.map((item,index)=>{
                    return (<li key={index}>{item.first_name} <span onClick={()=>{this.deleteItem(index)}}>&times;</span></li>)
                })}</ul>
            </div>
        )
    }
}

export default ContactsList;