const express = require("express");
const router = express.Router();
const Data = require("./../model/user-server-model");
const userController =  require('./../controllers/user-server-controller');
// this is our get method
router.post("/register",userController.registerUser);
router.post("/login",userController.loginUser);
router.post("/isAuthorised", userController.checkAuthentication);
router.use("/", require('./contact-server-routes'));

module.exports = router;