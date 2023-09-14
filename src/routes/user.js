// importing requirements
const express = require('express');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { getUserDetails, setUserDetails } = require('../controllers/user');
const { validateRegistrationField, validateUpdationField } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const router = express.Router();

// Route 3: To get logged in user detail: '/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', fetchUser, getUserDetails);

// Route 4: To update logged in user detail: '/api/v1/user/user-id=1thisisdemoid' [using PUT] (login required)
router.put('/user', validateUpdationField, validateValidationResult, fetchUser, setUserDetails);

// export router
module.exports = router;