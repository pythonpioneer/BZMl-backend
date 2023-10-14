// importing all requirements
const { body } = require('express-validator');
const { findRecord } = require('../../helper/utility/findDb');
const { validatePassword } = require('../../helper/utility/validateFields/passwordField');
const { validateEmail } = require('../../helper/utility/validateFields/emailField');
const { validateGameName } = require('../../helper/utility/validateFields/gameNameField');


// validate basic fields, which get duplicated in validateRetistration fields and in validateUpdation fields
const _validateBaseFields = [  // add fields that can be updated only
    ...validateGameName(['pubgName'], false, { checkInDb: true, modelName: 'User' }),
    body('fullName', 'Enter a valid full name').isLength({ min: 3, max: 25 }),
    ...validateEmail(['email'], false, { checkInDb: true, modelName: 'User' }),
    body('mobileNumber', 'Enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }).custom(async (mobileNumber) => await findRecord('User', { mobileNumber })),
    body('gender', 'Enter gender initials').isAlpha().isLength({ min: 1, max: 1 }),
];

// adding extra fields to validate the user input
const _validateMoreFields = [  // add fields that can not be updated
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }).custom(async (pubgID) => await findRecord('User', { pubgID })),
    ...validatePassword(['password']),
    body('refCode', 'Enter refral code (not required)').isLength({ max: 50 }),
]

// A validation array to validate user input field for registration
exports.validateRegistrationField = [

    ..._validateBaseFields,  // contain { pubgName, fullName, email, moblieNumber, gender }
    ..._validateMoreFields, // contain { pubgId, password, refCode }

    /* If you want to add some more fields to validate
    then add those fields in "_validateMoreFields" or in "_validateBaseFields".  */
];

// A validation array to validate user input field for login
exports.validateLoginField = [
    body('userfield', 'enter valid mobileNumber/email to login').isLength({ min: 9, max: 50 }),
    ...validatePassword(['password']),
];

// A validation array to validate user input field to update details
exports.validateUpdationField = _validateBaseFields.map((validationRule) => {  // adding optional attributes to all fields for updation
    return validationRule.optional();
});

// validating referral code 
exports.validateRefCode = [
    body('myRefCode')
        .isLength({ min: 1, max: 30})
        .isAlphanumeric()
        .custom(value => !/\s/.test(value))
        .withMessage('Enter a valid ref code (without spaces)')
        .custom(async (myRefCode) => await findRecord('User', { myRefCode })),
];
