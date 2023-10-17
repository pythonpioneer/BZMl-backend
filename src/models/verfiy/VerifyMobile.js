// importing all requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// now, create the game model
const mobileVerificationSchema = new Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
    otpMobile: {
        type: String,
        default: '',
        required: true,
    },
    timeStamp: {  // delete this record after 15 mins
        type: Date,
        expires: 900,  
        default: Date.now,
    }
});

// export the model
const MobileVerification = mongoose.model('mobile-verification', mobileVerificationSchema);
module.exports = MobileVerification;