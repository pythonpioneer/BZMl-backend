// importing all requirements
const { check } = require('express-validator');

/**
 * This method is only used to validate the game map fields (contain only =>( ERANGEL | NUSA | SANHOK | KARAKIN | MIRAMAR | LIVIK | VIKENDI )).
 * @param {Array} maps - This method takes an array of game map as input.
 * @param {Boolean} isOptional - provide optional as true, if want the validation array to become optional
 * @returns {Array} - It returns validation array to validate game map fields
 */
 const validateGameMap = (maps, isOptional) => {

    // check that the given input is array type
    if (!Array.isArray(maps)) throw new Error('This method accepts input as an array only.');

    return maps.map(gameMap => {  // creating a validation array
        const validationChain = check(gameMap, 'Enter a valid map (ERANGEL | NUSA | SANHOK | KARAKIN | MIRAMAR | LIVIK | VIKENDI)').custom(value => ['erangel', 'nusa', 'sanhok', 'karakin', 'miramar', 'livik', 'vikendi'].includes(value?.toLowerCase())).isLength({ min: 3 });

        if (isOptional) {  // if the given fields need to be optional
            validationChain.optional();
        }

        // returns the validation array
        return validationChain;
    });
};

module.exports = { validateGameMap };