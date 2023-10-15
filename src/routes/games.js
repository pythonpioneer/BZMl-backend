// importing all requirements
const express = require('express');
const { createGame, getGames, deleteGame, updateGame } = require('../controllers/game');
const { fetchUser, fetchAnyUser } = require('../middleware/auth/authMiddleware');
const { validateGameFields, validateUpdationFields } = require('../middleware/validator/game/validateGameFields');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { validateMongoId } = require('../helper/utility/validateFields/mongoFields');

// now creating router, to map all routes
const router = express.Router();

// Route 1: To create a game (only admin to access): '/bzml/api/v1/games/create-game' [using POST] (login required)
router.post('/create-game', validateGameFields, validateValidationResult, fetchUser, createGame);

// Route 2: To get all current games list: '/bzml/api/v1/games/game?gametype=<...>' [using GET] { gametype=current: (login not required) | (login access with more fields), gametype=previous: (login required) }
router.get('/game', fetchAnyUser, getGames);

// Route 3: To delete the game (only admin to access): '/bzml/api/v1/games/delete-game?game-id=<...>' [using DELETE] (login required)
router.delete('/delete-game', [...validateMongoId(['game-id'])], fetchUser, deleteGame);

// Route 4: To update the game (only admin to access): '/bzml/api/v1/games/update-game?game-id=<...>' [using PUT] (login required)
router.put('/update-game', [
    ...validateUpdationFields,
    ...validateMongoId(['game-id']),
],  validateValidationResult, fetchUser, updateGame);

// export the router
module.exports = router;