// importing all requiremnts
const { check } = require('express-validator');
const { validateGamePlatform } = require('../../../helper/utility/validateFields/gamePlatformField');
const { validateGameMode } = require('../../../helper/utility/validateFields/gameModeField');
const { validateMoney } = require('../../../helper/utility/validateFields/moneyField');
const { validateGameMap } = require('../../../helper/utility/validateFields/mapField');


// contain all game fields
const _gameFields = [
    ...validateGamePlatform(['gamingPlatform']),
    ...validateGameMode(['gamingMode']),
    ...validateGameMap(['gamingMap']),
    ...validateMoney(['prizePool']),
    check('roomId', "Enter valid room Id").isNumeric().isLength({ max: 10 }),
    check('roomPass', "Enter a valid room Password").isAlphanumeric().isLength({ min: 1, max: 15 }),
];

// validate the game fields to create game 
exports.validateGameFields = [
    ...validateGamePlatform(['gamingPlatform']),
    ...validateGameMode(['gamingMode']),
    ...validateGameMap(['gamingMap']),
    ...validateMoney(['prizePool', 'entryFee']),
    check('gamingTitle', "enter a valid title (alpha numeric)").isAlphanumeric('en-US', { ignore: ' '}).isLength({ min: 3, max: 50 }),
];

// validate the game fields to update the game
exports.validateUpdationFields = _gameFields.map(validtaionRule => validtaionRule.optional());