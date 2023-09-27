// importing all requirements
const Admin = require('../models/user/Admin');
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { generateToken } = require('../middleware/auth/authMiddleware');
const { isNumber } = require('../helper/utility/fieldIdentifier');
const User = require('../models/user/User');

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

    } catch (err) {
        return res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err
        })
    }
};

// to fetch the admin details
const getAdminDetails = async (req, res) => {
    try {  // find the admin by id

        const admin = await Admin.findById(req.user.id).select('-password');
        return res.status(200).json({ "status": 200, "message": "Admin Found", "data": admin });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to delete the admin
const deleteAdmin = async (req, res) => {

    try {  // find the admin and delete it
        let admin = await Admin.findById(req.user.id);
        console.log(admin);
        if (!admin) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now match the password
        const password = req?.body?.password;
        if (!comparePassword(password, admin.password)) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now, delete the user
        admin = await Admin.findByIdAndDelete(req.user.id);
        return res.status(200).json({ status: 200, message: 'Admin Deleted', user: admin });

    } catch (err) {
        return res.status(500).json({ errors: "Internal server error", message: "You need to send Password in request body", issue: err });
    }
};

// to fetch all the user details (only admin can access)
const getAllUsers = async (req, res) => {

    try {
        // confirm that the user is admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, get all the users list
        let users = await User.find({}).select('-password');
        if (!users) return res.status(400).json({ status: 400, message: "user not found", data: users });

        // now, return all user data to the admin
        return res.status(200).json({ status: 200, message: "users found", data: users })

    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// get all admin informations
const getAllAdmins = async (req, res) => {
    try {
        // confirm that the user is admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, get all the admin list
        let admins = await Admin.find({}).select('-password');
        if (!admins) return res.status(404).json({ status: 400, message: "user not found", data: admins });

        // now, return all admin data to the admin
        return res.status(200).json({ status: 200, message: "users found", data: admins })

    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// to delete any users
const deleteAnyUser = async (req, res) => {
    try { 

        const userId = req.query['user-id'];

        // confirm that the given user exists
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: 404, message: "user not found"});

        // now, confirm the admin identity
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now match the password
        if (!comparePassword(req.body.password, admin.password)) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // delete the user
        user = await User.findByIdAndDelete(userId);
        return res.status(200).json({ status: 200, message: 'User Deleted', user: user });

    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// export all controller functions
module.exports = { createAdmin, loginAdmin, getAdminDetails, deleteAdmin, getAllUsers, getAllAdmins, deleteAnyUser };