// importing all requirements
const User = require('../models/user/User');
const EmailVerification = require('../models/verfiy/VerifyEmail');
const { generateOtp } = require('../helper/utility/generate');
const { sendMail } = require('../helper/utility/sendMail');
const RecoverPassword = require('../models/verfiy/RecoverPass');
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

        if (!user.isEmailVerified){  // now, verify the user
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

// to generate email otp
const generateOtpEmail = async (req, res) => {
    try {
        // fetch the email from the body
        const email = req.body?.email?.toLowerCase();

        // find that the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found!" });

        // if user is verified
        if (user.isEmailVerified) return res.status(200).json({ status: 200, message: "User is already verified!" });

        // generate the OTP 
        const otp = generateOtp();

        // now, insure that the email in not in verification model
        let emailVerification = await EmailVerification.findOne({ email });
        if (emailVerification) {

            // email exists in the Email Verification model
            return res.status(400).json({ "status": 400, "message": "Email verification failed", "info": "try after 15 mins" });
        }

        // now save the otp in the verification model and send it to user
        EmailVerification.create({
            email: email,
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
                return res.status(200).json({ "status": 200, "message": "Email successfully sent", "info": "Verify Your Email Address" });
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

        if (userType === 'user'){

            // now find that the user exists
            let user = await User.findOne({ email });
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
        }
        else {  // query doesn't match or query is missing
            return res.status(404).json({ status: 404, message: "Query Parameter missing" });
        }

    } catch (err) {  // unreocgonized errors
        return res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
};

// export all functions
module.exports = { verifyEmail, generateOtpEmail, recoverUserPassword };