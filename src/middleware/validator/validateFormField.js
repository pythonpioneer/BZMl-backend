const { body, validationResult } = require('express-validator');
const User = require('../../models/user/User');


// A validation array to validate user input field for registration
exports.validateRegistrationField = [

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
    body('refCode', 'Enter refral code (not required)').isLength({max: 50}),

];

// A validation array to validate user input field for login
exports.validateLoginField = [
    body('userfield', 'enter valid mobileNumber/email to login').isLength({min: 9, max: 50}),
    body('password', "Enter valid password").isAlphanumeric().isLength({min: 6, max: 18})
];

// A validation array to validate user input field to update details
exports.validateUpdationField = [

    body('pubgName', 'Enter your PUBG/BGMI name').optional().isLength({min: 1, max: 30}).custom(async (pubgName) => {

        // find any user with the given name
        if(await User.findOne({ pubgName })) throw new Error('PUBG/BGMI name is already in use');
    }),
    body('fullName', 'Enter a valid full name').optional().isLength({min: 3, max: 25}),
    body('email', 'Enter a valid Email').optional().isEmail().isLength({max: 50}).custom(async (email) => {

        // find any user with the given email
        if(await User.findOne({email})) throw new Error('Email already in use');
    }),
    body('mobileNumber', 'Enter a valid mobile number').optional().isNumeric().isLength({min: 10, max: 10}).custom(async (mobileNumber) => {
        if(await User.findOne({mobileNumber})) throw new Error('Mobile number already in use');
    }),
    body('gender', 'Enter gender initials').optional().isAlpha().isLength({min: 1, max: 1}),
];
