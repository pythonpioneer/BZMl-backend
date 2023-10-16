// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the boolean only fields.
 * @param {Array} bools - This method takes an array of boolean-names as input.
 * @param {Boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {Array} - It returns validation array to validate boolean Only fields
 */
const validateBooleanOnly = (bools, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(bools)) throw new Error('This method accepts input as an array only.');

    return bools.map(bool => {
        const validationChain = check(bool).custom(flag => flag === true || flag === false).withMessage('This property only accepts boolean');

        if (isOptional) {  // if the given fields need to be optional
            validationChain.optional();
        }

        // returns the validation array
        return validationChain;
    });
};

module.exports = { validateBooleanOnly };