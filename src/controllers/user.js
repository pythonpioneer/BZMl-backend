// importing all requirements
const User = require('../models/user/User');
const { validationResult } = require('express-validator');
const { generateToken } = require('../middleware/auth/authMiddleware');
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { isNumber } = require('../helper/utility/fieldIdentifier');


// to create user
const createUser = async (req, res) => {

    // generate password using bcrypt
    const securePassword = generatePassword(req.body.password);

    // create the user in db
    User.create({
        pubgID: req.body.pubgID,
        pubgName: req.body.pubgName,
        fullName: req.body.fullName,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        password: securePassword,
        gender: req.body.gender,
        refCode: req.body.refCode ? req.body.refCode : null,
        isVerified: false,
    })
        .then((user) => {  // sending response, when user is created

            // sending user id as payload, because accesssing data using id is easier
            const payloadData = {
                user: {
                    id: user.id
                },
            };

            // generating authToken when user created
            const authToken = generateToken(payloadData);
            res.status(200).json({"status": 200, "message": "user created", "auth-token": authToken});
        })

        .catch(err => res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error", 
            issue: err
        }));
};

// to login an existing user
const loginUser = async (req, res) => {

    try {  // now confirm authentication
        
        let user;
        const { userfield, password } = req.body;  // fetching values from request body

        /* find the user with given email/id/no. and validate, if user exists 
        now, find the type of user field */
        if(isNumber (userfield))
            user = await User.findOne({mobileNumber: userfield});  // login with mobile no.
        else user = await User.findOne({ email: userfield });  // login with email
        
        // if user doesn't exist or wrong input fields
        if(!user) return res.status(400).json({ status: 400, message: "Invalid Credentials" });
        
        // now, compare the password using bcrypt.js
        const isPasswordMatches = comparePassword(password, user.password);
        if (!isPasswordMatches) return res.status(400).json({ status: 400, message: "Invalid Credentials" });  // password not matched

        // if password matched, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // generate auth-token send it
        const authToken = generateToken(payloadData)
        res.status(200).json({ status: 200, "message": "user Logged In", "auth-token": authToken});

    } catch(err){
        res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error", issue: err
        })
    }
};

module.exports = { createUser, loginUser };