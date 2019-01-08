const express = require("express");
const router = express.Router();
const Data = require("./../model/user-server-model");
const userController =  require('./../controllers/user-server-controller');
// this is our get method
// this method fetches all available data in our database
router.get("/getData", userController.getUserData);

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// this is our delete method
// this method removes existing data in our database
router.post("/deleteData", userController.deleteData);

// this is our create methid
// this method adds new data in our database
router.post("/putData", userController.saveUserData);

router.use("/", require('./contact-server-routes'));

module.exports = router;