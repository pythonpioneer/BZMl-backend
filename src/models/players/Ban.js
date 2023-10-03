// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const banSchema = new Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    pubgID: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    },
});

// exporting the ban model
const Ban = mongoose.model('ban', banSchema);
module.exports = Ban;