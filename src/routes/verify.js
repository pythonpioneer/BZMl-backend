// importing all requirements
const router = require('express').Router();
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { verifyEmail, generateEmailOtp, recoverUserPassword, generateMobileOtp, verifyMobile } = require('../controllers/verify');

// to validate input fields
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { validatePassword } = require('../helper/utility/validateFields/passwordField');
const { validateEmail } = require('../helper/utility/validateFields/emailField');
const { validateMobile } = require('../helper/utility/validateFields/mobileField');
const { validateOtp } = require('../helper/utility/validateFields/otpField');


// validation array to validate OTP 
const _validateFields = [
    ...validateEmail(['email']),
    ...validateOtp(['otp']),
];

// Route 1: To generate otp for email verification: '/bzml/api/v1/verify/generate-email-otp' [using POST] (login required) 
router.post('/generate-email-otp', fetchUser, generateEmailOtp);

// Route 2: To verify user Email Address using OTP: '/bzml/api/v1/verify/email' [using POST] (login not required)
router.post('/email', _validateFields, validateValidationResult, verifyEmail);

// Route 3: To implement forgot password using OTP: '/bzml/api/v1/verify/recover-password?user=<user/admin>' [using POST] (login not required)
router.post('/recover-password', [
    ..._validateFields,
    ...validatePassword(['password']),
], validateValidationResult, recoverUserPassword);

// Route 4: To generate otp for mobile verification: '/bzml/api/v1/verify/generate-mobile-otp' [using POST] (login required) 
router.post('/generate-mobile-otp', fetchUser, generateMobileOtp);

// Route 5: To verify user mobile number using OTP: '/bzml/api/v1/verify/mobile' [using POST] (login not required)
router.post('/mobile', [
    ...validateMobile(['mobileNumber']),
    ...validateOtp(['otp']),
], validateValidationResult, verifyMobile);

// now export the router
module.exports = router;
