const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const contactSchema = new Schema(
    {
        first_name : {
            type : String,
            default : ''
        },
        last_name : {
            type : String,
            default : ''
        },
        image : {
            type : String,
            default : '/media/default.png'
        },
        emails : [{
            type : {
                type : String,
                enum : ['Home', 'Work', 'Personal'],
                default : 'Home'
            },
            email_id : {
                type : String,
                default : ''
            }
        }],
        phones : [{
            type : {
                type: String,
                enum : ['Home', 'Work', 'Personal'],
                default : 'Home'
            },
            phone_num : {
                type : String,
                default : ''
            }
        }]


    },
    { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Contact", contactSchema);