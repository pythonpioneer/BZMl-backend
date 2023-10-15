// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the gender fields (contain only initials =>( M | F | O)).
 * @param {array} genders - This method takes an array of gender as input.
 * @param {boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {array} - It returns validation array to validate gender fields
 */
const validateGender = (genders, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(genders)) throw new Error('This method accepts input as an array only.');

    return genders.map(gender => {
        const validationChain = check(gender, 'Enter gender initials').isAlpha().isLength({ min: 1, max: 1 });

        if (isOptional) {  // if the given fields need to be optional
            validationChain.optional();
        }

        // returns the validation array
        return validationChain;
    });
};

module.exports = { validateGender };