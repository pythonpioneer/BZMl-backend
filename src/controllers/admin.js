// importing all requirements
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { generateToken } = require('../middleware/auth/authMiddleware');
const { isNumber } = require('../helper/utility/fieldIdentifier');
const User = require('../models/user/User');
const Admin = require('../models/user/Admin');
const Player = require('../models/players/Player');
const RecoverPassword = require('../models/verfiy/RecoverPass');
const { notifyPasswordUpdation, otpEmailTemplate } = require('../helper/utility/emailTemplates/emailTemp');
const { sendMail } = require('../helper/utility/sendMail');
const { generateOtp } = require('../helper/utility/generate');

// to create admins
const createAdmin = async (req, res) => {

    // generate a secure password
    const securePassword = generatePassword(req.body.password);

    // confirm that the user is logged in as admin
    const loggedInAdmin = await Admin.findById(req.user.id);
    if (!loggedInAdmin) return res.status(401).json({ status: 401, message: "LogIn required!!", info: "Admin access only!!" });

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
        .then(admin => {  // sending response when admin created
            return res.status(201).json({ "status": 201, "message": "Admin Created", "admin": admin });  // admin will land at the profile page
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

        // if admin doesn't exist with the given user field
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
    try { 
        // find the admin by id
        const admin = await Admin.findById(req.user.id).select('-password');

        // if there is no admin
        if (!admin) return res.status(404).json({ status: 404, message: "Admin not found" });

        // if admin found
        return res.status(200).json({ status: 200, "message": "Admin Found", admin: admin });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to delete the admin
const deleteAdmin = async (req, res) => {
    try {  
        // find the admin and delete it
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ status: 404, message: "Admin Not Found" });

        // now match the password
        const password = req?.body?.password;
        if (!password) return res.status(404).json({ status: 404, message: "You need to send password." });
        if (!comparePassword(password, admin.password)) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now, delete the admin
        admin = await Admin.findByIdAndDelete(req.user.id);
        return res.status(200).json({ status: 200, message: 'Admin Deleted' });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to fetch all the user details (only admin can access)
const getAllUsers = async (req, res) => {

    try {  // check that the user exist
        if (!req?.user?.id) return res.status(401).json({ status: 401, message: "Access Denied!!" });
    
        // confirm that the user is admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, get all the users list
        let users = await User.find({}).select('-password');
        if (!users) return res.status(404).json({ status: 404, message: "user not found", data: users });

        // now, return all user data to the admin
        return res.status(200).json({ status: 200, message: "users found", totalResults: users.length, users: users })

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// get all admin informations
const getAllAdmins = async (req, res) => {
    try {
        // check that the admin is logged in
        if (!req?.user?.id) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // confirm that the user is admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, get all the admin list
        let admins = await Admin.find({}).select('-password');
        if (!admins) return res.status(404).json({ status: 404, message: "Admin not found" });

        // now, return all admin data to the admin
        return res.status(200).json({ status: 200, message: "Admin Found!", totalResults: admins.length, admins: admins })

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to delete any users
const deleteAnyUser = async (req, res) => {
    try {
        // fetch the user id from query params
        const userId = req.query['user-id'];

        // if the query param is missing
        if(!userId) return res.status(404).json({ status: 404, message: "Parameters missing" });

        // confirm that the given user exists
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: 404, message: "user not found" });

        // now, confirm the admin identity
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now match the password
        if (!comparePassword(req.body.password, admin.password)) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // delete the user
        user = await User.findByIdAndDelete(userId);
        return res.status(200).json({ status: 200, message: 'User Deleted', user: user });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to delete any admin
const deleteAnyAdmin = async (req, res) => {
    try {
        // fetch the id and the password from the query and body
        const adminId = req.query['admin-id'];
        const password = req?.body?.password;

        // validate the inputs
        if (!adminId && password) return res.status(404).json({ status: 404, message: "Parameters missing" });

        // confirm that the given admin exists
        let admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ status: 404, message: "admin not found" });

        // fetch the current admin details
        let currAdmin = await Admin.findById(req.user.id);

        // if current admin is not logged in as admin or doesn't exists
        if (!currAdmin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, compare the password of the admin and current admin
        if (!comparePassword(password, currAdmin.password)) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now confirm that the request is maid from the superuser
        if (!currAdmin.superUser) return res.status(403).json({ status: 403, message: "Access Denied!!", info: "Super User Access Only!!" });

        // now, delete the admin
        admin = await Admin.findByIdAndDelete(adminId);
        return res.status(200).json({ status: 200, message: 'Admin Deleted' });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to get the user details by their game-id
const getTheUser = async (req, res) => {
    try {
        // fetch the user id from the body
        const { pubgID } = req.body;

        // now confirm that the request is made by the admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now check that the user exist and fetch the user data without password
        let user = await User.findOne({ pubgID }).select('-password');
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now return the user info
        return res.status(200).json({ status: 200, message: "User found", user: user });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to get the player details by game-id
const getThePlayer = async (req, res) => {
    try {
        // fetch the user id from the body
        const { pubgID } = req.body;

        // now confirm that the request is made by the admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now check that the user exists
        let user = await User.findOne({ pubgID });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found", info: "User doesn't exist in User model" });

        // now, get the player exists
        let player = await Player.findOne({ pubgID });
        if (!player) return res.status(404).json({ status: 404, message: "Player Not Found", info: "Player doesn't exist in Player model" });

        // now, return the player
        return res.status(200).json({ status: 200, message: "Player Found!!", player: player });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to update the password of users
const updatePassword = async (req, res) => {
    try {  
        // fetch the passwords from the request body
        const { oldPassword, newPassword } = req.body;

        // confirms that the admin is validated
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ status: 404, message: "Admin Not Found" });

        // now, match the old password of the admin, if not same then send 
        if (!comparePassword(oldPassword, admin.password)) return res.status(401).json({ status: 401, message: "Invalid Credentials, Authentication Failed!!" });

        // now, check that the old and new passwords are not same
        if (oldPassword === newPassword) return res.status(400).json({ status: 400, message: "Old and new passwords must be different." });

        // generate password using bcrypt
        const securePassword = generatePassword(newPassword);

        // now, change the password
        admin.password = securePassword;
        admin.save();

        // // generate the notification template
        const notify = notifyPasswordUpdation(admin.fullName);

        // notify the admin that the password has been changed
        sendMail({
            to: admin.email,
            subject: "Password Changed Successfully",
            html: notify
        });

        // admin's password updated
        return res.status(200).json({ status: 200, message: "Password updated Successfully!" });
        
    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to recover the admin's password using otp
const recoverPassword = async (req, res) => {
    try {

        // fetch the email from the body
        const email = req.body.email.toLowerCase();

        // confirm that the email belongs to the admin
        let admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ status: 404, message: "Admin Not Found" });

        // now, send generate the otp
        const otp = generateOtp();

        // confirm that the user is not already otp generated
        let recoverAdmin = await RecoverPassword.findOne({ email });
        if (recoverAdmin) return res.status(400).json({ "status": 400, "message": "Recovery failed", "info": "try after 15 mins" });

        // now, save the otp in the recover model
        RecoverPassword.create({
            email: admin.email,
            otpEmail: otp
        })
            .then((recoverAdmin) => {  // otp saved into the model

                // now, generate the email
                let otpTemplate = otpEmailTemplate(admin.fullName, recoverAdmin.otpEmail, "Forgot Password Verification");

                // now, send the email
                sendMail({
                    to: admin.email,
                    subject: "BZML Forgot Password Verification",
                    html: otpTemplate,
                });

                // otp sent successfully
                return res.status(200).json({ status: 200, message: "OTP sent to your email", info: "verify your Email" });
            })
            .catch(err => res.status(500).json({  // failure in recover password model
                errors: "Email Failure!",
                issue: err
            }));

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// export all controller functions
module.exports = { createAdmin, loginAdmin, getAdminDetails, deleteAdmin, getAllUsers, getAllAdmins, deleteAnyUser, deleteAnyAdmin, getTheUser, getThePlayer, updatePassword, recoverPassword };