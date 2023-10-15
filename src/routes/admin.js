// importing all requirements
const express = require('express');
const { body } = require('express-validator');
const { createAdmin, loginAdmin, getAdminDetails, deleteAdmin, getAllUsers, getAllAdmins, deleteAnyUser, deleteAnyAdmin, getTheUser, getThePlayer, updatePassword, recoverPassword, verifyPlayer } = require('../controllers/admin');
const { validateRegField } = require('../middleware/validator/admin/validateAdminField');
const { validateLoginField } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { validatePassword } = require('../helper/utility/validateFields/passwordField');
const { validateEmail } = require('../helper/utility/validateFields/emailField');
const { validateGameId } = require('../helper/utility/validateFields/gameIdField');
const { validateBooleanOnly } = require('../helper/utility/validateFields/booleanOnlyField');
const { validateMongoId } = require('../helper/utility/validateFields/mongoFields');
const router = express.Router();


/* Creating routes for CRUD operations on Admins. */
// Route 1: To create an admin (admin access only): '/bzml/api/v1/admin/create-admin' [using POST] (login required)
router.post('/create-admin', validateRegField, validateValidationResult, fetchUser, createAdmin);

// Route 2: To login admin: '/bzml/api/v1/admin/' [using POST] (login not required)
router.post('/', validateLoginField, validateValidationResult, loginAdmin);

// Route 3: To get the admin details: '/bzml/api/v1/admin/' [using GET] (login required)
router.get('/', fetchUser, getAdminDetails);

// Route 4: To delete the logged in admin: '/bzml/api/v1/admin/delete-admin' [using DELETE] (login required)
router.delete('/delete-admin', validatePassword(['password']), validateValidationResult, fetchUser, deleteAdmin);

// Route 5: To access all users information (only admin to access): '/bzml/api/v1/admin/get-all-users' [using GET] (login required)
router.get('/get-all-users', fetchUser, getAllUsers);

// Route 6: To access all admin information (only admin to access): '/bzml/api/v1/admin/get-all-admins' [using GET] (login required)
router.get('/get-all-admin', fetchUser, getAllAdmins);

// Route 7: To delete any user (only admin access): '/bzml/api/v1/admin/delete-the-user?user-id=<user id>' [using DELETE] (login required)
router.delete('/delete-the-user', [
    ...validatePassword(['password']), // body
    ...validateMongoId(['user-id']),  // query
], validateValidationResult, fetchUser, deleteAnyUser);

// Route 8: To delete any admin (only admin access): '/bzml/api/v1/admin/delete-the-admin?user-id=<user id>' [using DELETE] (login required)
router.delete('/delete-the-admin', [
    ...validatePassword(['password']),  // body
    ...validateMongoId(['admin-id']),  // query
], validateValidationResult, fetchUser, deleteAnyAdmin);

// Route 9: To get the user by user-id (only admin access): '/bzml/api/v1/admin/get-the-user' [using GET] (login required)
router.get('/get-the-user', validateGameId(['pubgID'], false), validateValidationResult, fetchUser, getTheUser);

// Route 10: To get the player by user-id (only admin access): '/bzml/api/v1/admin/get-the-player' [using GET] (login required)
router.get('/get-the-player', validateGameId(['pubgID'], false), validateValidationResult, fetchUser, getThePlayer);

// Route 11: To update the logged in admin's password (only admin access): '/bzml/api/v1/admin/update-password' [using PATCH] (login required)
router.patch('/update-password', validatePassword(['oldPassword', 'newPassword']), validateValidationResult, fetchUser, updatePassword);

// Route 12; To recover the admin's forgotten password (only admin access): '/bzml/api/v1/admin/recover-password' [using POST] (login not required)
router.post('/recover-password', validateEmail(['email']), validateValidationResult, recoverPassword);

// Route 13: To verify status of the user and player (only admin access): '/bzml/api/v1/admin/verify-player' [using PATCH] (login required)
router.patch('/verify-player', [
    ...validateBooleanOnly(['isUserVerified', 'isGameVerified'], true),  // body
    ...validateMongoId(['user-id']),  // query
],  validateValidationResult, fetchUser, verifyPlayer);

// export the router
module.exports = router;