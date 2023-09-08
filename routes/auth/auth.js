// importing requirements
const express = require('express');
const router = express.Router();
const { validateUserField } = require('../../controllers/validator');
const { createUser } = require('../../controllers/user');


// Route 1: To create user: '/api/v1/auth/user' [using POST] (login not required)
router.post('/user', validateUserField, createUser);

module.exports = router;
