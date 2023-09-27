// importing all requirements
const express = require('express');
const { createAdmin, loginAdmin } = require('../controllers/admin');
const { validateRegField } = require('../middleware/validator/admin/validateAdminField');
const { validateLoginField } = require('../middleware/validator/validateFormField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');

// now creating router, to map all routes
const router = express.Router();

/* Creating routes for CRUD operations on Admins. */
// Route 1: To create an admin: '/bzml/api/v1/admin/create-admin' [using POST] (login not required)
router.post('/create-admin', validateRegField, validateValidationResult, createAdmin);

// Route 2: To login admin: '/bzml/api/v1/admin/' [using POST] (login not required)
router.post('/', validateLoginField, validateValidationResult, loginAdmin);

// export the router
module.exports = router;