// importing all requirements
const { body } = require('express-validator');

// validate the gameId and password field
exports.validateBanFields = [
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }),
    body('password', "Enter a valid password (admin)").isAlphanumeric().isLength({ min: 6, max: 18 })
];