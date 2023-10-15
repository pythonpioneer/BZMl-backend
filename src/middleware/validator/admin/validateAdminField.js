const { body, validationResult } = require('express-validator');
const { findRecord } = require('../../../helper/utility/findDb');
const { validateEmail } = require('../../../helper/utility/validateFields/emailField');
const { validateFullName } = require('../../../helper/utility/validateFields/fullNameField');
const { validateGender } = require('../../../helper/utility/validateFields/genderField');
const { validateMobile } = require('../../../helper/utility/validateFields/mobileField');
const { validatePassword } = require('../../../helper/utility/validateFields/passwordField');
const Admin = require('../../../models/user/Admin');


// A validation array to validate user input field for registration
exports.validateRegField = [
    ...validateFullName(['fullName']),
    ...validateEmail(['email'], false, { checkInDb: true, modelName: 'Admin' }),
    ...validateMobile(['mobileNumber'], false, { checkInDb: true, modelName: 'Admin' }),
    ...validatePassword(['password']),
    ...validateGender(['gender']),
];
