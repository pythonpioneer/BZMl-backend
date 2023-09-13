// importing requirements
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createUser, loginUser } = require('../../controllers/user');
const { validateRegistrationField }  = require('../../middleware/validator/registrationForm');


// Route 1: To create user: '/api/v1/auth/user' [using POST] (login not required)
router.post('/user', validateRegistrationField, createUser);

// Route 2: To login user: '/api/v1/auth/loginuser' [using POST] (login not required)
router.post('/loginuser', [
    body('userfield', 'enter valid mobileNumber/email/pubgID to login').isLength({min: 9, max: 50}),
    body('password', "Enter valid password").isAlphanumeric().isLength({min: 6, max: 18})
], loginUser);

module.exports = router;
