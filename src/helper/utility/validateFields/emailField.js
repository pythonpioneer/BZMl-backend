// importing requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the email fields.
 * @param {array} emails - This method takes an array of email-names as input.
 * @returns {array} - It returns validation array to validate email fields
 */
const validateEmail = (emails) => {

    // check that the given input is array type
    if (!Array.isArray(emails)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return emails.map(email => check(email, `Enter a valid ${email}`).isEmail().isLength({ max: 50 }));
};

module.exports = { validateEmail };