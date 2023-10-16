// importing all requirements
const router = require('express').Router();
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { verifyEmail, generateOtpEmail, recoverUserPassword } = require('../controllers/verify');

// to validate input fields
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { validatePassword } = require('../helper/utility/validateFields/passwordField');
const { validateEmail } = require('../helper/utility/validateFields/emailField');
const { validateOtp } = require('../helper/utility/validateFields/otpField');


// validation array to validate OTP 
const _validateFields = [
    ...validateEmail(['email']),
    ...validateOtp(['otp']),
];

// Route 1: To generate otp for email verification: '/bzml/api/v1/verify/generate-email-otp' [using POST] (login required) 
router.post('/generate-email-otp', validateEmail, validateValidationResult, fetchUser, generateOtpEmail);

// Route 2: To verify user Email Address using OTP: '/bzml/api/v1/verify/email' [using POST] (login not required)
router.post('/email', _validateFields, validateValidationResult, verifyEmail);

// Route 3: To implement forgot password using OTP: '/bzml/api/v1/verify/recover-password?user=<user/admin>' [using POST] (login not required)
router.post('/recover-password', [
    ..._validateFields,
    ...validatePassword(['password']),
], 
    validateValidationResult,
    recoverUserPassword
);


// now export the router
module.exports = router;
