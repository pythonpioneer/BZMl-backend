// importing all requiremnts
const { body } = require('express-validator');

// contain all game fields
const _gameFields = [
    body('gamingPlatform', 'Enter a valid platform (bgmi | pubg)').custom((value, {req}) => {
        return value ? ['bgmi', 'pubg'].includes(value?.toLowerCase()) : true  // if platform is missing then it's BGMI (default in db)
    }),
    body('gamingMode').custom(value => ['solo', 'duo', 'squad'].includes(value?.toLowerCase())).isLength({ min: 3 }).withMessage('Enter a valid mode (solo | duo | squad)'),
    body('prizePool', 'Enter valid prize pool (Numeric)').isNumeric(),
    body('entryFee', 'Enter valid entry fee (Numeric)').isNumeric(),
];

// validate the game fields to create game 
exports.validateGameFields = [
    body('gamingPlatform', 'Enter a valid platform (bgmi | pubg)').custom((value, {req}) => {
        return value ? ['bgmi', 'pubg'].includes(value?.toLowerCase()) : true  // if platform is missing then it's BGMI (default in db)
    }),
    body('gamingMode').custom(value => ['solo', 'duo', 'squad'].includes(value?.toLowerCase())).isLength({ min: 3 }).withMessage('Enter a valid mode (solo | duo | squad)').notEmpty(),
    body('prizePool', 'Enter valid prize pool (Numeric)').isNumeric(),
    body('entryFee', 'Enter valid entry fee (Numeric)').isNumeric(),
];

// validate the game fields to update the game
exports.validateUpdationFields = _gameFields.map(validtaionRule => validtaionRule.optional());