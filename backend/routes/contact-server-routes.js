const express = require("express");
const router = express.Router();
const Contact = require("./../model/contact-server-model");
const contactController =  require('./../controllers/contact-server-controller');
const userController =  require('./../controllers/user-server-controller');
const fs = require("fs");
const multer = require('multer');
const util = require('util');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './client/public/temp/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });
// this is our get method
// this method fetches all available data in our database
router.get("/getContacts",userController.checkAuthentication, contactController.getAllContacts);

// this is our update method
// this method overwrites existing data in our database
router.post("/updateContact", (req, res) => {
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// this method gets all details of contact
router.post("/getContact", contactController.getContactById);

// this is our delete method
// this method removes existing data in our database
/*router.post("/deleteContact", contactController.deleteContact);*/

// this is our create methid
// this method adds new data in our database
router.post("/putContact", upload.single('avatar'), contactController.saveContact);

module.exports = router;