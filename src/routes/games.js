// importing all requirements
const express = require('express');
const { body } = require('express-validator');

// now creating router, to map all routes
const router = express.Router();

// Route 1: To create a game (only admin to access): '/bzml/api/v1/games/create-game' [using POST] (login not required)
router.post('/create-game', [
    body('gamingPlatform', 'Enter a valid platform (bgmi | pubg)'),
    body('gamingMode', 'Enter a valid mode (solo | duo | squad)'),
    body('prizePool', 'Enter valid prize pool (Numeric)'),
    body('entryFee', 'Enter valid entry fee (Numeric)'),
],
    (req, res) => {
        res.send("ok!");
    }
);

// export the router
module.exports = router;