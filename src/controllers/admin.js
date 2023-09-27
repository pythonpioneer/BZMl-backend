// importing all requirements
const Admin = require('../models/user/Admin');
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { generateToken } = require('../middleware/auth/authMiddleware');
const { isNumber } = require('../helper/utility/fieldIdentifier');

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
            return res.status(200).json({ "status": 200, "message": "Admin Created", "admin": user });
        })
        .catch(err => {
            return res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err,
            })
        });
};

// to login admin
const loginAdmin = async (req, res) => {
    try {  // now confirm authentication
        
        // fetching values from request body
        const { userfield, password } = req.body;
        let admin;

        // now find the type of userfield (email, mobile number)
        if (isNumber(userfield))
            admin = await Admin.findOne({ mobileNumber: userfield });
        else admin = await Admin.findOne({ email: userfield });

        // if user doesn't exist with the given user field
        if (!admin) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now, compare the password
        if (!comparePassword(password, admin.password)) return res.status(400).json({ status: 400, message: "Invalid Credentials" });  // password not matched

        // if password matched, then return the user id
        const payload = {
            user: {
                id: admin.id
            },
        };

        // now, generate the token and send it
        const authToken = generateToken(payload);
        return res.status(200).json({ status: 200, message: "Admin Logged In", 'auth-token': authToken })

    } catch( err) {
        return res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err
        })
    }
};

// export all controller functions
module.exports = { createAdmin, loginAdmin };