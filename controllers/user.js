// importing all requirements
const { descriptions } = require('./validator');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// creating a signature to sign the payload data for identification
const signature = "iwillcompletethisprojectasap";

// to create user
const createUser = async (req, res) => {

    // validating errors for authentication (creating user)
    const result = validationResult(req);

    // user will not create
    if (!result.isEmpty()) return res.status(400).json({
        status: 400,
        message: result["errors"][0]["msg"],
        where: result["errors"][0]["path"],
        desc: descriptions[result["errors"][0]["path"]],
    });

    // now generate a hash password from password using hashing
    const salt = bcrypt.genSaltSync(10);  // salt of 10 characters
    const securePassword = bcrypt.hashSync(req.body.password, salt);

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
            const authToken = jwt.sign(payloadData, signature);
            res.status(200).json({"status": 200, "message": "user created", "auth-token": authToken});
        })

        .catch(err => res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error", issue: err
        }));
};

// to login an existing user
const loginUser = async (req, res) => {

    // validating errors for authentication (creating user)
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({ status: 400, message: result["errors"][0]["msg"], where: result["errors"][0]["path"] });

    try {  // now confirm authentication
        
        let user;
        const { userfield, password } = req.body;  // fetching values from request body

        /* find the user with given email/id/no. and validate, if user exists 
        now, find the type of user field */
        if(/^[0-9]*$/.test(userfield)){  // means userfield belongs to mobileNumber or pubgID

            user = await User.findOne({mobileNumber: userfield});  // login with mobile no.
            if(!user) user = await User.findOne({pubgID: userfield});  // login with pubg-id
        }
        else user = await User.findOne({ email: userfield });  // login with email
        
        // if user doesn't exist or wrong input fields
        if(!user) return res.status(400).json({ status: 400, message: "Invalid Credentials" });
        
        // now, compare the password using bcrypt.js
        const isPasswordMatches = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatches) return res.status(400).json({ status: 400, message: "Invalid Credentials" });  // password not matched

        // if password matched, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // generate auth-token send it
        const authToken = jwt.sign(payloadData, signature);
        res.status(200).json({ status: 200, "message": "user created", "auth-token": authToken});

    } catch(err){
        res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error", issue: err
        })
    }
};

module.exports = { createUser, loginUser };