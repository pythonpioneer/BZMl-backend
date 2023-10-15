// importing all requiremnts
const { body } = require('express-validator');
const { validateGamePlatform } = require('../../../helper/utility/validateFields/gamePlatformField');
const { validateGameMode } = require('../../../helper/utility/validateFields/gameModeField');
const { validateMoney } = require('../../../helper/utility/validateFields/moneyField');


// contain all game fields
const _gameFields = [
    ...validateGamePlatform(['gamingPlatform']),
    ...validateGameMode(['gamingMode']),
    ...validateMoney(['prizePool']),
];

// validate the game fields to create game 
exports.validateGameFields = [
    ...validateGamePlatform(['gamingPlatform']),
    ...validateGameMode(['gamingMode']),
    ...validateMoney(['prizePool', 'entryFee']),
];

// validate the game fields to update the game
exports.validateUpdationFields = _gameFields.map(validtaionRule => validtaionRule.optional());