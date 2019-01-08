const express = require("express");
const router = express.Router();
const Contact = require("./../model/contact-server-model");
const contactController =  require('./../controllers/contact-server-controller');
// this is our get method
// this method fetches all available data in our database
router.get("/getContacts", contactController.getAllContacts);

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
router.post("/putContact", contactController.saveContact);

module.exports = router;