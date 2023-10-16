// importing all requirements
const { check } = require('express-validator');
const { findRecord } = require('../findDb');

/**
 * This method is only used to validate the mobile fields.
 * @param {Array} mobNumbers - This method takes an array of mobile numbers as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {Object} object - It contain two things, one checkInDb and the other is the model name => object: { checkInDb: True, modelName: 'User' }
 * @returns {Array} - It returns validation array to validate mobile fields.
 */
 const validateMobile = (mobNumbers, isOptional, object) => {

    // check that the given input is array type
    if (!Array.isArray(mobNumbers)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return mobNumbers.map(mobile => {
        const validationChain = check(mobile, 'Enter a valid mobile number').isNumeric().isLength({ min: 10, max: 10 });

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // find the record in the database, if present then throw an error
        if (object?.checkInDb) {
            validationChain.custom(async (mobileNumber) => await findRecord(object?.modelName, { mobileNumber }));
        }

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateMobile };