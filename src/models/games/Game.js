// importing all requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// now, create the game model
const gameSchema = new Schema({
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
    roomId: {
        type: String,
        required: true
    },
    roomPass: {
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
        expires: 100,
        default: Date.now(),
    }
});

// export the model
const Game = mongoose.model('game', gameSchema);
module.exports = Game;