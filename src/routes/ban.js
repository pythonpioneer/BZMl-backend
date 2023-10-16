// importing requirements
const router = require('express').Router();
const { banPlayer, getBanPlayers, unbanPlayer, blockPlayer, getBlockPlayers, unblockPlayer } = require('../controllers/ban');
const { fetchUser } = require('../middleware/auth/authMiddleware');

// to validate input fields
const { validateBanFields } = require('../middleware/validator/ban/validateBanFields');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');


// Route 1: To ban a user (admin access only): '/bzml/api/v1/ban/ban-player' [using POST] (login required)
router.post('/ban-player', validateBanFields, validateValidationResult, fetchUser, banPlayer);

// Route 2: To get all ban user list (admin access only): '/bzml/api/v1/ban/get-ban-player' [using GET] (login required)
router.get('/get-ban-player', fetchUser, getBanPlayers);

// Route 3: To unban the user (admin access only): '/bzml/api/v1/ban/unban-player' [using DELETE] (login required)
router.delete('/unban-player', validateBanFields, validateValidationResult, fetchUser, unbanPlayer);

// Route 4: To block the player (admin access only): '/bzml/api/v1/ban/block-player' [using PATCH] (login required)
router.patch('/block-player', validateBanFields, validateValidationResult, fetchUser, blockPlayer);

// Route 5: To get all the block player list (admin access only): '/bzml/api/v1/ban/get-block-player' [using GET] (login required)
router.get('/get-block-player', fetchUser, getBlockPlayers);

// Route 3: To unblock the user (admin access only): '/bzml/api/v1/ban/unblock-player' [using PATCH] (login required)
router.patch('/unblock-player', validateBanFields, validateValidationResult, fetchUser, unblockPlayer);

// export the router
module.exports = router;