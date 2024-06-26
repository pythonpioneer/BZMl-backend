// importing db models
const User = require('../models/user/User');
const Admin = require('../models/user/Admin');
const EmailVerification = require('../models/verfiy/VerifyEmail');
const MobileVerification = require('../models/verfiy/VerifyMobile');
const RecoverPassword = require('../models/verfiy/RecoverPass');

// importing other requirements
const Twilio = require('twilio');
const dotenv = require('dotenv').config();
const { generateOtp } = require('../helper/utility/generate');
const { sendMail } = require('../helper/utility/sendMail');
const { generatePassword } = require('../middleware/auth/passwordMiddleware');
const { otpEmailTemplate } = require('../helper/utility/emailTemplates/emailTemp');
const { notifyPasswordUpdation } = require('../helper/utility/emailTemplates/emailTemp');


// to verify email address
const verifyEmail = async (req, res) => {
    try {
        // fetch the data from the body
        let { email, otp } = req.body;

        // converting email into lowercase
        email = email.toLowerCase();

        // now, find that the email exists as user
        let user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // now, confirm that the user requested for OTP
        let pin = await EmailVerification.findOne({ email });
        if (!pin) return res.status(400).json({ status: 400, message: "You need to Generate OTP" });

        // if OTP is generated then match the OTP
        if (otp !== pin.otpEmail) return res.status(400).json({ status: 400, message: "Invalid OTP" });

        if (!user.isEmailVerified) {  // now, verify the user
            user.isEmailVerified = true;
            user.save();

            // user verified successfully
            return res.status(200).json({ status: 200, message: "User Verified!!" });
        }
        else {  // user is already verified
            return res.status(200).json({ status: 200, message: "User is already Verified!!" });
        }

    } catch (err) {  // any unrecogonize error will be raised from here
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            issue: err
        });
    }
};

