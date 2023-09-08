// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const userSchema = new Schema({
    pubgID: {
        type: String,
        required: true,
        unique: true,
    },
    pubgName: {
        type: String,
        required: true,
        unique: true,
    },
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
    refCode: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;