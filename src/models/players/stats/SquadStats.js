// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const squadStatsSchema = new Schema({
    pubgID: {  // the game id entered by the user (used and forgein key)
        type: String,
        required: true,
        unique: true,
    },
    squadTotalMatch: {  // total matches played by player
        type: Number,
        default: 0,
        required: true,
    },
    squadTotalWins: {  // total matches won by player
        type: Number,
        default: 0,
        required: true,
    },
    squadTotalFinish: {  // total finishes by player, in all mode
        type: Number,
        default: 0,
        required: true,
    },
    squadTopThree: {  // rank obtained by player in match
        type: Number,
        default: 0,
        required: true,
    },
    squadMostFinish: {  // max kill in a match
        type: Number,
        default: 0,
        required: true,
    },
    squadTeamMostFinish: {  // max kill by a team in a match
        type: Number,
        default: 0,
        required: true,
    },
    squadTeamTotalFinish: {  // total kill by the team
        type: Number,
        default: 0,
        required: true,
    },
    squadDomination: {  // obtained by a formula and it represents the performance of the player w.r.t team.
        type: Number,
        default: 0,
        required: true,
    },
    maxPlayerAllowed: {  // total player allowed in a team
        type: Number,
        default: 4,
    }
});

// export the model
const SquadStats = mongoose.model('SquadStats', squadStatsSchema);
module.exports = SquadStats;