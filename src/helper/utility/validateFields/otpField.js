// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the OTP fields.
 * @param {Array} otpFields - This method takes an array of OTP input.
 * @returns {Array} - It returns validation array to validate OTP fields
 */
const validateOtp = (otpFields, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(otpFields)) throw new Error('This method accepts input as an array only.');

    // now returns the validation array to validate the otp fields
    return otpFields.map(otp => {
        return check('otp', 'Enter Valid OTP').isNumeric().isLength({ min: 6, max: 6 });
    });
};

module.exports = { validateOtp };