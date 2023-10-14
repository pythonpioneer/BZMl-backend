// importing all requirements
const { body, check } = require('express-validator');


/**
 * This method is only used to validate the password fields.
 * @param {array} passwordNames - This method takes an array as input.
 * @returns {array} - It returns validation array to validate password fields
 */
const validatePassword = (passwordNames) => {  // the password names can contain many password name

    // check that the given input is array type
    if (!Array.isArray(passwordNames)) throw new Error('This method accepts input as an array only.');
    
    // traverse in the password Names
    return passwordNames.map(passwordName => {
        return body(passwordName, `Enter a valid ${passwordName}`).isLength({ min: 6, max: 18 });
    });
};


// exporting all fields to be validated
module.exports = { validatePassword };