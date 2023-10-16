// importing requirements
const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/user');

// to validate input fields
const { validateRegistrationField, validateLoginField }  = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');


// Route 1: To create user: '/bzml/api/v1/auth/user' [using POST] (login not required)
router.post('/user', validateRegistrationField, validateValidationResult, createUser);

// Route 2: To login user: '/bzml/api/v1/auth/loginuser' [using POST] (login not required)
router.post('/loginuser', validateLoginField, validateValidationResult, loginUser);

module.exports = router;
