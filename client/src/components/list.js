import React, {Component} from "react";
import axios from "axios";
class List extends Component{
    constructor(props){
        super(props);
        this.state = {
            list : [],
            addingItem : false,
            itemName : '',
            loading : false
        };
        this.getData = this.getData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this)
    }
    componentDidMount(){
        this.getData();
    }
    getData(){
        var self = this;
        axios.get('/api/getData')
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
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    addItem(e){
        e.preventDefault();
        this.setState({
            loading : true
        });
        var url = '/api/putData';
        var self = this;
        axios.post(url,{message:this.state.itemName})
            .then((res)=>{
                if(res.data.success){
                    self.setState({
                        list : [...self.state.list, {message:self.state.itemName}],
                        loading : false,
                        addingItem : false
                    })
                }else{
                    console.log(res.data.error)
                }
            })
            .catch((err)=>{
                console.log(err)
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
                <ul>{this.state.list.map((item,index)=>{
                    return (<li key={index}>{item.message} <span onClick={()=>{this.deleteItem(index)}}>&times;</span></li>)
                })}</ul>
                <button style={{display : this.state.addingItem?'none':'block'}} onClick={()=>{this.setState({addingItem:true})}} >+ Add Item</button>
                <form style={{display : this.state.addingItem?'block':'none'}} onSubmit={this.addItem}>
                    <input onChange={this.handleChange} name={'itemName'} placeholder={'Add Item'}/>
                    <button type={'submit'}>{this.state.loading?'Loading':'Submit'}</button>
                </form>
            </div>
        )
    }
}

export default List;