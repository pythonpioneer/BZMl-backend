// importing all requirements
const express = require('express');
const { body } = require('express-validator');
const { createAdmin, loginAdmin, getAdminDetails, deleteAdmin, getAllUsers, getAllAdmins, deleteAnyUser, deleteAnyAdmin, getTheUser, getThePlayer, updatePassword, recoverPassword, verifyPlayer } = require('../controllers/admin');
const { validateRegField } = require('../middleware/validator/admin/validateAdminField');
const { validateLoginField } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { fetchUser } = require('../middleware/auth/authMiddleware');

// now creating router, to map all routes
const router = express.Router();

// validating the passwords
const _validatePassword = [
    body('oldPassword', 'Enter a valid password').isLength({ min: 6, max: 18 }),
    body('newPassword', 'Enter a valid password').isLength({ min: 6, max: 18 }),
];

// validating the email field
const _validateEmail = [
    body('email', 'Enter a valid Email').isEmail().isLength({ max: 50 }),
];

/* Creating routes for CRUD operations on Admins. */
// Route 1: To create an admin (admin access only): '/bzml/api/v1/admin/create-admin' [using POST] (login required)
router.post('/create-admin', validateRegField, validateValidationResult, fetchUser, createAdmin);

// Route 2: To login admin: '/bzml/api/v1/admin/' [using POST] (login not required)
router.post('/', validateLoginField, validateValidationResult, loginAdmin);

// Route 3: To get the admin details: '/bzml/api/v1/admin/' [using GET] (login required)
router.get('/', fetchUser, getAdminDetails);

// Route 4: To delete the logged in admin: '/bzml/api/v1/admin/delete-admin' [using DELETE] (login required)
router.delete('/delete-admin', [
    body('password', "Enter valid password")
        .isAlphanumeric()
        .isLength({ min: 6, max: 18 })
],
    validateValidationResult,
    fetchUser,
    deleteAdmin
);

// Route 5: To access all users information (only admin to access): '/bzml/api/v1/admin/get-all-users' [using GET] (login required)
router.get('/get-all-users', fetchUser, getAllUsers);

// Route 6: To access all admin information (only admin to access): '/bzml/api/v1/admin/get-all-admins' [using GET] (login required)
router.get('/get-all-admin', fetchUser, getAllAdmins);

// Route 7: To delete any user (only admin access): '/bzml/api/v1/admin/delete-the-user?user-id=<user id>' [using DELETE] (login required)
router.delete('/delete-the-user', [
    body('password', "Enter valid password")
        .isAlphanumeric()
        .isLength({ min: 6, max: 18 })
],
    validateValidationResult,
    fetchUser,
    deleteAnyUser
);

// Route 8: To delete any admin (only admin access): '/bzml/api/v1/admin/delete-the-admin?user-id=<user id>' [using DELETE] (login required)
router.delete('/delete-the-admin', [
    body('password', "Enter valid password")
        .isAlphanumeric()
        .isLength({ min: 6, max: 18 })
],
    validateValidationResult,
    fetchUser,
    deleteAnyAdmin
);

// Route 9: To get the user by user-id (only admin access): '/bzml/api/v1/admin/get-the-user' [using GET] (login required)
router.get('/get-the-user', [
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }),
],
    validateValidationResult,
    fetchUser,
    getTheUser
);

// Route 10: To get the player by user-id (only admin access): '/bzml/api/v1/admin/get-the-player' [using GET] (login required)
router.get('/get-the-player', [
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }),
],
    validateValidationResult,
    fetchUser,
    getThePlayer
);

// Route 11: To update the logged in admin's password (only admin access): '/bzml/api/v1/admin/update-password' [using PATCH] (login required)
router.patch('/update-password', _validatePassword, validateValidationResult, fetchUser, updatePassword);

// Route 12; To recover the admin's forgotten password (only admin access): '/bzml/api/v1/admin/recover-password' [using POST] (login not required)
router.post('/recover-password', _validateEmail, validateValidationResult, recoverPassword);

// Route 13: To verify status of the user and player (only admin access): '/bzml/api/v1/admin/verify-player' [using PATCH] (login required)
router.patch('/verify-player', [
    body('isUserVerified').optional().custom(flag => flag === true || flag === false).withMessage('Flag property only accepts boolean'),
    body('isGameVerified').optional().custom(flag => flag === true || flag === false).withMessage('Flag property only accepts boolean'),
],
    validateValidationResult,
    fetchUser,
    verifyPlayer
);

// export the router
module.exports = router;