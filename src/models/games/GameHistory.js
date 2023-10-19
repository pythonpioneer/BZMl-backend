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
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    },
    gamingTitle: {
        type: String,
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
    gamingMap: {  // ( ERANGEL | NUSA | SANHOK | KARAKIN | MIRAMAR | LIVIK | VIKENDI )
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
    players: [{   // array of players object id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    deletedOn: {
        type: Date,
    },
    gameStatus: {
        type: String,
    },
    timeStamp: {
        type: Date,
        default: Date.now,
    }
});

// export the model
const PreviousGames = mongoose.model('previousGames', previousGameSchema);
module.exports = PreviousGames;