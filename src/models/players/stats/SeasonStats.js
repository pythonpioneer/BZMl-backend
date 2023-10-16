// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const playerSeasonSchema = new Schema({
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
    totalRating: {  // total rating earned by player in a season of (90 to 100 matches)
        type: Number,
        default: 0,
        required: true,
    }
});

// exporting the player model
const PlayerSeason = mongoose.model('player-season-stats', playerSeasonSchema);
module.exports = PlayerSeason;