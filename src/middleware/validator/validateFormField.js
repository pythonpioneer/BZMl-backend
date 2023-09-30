const { body, validationResult } = require('express-validator');
const User = require('../../models/user/User');



/**
 * find field/record in database
 * @param {Object} record - It takes a field and find the field in db
 * @throws {Error} - It throws an error if record in database
 */
const findRecord = async (record) => {
    if (await User.findOne(record)) throw new Error(`${Object.keys(record)} is already in use.`);
};


// A validation array to validate user input field for registration
exports.validateRegistrationField = [

    // validating all input data to create user
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }).custom(async (pubgID) => await findRecord({ pubgID })),
    body('pubgName', 'Enter your PUBG/BGMI name').isLength({ min: 1, max: 30 }).custom(async (pubgName) => await findRecord({ pubgName })),
    body('fullName', 'Enter a valid full name').isLength({ min: 3, max: 25 }),
    body('email', 'Enter a valid Email').isEmail().isLength({ max: 50 }).custom(async (email) => await findRecord({ email })),
    body('mobileNumber', 'Enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 }).custom(async (mobileNumber) => await findRecord({ mobileNumber })),
    body('password', 'Enter a valid password').isAlphanumeric().isLength({ min: 6, max: 18 }),
    body('gender', 'Enter gender initials').isAlpha().isLength({ min: 1, max: 1 }),
    body('refCode', 'Enter refral code (not required)').isLength({ max: 50 }),
];

// A validation array to validate user input field for login
exports.validateLoginField = [
    body('userfield', 'enter valid mobileNumber/email to login').isLength({ min: 9, max: 50 }),
    body('password', "Enter valid password").isAlphanumeric().isLength({ min: 6, max: 18 })
];

// A validation array to validate user input field to update details
exports.validateUpdationField = [

    body('pubgName', 'Enter your PUBG/BGMI name').optional().isLength({ min: 1, max: 30 }).custom(async (pubgName) => await findRecord({ pubgName })),
    body('fullName', 'Enter a valid full name').optional().isLength({ min: 3, max: 25 }),
    body('email', 'Enter a valid Email').optional().isEmail().isLength({ max: 50 }).custom(async (email) => await findRecord({ email })),
    body('mobileNumber', 'Enter a valid mobile number').optional().isNumeric().isLength({ min: 10, max: 10 }).custom(async (mobileNumber) => await findRecord({ mobileNumber })),
    body('gender', 'Enter gender initials').optional().isAlpha().isLength({ min: 1, max: 1 }),
];
