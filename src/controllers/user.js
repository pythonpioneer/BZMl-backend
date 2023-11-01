// importing db models
const User = require('../models/user/User');
const Ban = require('../models/players/Ban');
const Player = require('../models/players/Player');
const EmailVerification = require('../models/verfiy/VerifyEmail');
const RecoverPassword = require('../models/verfiy/RecoverPass');
const PlayerSeason = require('../models/players/stats/seasonStats');
const SoloStats = require('../models/players/stats/SoloStats');
const DuoStats = require('../models/players/stats/DuoStats');
const SquadStats = require('../models/players/stats/SquadStats');

// importing other requirements
const { sendMail } = require('../helper/utility/sendMail');
const { generateOtp } = require('../helper/utility/generate');
const { isNumber } = require('../helper/utility/fieldIdentifier');
const { generateToken } = require('../middleware/auth/authMiddleware');
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { otpEmailTemplate, notifyPasswordUpdation } = require('../helper/utility/emailTemplates/emailTemp');


// to create user
const createUser = async (req, res) => {

    // generate password using bcrypt
    const securePassword = generatePassword(req.body.password);
    let gender = req.body.gender;
    gender = gender.toUpperCase();

    // fields to update user data
    let cash = 0;

    // find that the user is trying to re-register or not
    let user = await Player.findOne({ pubgID: req.body.pubgID });
    if (!user) cash = 50;  // if user is registering for the first time.

    // create the user in db
    User.create({
        pubgID: req.body.pubgID,
        pubgName: req.body.pubgName,
        fullName: req.body.fullName,
        email: req.body.email.toLowerCase(),  // converting email into lowercase
        mobileNumber: req.body.mobileNumber,
        password: securePassword,
        gender: gender,
        myCash: cash,
        myRefCode: req.body.mobileNumber,
    })
        .then(async (user) => {  // sending response, when user is created

            // now, check that the player is known to us (verify the problem at issue #103)
            let newPlayer = await Player.findOne({ pubgID: req.body.pubgID });
            if (newPlayer) return res.status(201).json({ "status": 201, "message": "user created", "info": "Verify Your Email Address" });

            // find the ref-id
            if (req?.body?.refCode) {
                let refUser = await User.findOne({ myRefCode: req?.body?.refCode });

                // if user will be there then update
                if (refUser) {
                    // if reffered user exist then
                    refUser.myCash += 50;

                    // add the current user name in referred list
                    refUser.referredUsers.push(user._id);
                    await refUser.save();
                }
            }

            // now, create a player
            Player.create({
                pubgID: user.pubgID,
                pubgName: user.pubgName,
            })
                .then(async (player) => {

                    // also, create the season stats for the current season
                    await PlayerSeason.create({
                        pubgID: user.pubgID,
                        pubgName: user.pubgName,
                    });

                    // create the solo stats for the current season
                    await SoloStats.create({
                        pubgID: user.pubgID,
                    });

                    // create the duo stats for the current season
                    await DuoStats.create({
                        pubgID: user.pubgID,
                    });

                    // create the squad stats for the current season
                    await SquadStats.create({
                        pubgID: user.pubgID,
                    });

                    // generate otp 
                    const otp = generateOtp();

                    // now, insure that the email in not in verification
                    let emailVerification = await EmailVerification.findOne({ email: user.email });
                    if (emailVerification) {

                        // email verification failed because the email exists in the EmailVerification model
                        return res.status(400).json({ "status": 400, "message": "Email verification failed", "info": "try after 15 mins" });
                    }

                    // save otp and send it to user
                    EmailVerification.create({
                        email: user.email,
                        otpEmail: otp,
                    })
                        .then((verify) => {

                            let otpTemplate = otpEmailTemplate(user.fullName, otp, "Email Verification");

                            // now send the email to the user
                            sendMail({
                                to: verify.email,
                                subject: "BZML Email Verification",
                                html: otpTemplate
                            });

                            // email sent successfully, user created
                            return res.status(201).json({ "status": 201, "message": "user created", "info": "Verify Your Email Address" });
                        })
                        .catch(err => res.status(500).json({  // failure in email verification model
                            errors: "Email Failure!",
                            issue: err
                        }));

                })
                .catch(err => res.status(500).json({  // error while creating player
                    errors: "Player Registration failed",
                    issue: err
                }));
        })

        .catch(err => res.status(500).json({  // error while creating user
            errors: "User Registration Failed",
            issue: err
        }));
};

