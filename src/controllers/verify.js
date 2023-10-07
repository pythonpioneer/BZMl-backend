// importing all requirements
const User = require('../models/user/User');
const EmailVerification = require('../models/verfiy/VerifyEmail');


// to verify email address
const verifyEmail = async (req, res) => {
    try {
        // fetch the data from the body
        const { email, otp } = req.body;

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

// export all functions
module.exports = { verifyEmail };