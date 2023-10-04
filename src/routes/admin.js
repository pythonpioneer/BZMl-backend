// importing all requirements
const express = require('express');
const { body } = require('express-validator');
const { createAdmin, loginAdmin, getAdminDetails, deleteAdmin, getAllUsers, getAllAdmins, deleteAnyUser, deleteAnyAdmin, getTheUser } = require('../controllers/admin');
const { validateRegField } = require('../middleware/validator/admin/validateAdminField');
const { validateLoginField } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');
const { fetchUser } = require('../middleware/auth/authMiddleware');

// now creating router, to map all routes
const router = express.Router();

/* Creating routes for CRUD operations on Admins. */
// Route 1: To create an admin: '/bzml/api/v1/admin/create-admin' [using POST] (login not required)
router.post('/create-admin', validateRegField, validateValidationResult, createAdmin);

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

// Route 9: To get the user by user id (only admin access): '/bzml/api/v1/admin/get-the-user' [using GET] (login required)
router.get('/get-the-user', [
    body('pubgID', 'Enter your PUBG/BGMI ID').isNumeric().isLength({ min: 9, max: 12 }),
],
    validateValidationResult,
    fetchUser,
    getTheUser
);

// export the router
module.exports = router;