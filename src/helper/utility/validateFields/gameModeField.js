// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the game mode fields (contain only =>( BGMI / PUBG )).
 * @param {Array} modes - This method takes an array of game mode as input.
 * @param {Boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {Array} - It returns validation array to validate game mode fields
 */
 const validateGameMode = (modes, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(modes)) throw new Error('This method accepts input as an array only.');

    return modes.map(mode => {  // creating a validation array
        const validationChain = check(mode).custom(value => ['solo', 'duo', 'squad'].includes(value?.toLowerCase())).isLength({ min: 3 }).withMessage('Enter a valid mode (solo | duo | squad)');

        if (isOptional) {  // if the given fields need to be optional
            validationChain.optional();
        }

        // returns the validation array
        return validationChain;
    });
};

module.exports = { validateGameMode };