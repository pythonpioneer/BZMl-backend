const { check, body, validationResult } = require('express-validator');
const { validate } = require('../models/User');
const User = require('../models/User');


// validating user input field
const validateUserField = [

    // validating all input data to create user
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({min: 9, max: 12}).custom(async (pubgID) => {

        // find any user with the given id
        if(await User.findOne({ pubgID })) throw new Error('PUBG/BGMI ID is already in use.');
    }),
    body('pubgName', 'Enter your PUBG/BGMI name').isLength({min: 1, max: 30}).custom(async (pubgName) => {

        // find any user with the given name
        if(await User.findOne({ pubgName })) throw new Error('PUBG/BGMI name is already in use');
    }),
    body('fullName', 'Enter a valid full name').isLength({min: 3, max: 25}),

    body('email', 'Enter a valid Email').isEmail().isLength({max: 50}).custom(async (email) => {

        // find any user with the given email
        if(await User.findOne({email})) throw new Error('Email already in use');
    }),
    body('mobileNumber', 'Enter a valid mobile number').isNumeric().isLength({min: 10, max: 10}).custom(async (mobileNumber) => {
        if(await User.findOne({mobileNumber})) throw new Error('Mobile number already in use');
    }),
    body('password', 'Enter a valid password').isAlphanumeric().isLength({min: 6, max: 18}),
    body('gender', 'Enter gender initials').isAlpha().isLength({min: 1, max: 1}),
    body('refCode', 'Enter refral code (not required)').isLength({max: 20}),

];

// a description for all the possible input fields
const descriptions = {
    pubgID: {
        "min-length": 9,
        "max-length": 12,
        "type": "numeric",  // input character type
        "unique": true,
    },
    pubgName: {
        "min-length": 1,
        "max-length": 30,
        "type": "any",
        "unique": true,
    },
    fullName: {
        "min-length": 3,
        "max-length": 25,
        "type": "any",
        "unique": false,
    }, 
    email: {
        "min-length": 3,
        "max-length": 25,
        "type": "email",
        "unique": true,
    },
    mobileNumber: {
        "min-length": 10,
        "max-length": 10,
        "type": "numeric",
        "unique": true,
    },
    password: {
        "min-length": 6,
        "max-length": 18,
        "type": "alpha-numeric",
        "unique": false,
    },
    gender: {
        "min-length": 1,
        "max-length": 1,
        "type": "alpha",
        "unique": false,
    },
    refCode: {
        "min-length": 0,
        "max-length": 20,
        "type": "any",
        "unique": false,
    }
};

module.exports = {descriptions, validateUserField};