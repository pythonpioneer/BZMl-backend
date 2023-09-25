// importing all requirements
const Admin = require('../models/user/Admin');
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { generateToken } = require('../middleware/auth/authMiddleware');

// to create admins
const createAdmin = async (req, res) => {

    // generate a secure password
    const securePassword = generatePassword(req.body.password);

    // fetch the gender and convert it to single uppercase letter.
    let gender = req.body.gender[0];
    gender = gender.toUpperCase();

    // now, create the admin
    Admin.create({
        fullName: req.body.fullName,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        password: securePassword,
        gender: gender,

    })
        .then(user => {  // sending response when admin created
            return res.status(200).json({ "status": 200, "message": "user created", "admin": user });
        })
        .catch(err => {
            return res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err,
            })
        });
};

// export all controller functions
module.exports = { createAdmin };