// importing requirements
const express = require('express');
const { body } = require('express-validator');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { getUserDetails, setUserDetails, deleteUserAccount, generateRef, updatePassword } = require('../controllers/user');
const { validateUpdationField, validateRefCode } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const router = express.Router();

// validating the passwords
const _validatePassword = [
    body('oldPassword', 'Enter a valid password').isLength({ min: 6, max: 18 }),
    body('newPassword', 'Enter a valid password').isLength({ min: 6, max: 18 }),
];

// Route 3: To get logged in user detail: '/bzml/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', fetchUser, getUserDetails);

// Route 4: To update logged in user detail: '/bzml/api/v1/user/user' [using PUT] (login required)
router.put('/user', validateUpdationField, validateValidationResult, fetchUser, setUserDetails);

// Route 5: To delete a logged in user account: '/bzml/api/v1/user/delete-user' [using DELETE] (login required)
router.delete('/delete-user', fetchUser, deleteUserAccount);

// Route 6: To generate/update refCode of logged in user: '/bzml/api/v1/user/refcode' [using PATCH] (login required)
router.patch('/refcode', validateRefCode, validateValidationResult, fetchUser, generateRef);

// Route 7: To update the logged in user's password: '/bzml/api/v1/user/update-password' [using PATCH] (login required)
router.patch('/update-password', _validatePassword, validateValidationResult, fetchUser, updatePassword);

// export router
module.exports = router;