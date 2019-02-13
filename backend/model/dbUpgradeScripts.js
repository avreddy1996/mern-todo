const mongoose = require("mongoose");
const dbRoute = require("./../config/keys");
const Contact = require("./contact-server-model");
mongoose.connect(
    dbRoute.mongoUrl,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => {
    console.log("connected to the database");
    Contact.updateMany({},{$set : {user: '5c5807a39e840a08249b1478' }}).then(function (res,err) {
        console.log(res,err);
    })
});
