// importing all requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// now, create the game model
const previousGameSchema = new Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    gamingPlatform: {  // ( BGMI | PUBG )
        type: String,
        default: "BGMI",
        required: true,
    },
    gamingMode: {  // ( SOLO | DUO | SQUAD )
        type: String,
        required: true,
    },
    prizePool: {
        type: Number,
        required: true,
    },
    entryFee: {
        type: Number,
        required: true,
    },
    timeStamp: {
        type: Date,
        default: Date.now(),
    }
});

// export the model
const PreviousGames = mongoose.model('previousGames', previousGameSchema);
module.exports = PreviousGames;