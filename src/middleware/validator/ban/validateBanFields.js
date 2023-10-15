// importing all requirements
const { validateGameId } = require('../../../helper/utility/validateFields/gameIdField');
const { validatePassword } = require('../../../helper/utility/validateFields/passwordField');


// validate the gameId and password field
exports.validateBanFields = [
    ...validateGameId(['pugbID']),
    ...validatePassword(['password']),
];