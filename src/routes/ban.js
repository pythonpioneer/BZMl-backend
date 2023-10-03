// importing requirements
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { banPlayer } = require('../controllers/ban');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');

// Route 1: To ban a user (admin access only): '/bzml/api/v1/ban/ban-player' [using POST] (login required)
router.post('/ban-player', [
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }),
    body('password', "Enter a valid password (admin)").isAlphanumeric().isLength({ min: 6, max: 18 })
],
    validateValidationResult,
    fetchUser,
    banPlayer
);

// export the router
module.exports = router;