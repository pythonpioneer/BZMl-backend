// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const playerSchema = new Schema({
    pubgID: {  // the game id entered by the user
        type: String,
        required: true,
        unique: true,
    },
    pubgName: {  // the game name entered by the user
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {  // The game id and the game name entered by user is verified or not (manual visiting by admins)
        type: Boolean,
        default: false,
        required: true,
    },
    isBan: {  // permanent ban, if any player try to hack the game in the match, then we will ban the user and player
        type: Boolean,
        default: false,
        required: true,
    },
    isBlocked: {  // temporary ban, we will block all teammates of the hacker team, who were not cheating or hacking
        type: Boolean,
        default: false,
        required: true,
    },
    totalMatch: {  // total matches played by player, in all mode
        type: Number,
        default: 0,
        required: true,
    },
    totalWins: {  // total matches won by player, in all mode
        type: Number,
        default: 0,
        required: true,
    },
    totalFinish: {  // total finishes by player, in all mode
        type: Number,
        default: 0,
        required: true,
    },
    totalMostFinish: {  // max finish by player, in one game, any mdoe
        type: Number,
        default: 0,
        required: true,
    },
    totalRating: {  // total rating earneb by player
        type: Number,
        default: 0,
        required: true,
    }
});

// exporting the player model
const Player = mongoose.model('player', playerSchema);
module.exports = Player;