// to generate otp for email verification
const generateEmailOtp = async (req, res) => {
    try {

        // find that the user exists
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // if user is verified
        if (user.isEmailVerified) return res.status(200).json({ status: 200, message: "User is already verified!" });

        // generate the OTP 
        const otp = generateOtp();

        // now, insure that the email in not in verification model
        let emailVerification = await EmailVerification.findOne({ email: user.email });
        if (emailVerification) {

            // email exists in the Email Verification model
            return res.status(400).json({ "status": 400, "message": "Email verification failed", "info": "try after 15 mins" });
        }

        // now save the otp in the verification model and send it to user
        EmailVerification.create({
            email: user.email,
            otpEmail: otp,
        })
            .then((verify) => {
                const otpTemplate = otpEmailTemplate(user.fullName, otp, "Email Verification");  // a tempate to send email to the user with otp

                // now, send the email to the user
                sendMail({
                    to: verify.email,
                    subject: "BZML Email Verification",
                    html: otpTemplate
                });

                // verification email successfully sent
                return res.status(201).json({ "status": 201, "message": "Email successfully sent", "info": "Verify Your Email Address" });
            })
            .catch(err => res.status(500).json({  // failure in Email verification model
                errors: "Email Failure!",
                issue: err
            }));

    } catch (err) {  // unreocgonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to recover the user password (forgot password)
const recoverUserPassword = async (req, res) => {
    try {
        // fetch the query params
        const userType = req.query['user'];

        // fetch the data from the body
        let { otp, password } = req.body;
        const email = req.body.email.toLowerCase();
        let user;

        if (userType === 'user') {  // if user is hitting the forgot password api

            // now find that the user exists
            user = await User.findOne({ email });
        }
        else if (userType === 'admin') {  // if admin is hitting the forgot password api

            // now find that the admin exists
            user = await Admin.findOne({ email });
        }
        else {  // query doesn't match or query is missing
            return res.status(404).json({ status: 404, message: "Query Parameter missing" });
        }

        // if there is no user or admin
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // confirm that the user has generated the otp
        let pin = await RecoverPassword.findOne({ email });
        if (!pin) return res.status(400).json({ status: 400, message: "You need to Generate OTP" });

        // if otp is cleared after password updation
        if (pin.otpEmail.length < 6) return res.status(400).json({ status: 400, message: "You need to Generate OTP" });

        // if OTP is generated then match the OTP
        if (otp !== pin.otpEmail) return res.status(400).json({ status: 400, message: "Invalid OTP" });

        // generate password using bcrypt
        const securePassword = generatePassword(password);

        // now, change the password
        user.password = securePassword;
        user.save();

        // now, delete the record from the db
        await RecoverPassword.findByIdAndDelete(pin._id);

        // generate the template to notify the user
        let emailTemp = notifyPasswordUpdation(user.fullName, "Password generated successfully");

        // notify the user that password has been changed
        sendMail({
            to: user.email,
            subject: "BZML Password generated successfully",
            html: emailTemp
        });

        // password updated successfully
        return res.status(200).json({ status: 200, message: "Password updated succesfully!!" });

    } catch (err) {  // unreocgonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to generate the otp for mobile verification
const generateMobileOtp = async (req, res) => {
    try {
        // verify that the user exists
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // if user's mobile number is verified
        if (user.isMobileVerified) return res.status(200).json({ status: 200, message: "User is already verified!" });

        // generate the OTP 
        const otp = generateOtp();

        // now, check that the user is not generated otp yet
        let mobile = await MobileVerification.findOne({ mobileNumber: user.mobileNumber });
        if (mobile) {

            // email exists in the Email Verification model
            return res.status(400).json({ "status": 400, "message": "Mobile verification failed", "info": "try after 15 mins" });
        }

        // now save the otp in the verificaiton model
        MobileVerification.create({
            mobileNumber: user.mobileNumber,
            otpMobile: otp,
        })
            .then((verify) => {  // otp is now saved in the db

                // creating twilio object
                const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

                // now, sending message to the client
                client.messages
                    .create({
                        body: `Hello ${user.fullName}, ${verify.otpMobile} is your verification OTP to verify your bzml registerd Mobile Number. Thank you!`,
                        to: '+91' + user.mobileNumber, // Text your number
                        from: process.env.TWILIO_MOBILE_NUMBER, // From a valid Twilio number
                    })
                    .then(msg => {  // successfully otp sent to the registered mobile number
                        return res.status(201).json({ "status": 201, "message": "SMS successfully sent!!", "info": "Verify Your Mobile Number" });
                    })
                    .catch(err => {  // Twilio service failed
                        return res.status(500).json({ status: 500, message: "SMS Failure!!" });
                    });
            })
            .catch(err => {
                return res.status(500).json({ status: 500, message: "Problem with Mobile verifcation model!" });
            });

    } catch (err) {  // unreocgonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// to verify the user mobile number using otp
const verifyMobile = async (req, res) => {
    try {
        // fetch the body and otp from the body
        const { mobileNumber, otp } = req.body;

        // now, find that the mobile number exists as user
        let user = await User.findOne({ mobileNumber });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // now, confirm that the user requested for OTP
        let mobile = await MobileVerification.findOne({ mobileNumber });
        if (!mobile) return res.status(400).json({ status: 400, message: "You need to Generate OTP" });

        // match the otp
        if (otp != mobile.otpMobile) return res.status(400).json({ status: 400, message: "Invalid OTP" });

        // now, confirm that the user is verified or not
        if (!user.isMobileVerified) {  // now, verify the user
            user.isMobileVerified = true;
            user.save();

            // user verified successfully
            return res.status(200).json({ status: 200, message: "User Verified!!" });
        }
        else {  // user is already verified
            return res.status(200).json({ status: 200, message: "User is already Verified!!" });
        }
        
    } catch (err) {  // unreocgonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// export all functions
module.exports = { verifyEmail, generateEmailOtp, recoverUserPassword, generateMobileOtp, verifyMobile };