// to login an existing user
const loginUser = async (req, res) => {

    try {  // now confirm authentication

        let user;
        const { userfield, password } = req.body;  // fetching values from request body

        /* find the user with given email/id/no. and validate, if user exists 
        now, find the type of user field */
        if (isNumber(userfield))
            user = await User.findOne({ mobileNumber: userfield });  // login with mobile no.
        else user = await User.findOne({ email: userfield });  // login with email

        // if user is not there
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!!" });

        // check that the user is ban or not
        let banUser = await Ban.findOne({ pubgID: user.pubgID });
        if (banUser) return res.status(403).json({ status: 403, message: "You are banned, can't login!!" });  // access forbidden, it's a user but don't have access to login

        // if user doesn't exist or wrong input fields
        if (!user) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now, compare the password using bcrypt.js
        const isPasswordMatches = comparePassword(password, user.password);
        if (!isPasswordMatches) return res.status(400).json({ status: 400, message: "Invalid Credentials" });  // password not matched

        // if password matched, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // generate auth-token send it
        const authToken = generateToken(payloadData);
        return res.status(200).json({ status: 200, "message": "user Logged In", "auth-token": authToken });

    } catch (err) {
        return res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err
        });
    }
};

// to get the user details using user id
const getUserDetails = async (req, res) => {

    try {  // find user by id
        const user = await User.findById(req.user.id)
            .select('-password');  // not fetch password from db

        // if user is not in db
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // else return the user
        return res.status(200).json({ status: 200, message: "User Found", user: user });
    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
}

// to set user details or update
const setUserDetails = async (req, res) => {

    try {
        // fetch all variables from bod
        const { pubgName, fullName, email, mobileNumber, gender } = req.body;
        let toBeUpdated = false;

        // create a new user object, updating timestamp field
        const updatedUser = { timestamp: Date.now() };

        // now, fill all the updated details in the new user object
        if (pubgName) {
            toBeUpdated = true;
            updatedUser.isGameVerified = false;
            updatedUser.pubgName = pubgName;
        }
        if (fullName) {
            toBeUpdated = true;
            updatedUser.fullName = fullName;
        }
        if (email) {
            toBeUpdated = true;
            updatedUser.isEmailVerified = false;
            updatedUser.email = email;
        }
        if (mobileNumber) {
            toBeUpdated = true;
            updatedUser.isMobileVerified = false;
            updatedUser.mobileNumber = mobileNumber;
        }
        if (gender) {
            toBeUpdated = true;
            updatedUser.gender = gender;
        }

        if (toBeUpdated) {
            // chnaged the verification status of the user
            updatedUser.isVerified = false;

            // now find the user that to be updated and confirm that the user exists
            let user = await User.findById(req.user.id);
            if (!user) res.status(404).json({ status: 404, message: "User Not Found" });

            // now update the user and send the response
            user = await User.findByIdAndUpdate(req.user.id, { $set: updatedUser }, { new: true });
            return res.status(200).json({ status: 200, message: 'user updated', user: user });
        }
        // this will not send any json as response because status: 204
        else return res.status(204).json({ status: 204, message: "Nothing is there to be updated" });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }

};

// to delete the user account
const deleteUserAccount = async (req, res) => {

    try {  // find the user that to be deleted
        // and confirms the user identity
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now, delete the user
        user = await User.findByIdAndDelete(req.user.id);
        return res.status(200).json({ status: 200, message: 'user deleted', user: user });

    } catch (err) {
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to generate or update the referral code
const generateRef = async (req, res) => {
    try {
        // fetch the referral code from the body
        const { myRefCode } = req.body;

        // now confirm that the user is logged in and exists
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now update the refCode
        user = await User.findByIdAndUpdate(req.user.id, { $set: { myRefCode } }, { new: true });
        return res.status(200).json({ status: 200, message: "Referral code updated", user: user });

    } catch (err) {
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// to update the password of users
const updatePassword = async (req, res) => {
    try {
        // fetch the passwords from the request body
        const { oldPassword, newPassword } = req.body;

        // confirms that the user is validated
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now, match the old password of the user, if not same then send 
        if (!comparePassword(oldPassword, user.password)) return res.status(401).json({ status: 401, message: "Invalid Credentials, Authentication Failed!!" });

        // now, check that the old and new passwords are not same
        if (oldPassword === newPassword) return res.status(400).json({ status: 400, message: "Old and new passwords must be different." });

        // generate password using bcrypt
        const securePassword = generatePassword(newPassword);

        // now, change the password
        user.password = securePassword;
        user.save();

        // generate the notification template
        const notify = notifyPasswordUpdation(user.fullName, "Password Changed Successfully");

        // now send the email to the user
        sendMail({
            to: user.email,
            subject: "BZML Password Changed Successfully",
            html: notify
        });

        // user's password updated
        return res.status(200).json({ status: 200, message: "Password updated Successfully!" });

    } catch (err) {
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// to recover the user's password
const recoverPassword = async (req, res) => {
    try {
        // fetch the email from the body
        const email = req.body.email.toLowerCase();

        // now, check that the user exists
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 404, message: "User not Found!!" });

        // now, send generate the otp
        const otp = generateOtp();

        // confirm that the user is not already otp generated
        let recoverUser = await RecoverPassword.findOne({ email });
        if (recoverUser) return res.status(400).json({ "status": 400, "message": "Recovery failed", "info": "try after 15 mins" });

        // now, save the otp into the model to recover
        RecoverPassword.create({
            email: user.email,
            otpEmail: otp
        })
            .then((recoverUser) => {  // otp is now saved in the model

                // now, generate the email
                let otpTemplate = otpEmailTemplate(user.fullName, recoverUser.otpEmail, "Forgot Password Verification");

                // now, send the otp to the user
                sendMail({
                    to: user.email,
                    subject: "BZML Forgot Password Verification",
                    html: otpTemplate
                });

                // otp sent successfully
                return res.status(200).json({ status: 200, message: "OTP sent to your email", info: "verify your Email" });
            })
            .catch(err => res.status(500).json({  // failure in recover password model
                errors: "Email Failure!",
                issue: err
            }));

    } catch (err) {  // any unrecogonize error will be raised from here
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// to get the player details
const getPlayerDetails = async (req, res) => {
    try {
        // fetch the query param
        const statsType = req.query['stats-type'];

        // find the user 
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User not Found!!" });

        let player;

        // fetch the overall stats
        if (statsType === 'overall') {

            // now, find the player data
            player = await Player.find({ pubgID: user.pubgID });
            if (!player) return res.status(404).json({ status: 404, message: "Player not Found!!" });

            // send the player data
            return res.status(200).json({ status: 200, message: "Overall Player Stats!", player: player });
        }
        else if (statsType === 'season') {  // fetch the current season stats

            // now, find the season player stats
            player = await PlayerSeason.find({ pubgID: user.pubgID });
            if (!player) return res.status(404).json({ status: 404, message: "Player not Found!!" });

            // send the player data
            return res.status(200).json({ status: 200, message: "Season Player Stats!", player: player });
        }
        else if (statsType === 'solo') {  // fetch the current season solo stats

            // now, find the season player stats
            player = await SoloStats.find({ pubgID: user.pubgID });
            if (!player) return res.status(404).json({ status: 404, message: "Player not Found!!" });

            // send the player data
            return res.status(200).json({ status: 200, message: "Solo Player Stats!", player: player });
        }
        else if (statsType === 'duo') {  // fetch the current season duo stats

            // now, find the season player stats
            player = await DuoStats.find({ pubgID: user.pubgID });
            if (!player) return res.status(404).json({ status: 404, message: "Player not Found!!" });

            // send the player data
            return res.status(200).json({ status: 200, message: "Duo Player Stats!", player: player });
        }
        else if (statsType === 'squad') {  // fetch the current season squad stats

            // now, find the season player stats
            player = await SquadStats.find({ pubgID: user.pubgID });
            if (!player) return res.status(404).json({ status: 404, message: "Player not Found!!" });

            // send the player data
            return res.status(200).json({ status: 200, message: "Squad Player Stats!", player: player });
        }
        else {  // if the stat-type is not valid (already validated by validation middlwares)
            return res.status(404).json({ status: 404, message: "Invalid query!!" });
        }

    } catch (err) {  // any unrecogonize error will be raised from here
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

module.exports = { createUser, loginUser, getUserDetails, setUserDetails, deleteUserAccount, generateRef, updatePassword, recoverPassword, getPlayerDetails };