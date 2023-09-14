// importing requirements
const express = require('express');
const router = express.Router();

// Route 3: To get logged in user detail: '/api/v1/user/getuser' [using GET] (login required)
router.get('/getuser', (req, res) => {
    res.send("working")
});


// export router
module.exports = router;