// importing requirements
const express = require('express');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { getUser } = require('../controllers/user');
const router = express.Router();

// Route 3: To get logged in user detail: '/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', fetchUser, getUser);

// export router
module.exports = router;