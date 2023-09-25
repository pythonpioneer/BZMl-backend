// importing all requirements
const mongoose = require('mongoose');
const { Schema } = mongoose;

// now, create the game model
const gameSchema = new Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
    },
    gamingPlatform: {  // ( BGMI | PUBG )
        type: String,
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
    }
});

// export the model
const Game = mongoose.model('game', gameSchema);
module.exports = Game;