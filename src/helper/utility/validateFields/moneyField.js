// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the money fields (contain only =>( BGMI / PUBG )).
 * @param {Array} moneyNames - This method takes an array of moneyNames as input.
 * @param {Boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {Array} - It returns validation array to validate money fields
 */
 const validateMoney = (moneyNames, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(moneyNames)) throw new Error('This method accepts input as an array only.');

    return moneyNames.map(money => {  // creating a validation array
        const validationChain = check(money, `Enter valid ${money} (Numeric)`).isNumeric();

        if (isOptional) {  // if the given fields need to be optional
            validationChain.optional();
        }

        // returns the validation array
        return validationChain;
    });
};

module.exports = { validateMoney };