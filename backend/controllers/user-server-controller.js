const mongoose = require("mongoose");
const User = require("./../model/user-server-model");
const validateRegisterInput = require("./../validation/registration");
const bcrypt = require("bcryptjs");
const validateLoginInput = require("./../validation/login");
const jwt = require("jsonwebtoken");
const keys = require("./../config/keys");

userController = {
    registerUser : function(req, res, next){
        const { errors, isValid } = validateRegisterInput(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.status(400).json({email: "Email already exists"});
            }
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => {

                            res.json(user);
                        })
                        .catch(err => console.log(err));
                });
            });
        })
    },
    loginUser : function(req, res, next){
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
                return res.status(404).json({emailnotfound: "Email not found"});
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
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    return res
                        .status(400)
                        .json({passwordincorrect: "Password incorrect"});
                }
            });
        });
    },
    checkAuthentication : function (req, res, next) {
        if(req.headers && req.headers.authorization){
            var authorization = headers.authorization,
                decoded;
            try {
                decoded = jwt.verify(authorization, secret.secretToken);
            } catch (e) {
                return res.status(401).send('unauthorized');
            }
            var userId = decoded.id;
            // Fetch the user by id
            User.findOne({_id: userId}).then(function(user){
                // Do something with the user
                if(user){
                    next();
                }else{
                    res.render('Join', {url : '/login'});
                }
            });
        }else{
            res.render('Join', {url : '/login'});
        }
    }
};
module.exports = userController;