const mongoose = require("mongoose");
const Contact = require("./../model/contact-server-model");

contactController = {
    getAllContacts : function (req, res, next) {
        var fields = {first_name: true, last_name: true,};
        Contact.find({}, fields,(function (err, data) {
            if(err) res.send(err);
            return res.json({success: true, data: data});
        }))
    },
    getContactById : function (req, res, next) {
        var { id } = req.body;
        if(!id){
            res.send('Invalid Data');
        }
        Contact.findOne({_id : id}, function (err, data) {
            if(err) res.send(err);
            return res.json({success: true, data: data});
        })
    },
    saveContact : function (req, res, next) {
        var { first_name, last_name, image } = req.body;
        let contact = new Contact();
        contact.first_name = first_name;
        contact.last_name = last_name;
        if(image) {
            contact.image = image;
        }
        contact.save(err =>{
            if(err) res.send(err);
            return res.json({success : true})
        })
    }
};

module.exports = contactController;