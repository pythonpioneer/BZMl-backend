// importing all requirements
const { body } = require('express-validator');
const { verifyEmail, generateOtpEmail, recoverUserPassword } = require('../controllers/verify');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const router = require('express').Router();
const { fetchUser } = require('../middleware/auth/authMiddleware');


// validation array to validate email
const _validateEmail = [
    body('email', 'Enter a valid Email').isEmail().isLength({ max: 50 }),
];

// validation array to validate OTP 
const _validateFields = [
    ..._validateEmail,
    body('otp', 'Enter Valid OTP').isNumeric().isLength({ min: 6, max: 6 }),
];

// validation array for validating password fields
const _validatePassword = [
    body('password', 'Enter a valid password').isLength({ min: 6, max: 18 }),
];

// Route 1: To generate otp for email verification: '/bzml/api/v1/verify/generate-email-otp' [using POST] (login required) 
router.post('/generate-email-otp', _validateEmail, validateValidationResult, fetchUser, generateOtpEmail);

// Route 2: To verify user Email Address using OTP: '/bzml/api/v1/verify/email' [using POST] (login not required)
router.post('/email', _validateFields, validateValidationResult, verifyEmail);

// Route 3: To implement forgot password using OTP: '/bzml/api/v1/verify/recover-user' [using POST] (login not required)
router.post('/recover-user', [
    ..._validateFields,
    ..._validatePassword
], 
    validateValidationResult,
    recoverUserPassword
);


// now export the router
module.exports = router;
