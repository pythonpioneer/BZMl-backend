// importing requirements
const { check } = require('express-validator');
const { findRecord } = require('../findDb');

/**
 * This method is only used to validate the referral fields.
 * @param {Array} refCodes - This method takes an array of referrals as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {Object} object - It contain two things, one checkInDb and the other is the model name => object: { checkInDb: True, modelName: 'User' }
 * @returns {Array} - It returns validation array to validate referrals fields.
 */
const validateRefcode = (refCodes, isOptional, object) => {

    // check that the given input is array type
    if (!Array.isArray(refCodes)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return refCodes.map(refCode => {
        const validationChain = check(refCode)
            .isLength({ min: 1, max: 30 })
            .isAlphanumeric()
            .custom(value => !/\s/.test(value)) // removing all white spaces
            .withMessage('Enter a valid ref code (without spaces)');

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // find the record in the database, if present then throw an error
        if (object?.checkInDb) {
            validationChain.custom(async (myRefCode) => await findRecord(object?.modelName, { myRefCode }));  // using find record method to find the data in the given database.
        }

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateRefcode };