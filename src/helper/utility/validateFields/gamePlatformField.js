// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the platform fields (contain only =>( BGMI / PUBG )).
 * @param {Array} platforms - This method takes an array of game platform as input.
 * @param {Boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {Array} - It returns validation array to validate gamePlatform fields
 */
 const validateGamePlatform = (platforms, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(platforms)) throw new Error('This method accepts input as an array only.');

    return platforms.map(platform => {  // creating a validation array
        const validationChain = check(platform, 'Enter a valid platform (bgmi | pubg)').custom((value, {req}) => {
            return value ? ['bgmi', 'pubg'].includes(value?.toLowerCase()) : true  // if platform is missing then it's BGMI (default in db)
        });

        if (isOptional) {  // if the given fields need to be optional
            validationChain.optional();
        }

        // returns the validation array
        return validationChain;
    });
};

module.exports = { validateGamePlatform };