// importing requirements
const express = require('express');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { getUserDetails, setUserDetails, deleteUserAccount, generateRef } = require('../controllers/user');
const { validateUpdationField, validateRefCode } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const router = express.Router();

// Route 3: To get logged in user detail: '/bzml/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', fetchUser, getUserDetails);

// Route 4: To update logged in user detail: '/bzml/api/v1/user/user' [using PUT] (login required)
router.put('/user', validateUpdationField, validateValidationResult, fetchUser, setUserDetails);

// Route 5: To delete a logged in user account: '/bzml/api/v1/user/delete-user' [using DELETE] (login required)
router.delete('/delete-user', fetchUser, deleteUserAccount);

// Route 6: To generate/update refCode of logged in user: '/bzml/api/v1/user/refcode' [using PUT] (login required)
router.put('/refcode', validateRefCode, validateValidationResult, fetchUser, generateRef);

// export router
module.exports = router;