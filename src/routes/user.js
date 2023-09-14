// importing requirements
const express = require('express');
const { fetchUser } = require('../middleware/auth/authMiddleware');
const { getUserDetails } = require('../controllers/user');
const router = express.Router();

// Route 3: To get logged in user detail: '/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', fetchUser, getUserDetails);

// Route 4: To update logged in user detail: '/api/v1/user/user-id=1thisisdemoid' [using PUT] (login required)
router.put('/user-id:id', fetchUser, (req, res) => {
    res.send("OK");
    console.log(req.user);
});

// export router
module.exports = router;