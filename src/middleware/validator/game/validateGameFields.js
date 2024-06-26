// importing all requiremnts
const { check } = require('express-validator');
const { validateGamePlatform } = require('../../../helper/utility/validateFields/gamePlatformField');
const { validateGameMode } = require('../../../helper/utility/validateFields/gameModeField');
const { validateMoney } = require('../../../helper/utility/validateFields/moneyField');
const { validateGameMap } = require('../../../helper/utility/validateFields/mapField');
const { validateMongoId } = require('../../../helper/utility/validateFields/mongoFields');
const { validateBooleanOnly } = require('../../../helper/utility/validateFields/booleanOnlyField');


// contain all game fields
const _gameFields = [
    ...validateGameMap(['gamingMap']),
    ...validateMoney(['prizePool']),
    check('roomId', "Enter valid room Id").isNumeric().isLength({ max: 10 }),
    check('roomPass', "Enter a valid room Password").isAlphanumeric().isLength({ min: 1, max: 15 }),
    check('gamingTitle', "enter a valid title (alpha numeric)").isAlphanumeric('en-US', { ignore: ' '}).isLength({ min: 3, max: 50 }),
];

// validate the game fields to create game 
exports.validateGameFields = [
    ...validateGamePlatform(['gamingPlatform']),
    ...validateGameMode(['gamingMode']),
    ...validateGameMap(['gamingMap']),
    ...validateMoney(['prizePool', 'entryFee']),
    check('gamingTitle', "enter a valid title").isLength({ min: 3, max: 100 }),
];

// validate squad registration
exports.validateSquadRegistration = [
    ...validateMongoId(['game-id']),
    ...validateBooleanOnly(['wantRandomPlayers'], true),
    ...validateBooleanOnly(['canPlaySolo'], true),
    check('teamCode', 'Enter a valid team code!').isLength({ min: 5, max: 5 }).optional(),
];

// validate the game fields to update the game
exports.validateUpdationFields = _gameFields.map(validtaionRule => validtaionRule.optional());