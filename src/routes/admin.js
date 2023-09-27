// importing all requirements
const express = require('express');
const { createAdmin } = require('../controllers/admin');
const { validateRegField } = require('../middleware/validator/admin/validateAdminField');
const { validateValidationResult } = require('../middleware/validator/validationMiddleware');

// now creating router, to map all routes
const router = express.Router();

/* Creating routes for CRUD operations on Admins. */
// Route 1: To create an admin: '/bzml/api/v1/admin/create-admin' [using POST] (login not required)
router.post('/create-admin', validateRegField, validateValidationResult, createAdmin);

// Route 2: To get the admin details: '/bzml/api/v1/admin/' [using GETT] (login not required)
router.get('/', (req, res) => {
    console.log("OK! Default!");
    return res.send("OK! Default!");
});

// export the router
module.exports = router;