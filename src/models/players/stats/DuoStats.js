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
    duoTopThree: {  // rank obtained by player in match
        type: Number,
        default: 0,
        required: true,
    },
    duoMostFinish: {  // max kill in a match
        type: Number,
        default: 0,
        required: true,
    },
    duoTeamMostFinish: {  // max kill by a team in a match
        type: Number,
        default: 0,
        required: true,
    },
    duoTeamTotalFinish: {  // total kill by the team
        type: Number,
        default: 0,
        required: true,
    },
    duoDomination: {  // obtained by a formula and it represents the performance of the player w.r.t team.
        type: Number,
        default: 0,
        required: true,
    },
    maxPlayerAllowed: {  // total player allowed in a team
        type: Number,
        default: 2,
    }
});

// export the model
const DuoStats = mongoose.model('DuoStats', duoStatsSchema);
module.exports = DuoStats;