// importing requirements
const { check } = require('express-validator');
const { findRecord } = require('../findDb');

/**
 * This method is only used to validate the email fields.
 * @param {Array} gameNames - This method takes an array of game-names as input.
 * @param {Boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {Object} object - It contain two things, one checkInDb and the other is the model name => object: { checkInDb: True, modelName: 'User' }
 * @returns {Array} - It returns validation array to validate game name fields.
 */
 const validateGameName = (gameNames, isOptional, object) => {

    // check that the given input is array type
    if (!Array.isArray(gameNames)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return gameNames.map(name => {
        const validationChain = check(name, 'Enter your PUBG/BGMI name').isLength({ max: 30 });

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // find the record in the database, if present then throw an error
        if (object?.checkInDb) {
            validationChain.custom(async (pubgName) => await findRecord(object?.modelName, { pubgName }));  // using find record method to find the data in the given database.
        }

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateGameName };