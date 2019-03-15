const Contact = require("./../model/contact-server-model");
const userController =  require('./../controllers/user-server-controller');

exports.getAllContacts = function (req, res, next) {
    userController.getUserFromToken(req, function (err, data) {
        if (data.authorized) {
            var fields = {first_name: true, last_name: true, image: true, emails: true, phones: true};
            Contact.find({user: data.id}, fields, {sort: {first_name: 1}}, (function (err, data) {
                if (err) res.send(err);
                return res.json({success: true, data: data});
            }))
        } else {
            res.status(400).send('unauthorised');
        }
    });
};
exports.getContactById = function (req, res, next) {
    var { id } = req.body;
    if(!id){
        res.send('Invalid Data');
    }
    Contact.findOne({_id : id}, function (err, data) {
        if(err) res.send(err);
        return res.json({success: true, data: data});
    })
};
exports.saveContact = function (req, res, next) {
    var {first_name, last_name, emails, phones} = req.body;
    emails = JSON.parse(emails);
    phones = JSON.parse(phones);
    userController.getUserFromToken(req, function (err, data) {
        if (data.authorized) {
            let contact = new Contact();
            contact.first_name = first_name;
            contact.last_name = last_name;
            contact.user = data.id;
            if (req.file) {
                contact.image = '/temp/' + req.file.filename;
            }
            var query = {$and : [{user: data.id}, {$or: [{}]}]};
            var emailsArr = [];
            var phonesArr = [];
            if (emails.length > 0) {
                for (var i = 0; i < emails.length; i++) {
                    emailsArr.push(emails[i].email_id);
                }
                query.$and[1].$or[0] = {"emails.email_id": {$in: emailsArr}};
                contact.emails = emails
            }
            if (phones.length > 0) {
                for (var i = 0; i < phones.length; i++) {
                    if (phones[i].phone_num) {
                        phonesArr.push(phones[i].phone_num);
                    }
                }
                query.$and[1].$or[1] = {"phones.phone_num": {$in: phonesArr}};
                contact.phones = phones;
            }

            function getMatchedEmailOrPhones(users) {
                var arr = [];
                for (var k = 0; k < users.length; k++) {
                    var user = users[k];
                    if (user.emails.length > 0 && emailsArr.length > 0) {
                        for (var i = 0; i < user.emails.length; i++) {
                            for (var j = 0; j < emailsArr.length; j++) {
                                if (user.emails[i].email_id === emailsArr[j]) {
                                    arr.push(emailsArr[j]);
                                }
                            }
                        }
                    }
                    if (user.phones.length > 0 && phonesArr.length > 0) {
                        for (var i = 0; i < user.phones.length; i++) {
                            for (var j = 0; j < phonesArr.length; j++) {
                                if (user.phones[i].phone_num === phonesArr[j]) {
                                    arr.push(phonesArr[j]);
                                }
                            }
                        }
                    }
                }
                return arr;
            }

            if (emails.length > 0 || phones.length > 0) {
                Contact.find(query, function (err, user) {
                    if (err) {
                        res.send(err)
                    }
                    if (user && user.length > 0) {
                        res.send(getMatchedEmailOrPhones(user) + ' - is already in use');
                    } else {
                        contact.save(err => {
                            if (err) res.send(err);
                            return res.json({success: true})
                        })
                    }
                });
            } else {
                contact.save(err => {
                    if (err) res.send(err);
                    return res.json({success: true})
                })
            }
        } else {
            res.status(400).send('unauthorised');
        }
    });
}