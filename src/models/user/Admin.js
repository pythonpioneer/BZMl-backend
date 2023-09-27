// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const adminSchema = new Schema({
    fullName: {
        type: String,
        required: true,
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
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    superUser: {
        type: Boolean,
        default: false,
        required: true,
    },
    country: {
        type: String,
        default: "India"
    },
    refCount: {
        type: Number,
        default: 0,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;