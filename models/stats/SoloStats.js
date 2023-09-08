// importing requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// creating schema for users
const soloStatsSchema = new Schema({
    user : {  // used as primary key and forgein key
        type: mongoose.Schema.Types.ObjectId,  
    },
    matchPlayed: {
        type: Number,
        required: true,
    },
    matchWon: {
        type: Number,
        required: true,
    },
    totalFinishes: {
        type: Number,
        required: true,
    },
    top5: {
        type: Number,
        required: true,
    },
    mostFinishes: {
        type: Number,
        required: true,
    }
});

const SoloStats = mongoose.model('SoloStats', soloStatsSchema);
module.exports = SoloStats;