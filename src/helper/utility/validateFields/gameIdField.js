// importing requirements
const { check } = require('express-validator');
const { findRecord } = require('../findDb');

/**
 * This method is only used to validate the id fields.
 * @param {array} gameIds - This method takes an array of game-ids as input.
 * @param {boolean} isOptional - Provide optional as true, if want the validation array to become optional.
 * @param {object} object - It contain two things, one checkInDb and the other is the model name => object: { checkInDb: True, modelName: 'User' }
 * @returns {array} - It returns validation array to validate game-id fields.
 */
 const validateGameId = (gameIds, isOptional, object) => {

    // check that the given input is array type
    if (!Array.isArray(gameIds)) throw new Error('This method accepts input as an array only.');

    // returns the validation array to validate email
    return gameIds.map(gameId => {
        const validationChain = check(gameId, 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 });

        // making the validation array optional and return the validation array
        if (isOptional) validationChain.optional();

        // find the record in the database, if present then throw an error
        if (object?.checkInDb) {
            validationChain.custom(async (pubgID) => await findRecord(object?.modelName, { pubgID }));  // using find record method to find the data in the given database.
        }

        // return the validation array
        return validationChain;
    });
};

module.exports = { validateGameId };