const mongoose = require("mongoose");
const User = require("./../model/user-server-model");
const validateRegisterInput = require("./../validation/registration");
const bcrypt = require("bcryptjs");
const validateLoginInput = require("./../validation/login");
const jwt = require("jsonwebtoken");
const keys = require("./../config/keys");

exports.registerUser = function(req, res, next){
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user && user.isVerified) {
            return res.status(400).send("Email already exists");
        }else {
            const userOtp = Math.floor(100000 + Math.random() * 900000);
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                otp : userOtp
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        res.status(400).send('Unable to register user');
                        throw err;
                    }
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {
                            res.json({success : true,otp : newUser.otp})
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).send('Unable to register user')
                        });
                });
            });
        }
    })
};
exports.verifyUser = function(req, res, next){
    if(!req.body.email){
        res.status(400).send("Email is required");
        return;
    }
    if(!req.body.otp){
        res.status(400).send("OTP is required");
        return;
    }
    User.findOne({ email: req.body.email }).then(user => {
        if(!user){
            res.status(400).send("Please try again from beginning");
        }else if(user && user.otp == req.body.otp){
            const payload = {
                id: user._id,
                name: user.name
            };
            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    if (token) {
                        res.json({
                            success: true,
                            token: token
                        });
                    } else {
                        res.status(400).send('Registered Successfully try logging in');
                    }
                }
            );
        }else{
            res.status(400).send("Incorrect OTP");
        }
    });

};
exports.loginUser = function(req, res, next){
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).send("Email not found");
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .send("Password incorrect");
            }
        });
    });
};
exports.getUserFromToken = function (req,done) {
    getUSerId(req, done);
};
exports.checkAuthentication = function (req, res, next) {
    getUSerId(req, function (err, data) {
        if(data && data.authorized){
            res.json({authorized:true,id : data.id});
        }else{
            res.status(401).send(err);
        }
    });
};
function getUSerId(req,done){
    if(req.headers && req.headers.authorization){
        var authorization = req.headers.authorization,
            decoded;
        try {
            decoded = jwt.verify(authorization, keys.secretOrKey);
        } catch (e) {
            return done('unauthorised',null);
        }
        var userId = decoded.id;
        // Fetch the user by id
        User.findOne({_id: userId}).then(function(user){
            // Do something with the user
            if(user){
                done(null,{authorized:true,id : user._id});
            }else{
                return done('unauthorised',null);
            }
        });
    }else{
        return done('unauthorised',null);
    }
}
