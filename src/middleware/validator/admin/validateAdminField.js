const { body, validationResult } = require('express-validator');
const Admin = require('../../../models/user/Admin');


// A validation array to validate user input field for registration
exports.validateRegField = [

    body('fullName', 'Enter a valid full name').isLength({min: 3, max: 25}),

    body('email', 'Enter a valid Email').isEmail().isLength({max: 50}).custom(async (email) => {
        if(await Admin.findOne({email})) throw new Error('Email already in use');
    }),

    body('mobileNumber', 'Enter a valid mobile number').isNumeric().isLength({min: 10, max: 10}).custom(async (mobileNumber) => {
        if(await Admin.findOne({mobileNumber})) throw new Error('Mobile number already in use');
    }),

    body('password', 'Enter a valid password').isAlphanumeric().isLength({min: 6, max: 18}),
    body('gender', 'Enter gender initials').isAlpha().isLength({min: 1, max: 1}),
    body('refCode', 'Enter refral code (not required)').isLength({max: 50}),
];
