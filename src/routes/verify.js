// importing all requirements
const { body } = require('express-validator');
const { verifyEmail } = require('../controllers/verify');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const router = require('express').Router();

// validation array to validate OTP 
const _validateOtp = [
    body('email', 'Enter a valid Email').isEmail().isLength({ max: 50 }),
    body('otp', 'Enter Valid OTP').isNumeric().isLength({ min: 6, max: 6 }),
];

// Route 1: To generate otp for email verification: '/bzml/api/v1/verify/generate-email-otp' [using POST] (login required) 

// Route 2: To verify user Email Address: '/bzml/api/v1/verify/email' [using POST] (login not required)
router.post('/email', _validateOtp, validateValidationResult, verifyEmail);

// now export the router
module.exports = router;