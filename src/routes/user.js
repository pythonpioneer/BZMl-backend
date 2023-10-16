// importing requirements
const router = require('express').Router();
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { getUserDetails, setUserDetails, deleteUserAccount, generateRef, updatePassword, recoverPassword, getPlayerDetails } = require('../controllers/user');

// to validate input fields
const { validateUpdationField, validateRefCode, validatingPlayerStatsType } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { validatePassword } = require('../helper/utility/validateFields/passwordField');
const { validateEmail } = require('../helper/utility/validateFields/emailField');


// this is the route continution from "auth.js"
// Route 3: To get logged in user detail: '/bzml/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', fetchUser, getUserDetails);

// Route 4: To update logged in user detail: '/bzml/api/v1/user/user' [using PUT] (login required)
router.put('/user', validateUpdationField, validateValidationResult, fetchUser, setUserDetails);

// Route 5: To delete a logged in user account: '/bzml/api/v1/user/delete-user' [using DELETE] (login required)
router.delete('/delete-user', fetchUser, deleteUserAccount);

// Route 6: To generate/update refCode of logged in user: '/bzml/api/v1/user/refcode' [using PATCH] (login required)
router.patch('/refcode', validateRefCode, validateValidationResult, fetchUser, generateRef);

// Route 7: To update the logged in user's password: '/bzml/api/v1/user/update-password' [using PATCH] (login required)
router.patch('/update-password', validatePassword(['oldPassword', 'newPassword']), validateValidationResult, fetchUser, updatePassword);

// Route 8: To recover the user's forgotten password: '/bzml/api/v1/user/recover-password' [using POST] (login not required)
router.post('/recover-password', validateEmail(['email']), validateValidationResult, recoverPassword);

// Route 9: To get the player details: '/bzml/api/v1/user/getplayer?stats-type=<season | overall | solo | duo | squad>' [using GET] (login required)
router.get('/getplayer', validatingPlayerStatsType, validateValidationResult, fetchUser, getPlayerDetails);


// export router
module.exports = router;