// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const duoStatsSchema = new Schema({
    pubgID: {  // the game id entered by the user (used and forgein key)
        type: String,
        required: true,
        unique: true,
    },
    duoTotalMatch: {  // total matches played by player
        type: Number,
        default: 0,
        required: true,
    },
    duoTotalWins: {  // total matches won by player
        type: Number,
        default: 0,
        required: true,
    },
    duoTotalFinish: {  // total finishes by player, in all mode
        type: Number,
        default: 0,
        required: true,
    },
    duoTopThree: {
        type: Number,
        default: 0,
        required: true,
    },
    duoMostFinish: {
        type: Number,
        default: 0,
        required: true,
    }, // add more fields and verify upper fields plz
});

// export the model
const DuoStats = mongoose.model('DuoStats', duoStatsSchema);
module.exports = DuoStats;