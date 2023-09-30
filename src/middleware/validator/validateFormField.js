// importing all requirements
const { body, validationResult } = require('express-validator');
const { findRecord } = require('../../helper/utility/findDb');


// validate basic fields, which get duplicated in validateRetistration fields and in validateUpdation fields
const _validateBaseFields = [  // do not export this field
    body('pubgName', 'Enter your PUBG/BGMI name').isLength({ min: 1, max: 30 }).custom(async (pubgName) => await findRecord('User', { pubgName })),
    body('fullName', 'Enter a valid full name').isLength({ min: 3, max: 25 }),
    body('email', 'Enter a valid Email').isEmail().isLength({ max: 50 }).custom(async (email) => await findRecord('User', { email })),
    body('mobileNumber', 'Enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }).custom(async (mobileNumber) => await findRecord('User', { mobileNumber })),
    body('gender', 'Enter gender initials').isAlpha().isLength({ min: 1, max: 1 }),
];


// A validation array to validate user input field for registration
exports.validateRegistrationField = [

    // validating all input data to create user
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }).custom(async (pubgID) => await findRecord('User', { pubgID })),
    ..._validateBaseFields,
    body('password', 'Enter a valid password').isAlphanumeric().isLength({ min: 6, max: 18 }),
    body('refCode', 'Enter refral code (not required)').isLength({ max: 50 }),
];

// A validation array to validate user input field for login
exports.validateLoginField = [
    body('userfield', 'enter valid mobileNumber/email to login').isLength({ min: 9, max: 50 }),
    body('password', "Enter valid password").isAlphanumeric().isLength({ min: 6, max: 18 })
];

// A validation array to validate user input field to update details
exports.validateUpdationField = _validateBaseFields.map((validationRule) => {  // adding optional attributes to all fields for updation
    return validationRule.optional();
});
