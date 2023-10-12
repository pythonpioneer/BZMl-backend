// importing all requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// now, create the game model
const recoverPasswordSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otpEmail: {
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
const RecoverPassword = mongoose.model('recover-password', recoverPasswordSchema);
module.exports = RecoverPassword;