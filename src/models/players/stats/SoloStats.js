// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const soloStatsSchema = new Schema({
    pubgID: {  // the game id entered by the user (used and forgein key)
        type: String,
        required: true,
        unique: true,
    },
    soloTotalMatch: {  // total matches played by player, in solo mode
        type: Number,
        default: 0,
        required: true,
    },
    soloTotalWins: {  // total matches won by player, in solo mode
        type: Number,
        default: 0,
        required: true,
    },
    soloTotalFinish: {  // total finishes by player
        type: Number,
        default: 0,
        required: true,
    },
    soloTopFive: {
        type: Number,
        default: 0,
        required: true,
    },
    soloMostFinish: {
        type: Number,
        default: 0,
        required: true,
    },
    maxPlayerAllowed: {  // total player allowed in a team
        type: Number,
        default: 1,
    }
});

// export the model
const SoloStats = mongoose.model('SoloStats', soloStatsSchema);
module.exports = SoloStats;