const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        isVerified : {
            type : Boolean,
            default: false
        },
        otp : {
            type : String,
            default : ''
        }
    },
    { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("User", DataSchema);