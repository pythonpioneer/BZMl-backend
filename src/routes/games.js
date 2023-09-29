// importing all requirements
const express = require('express');
const { body, validationResult } = require('express-validator');
const { createGame, getGames } = require('../controllers/game');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');

// now creating router, to map all routes
const router = express.Router();

// Route 1: To create a game (only admin to access): '/bzml/api/v1/games/create-game' [using POST] (login required)
router.post('/create-game', [
    body('gamingPlatform', 'Enter a valid platform (bgmi | pubg)').custom((value, {req}) => {
        return value ? ['bgmi', 'pubg'].includes(value?.toLowerCase()) : true  // if platform is missing then it's BGMI (default in db)
    }),
    body('gamingMode', 'Enter a valid mode (solo | duo | squad)').custom(value => ['solo', 'duo', 'squad'].includes(value?.toLowerCase())),
    body('prizePool', 'Enter valid prize pool (Numeric)').isNumeric(),
    body('entryFee', 'Enter valid entry fee (Numeric)').isNumeric(),
],
    validateValidationResult,
    fetchUser,
    createGame
);

// Route 2: To get all current games list: '/bzml/api/v1/games/game?gametype=<...>' [using GET] { gametype=current: (login not required) | (login access with more fields), gametype=previous: (login required) }
router.get('/game', fetchUser, getGames);

// export the router
module.exports = router;