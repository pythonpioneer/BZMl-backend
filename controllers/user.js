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

module.exports = { createUser };