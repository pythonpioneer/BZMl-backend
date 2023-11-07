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
    roomId: {
        type: String,
    },
    roomPass: {
        type: String,
    },
    prizePool: {
        type: Number,
        required: true,
    },
    entryFee: {
        type: Number,
        required: true,
    },
    currPlayers: {
        type: Number,
        default: 0,
        required: true,
    },
    maxPlayers: {
        type: Number,
        default: 92,
        required: true,
    },
    isGameStarted: {
        type: Boolean,
        default: false,
        required: true,
    },
    players: [{   // array of players object id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
    slots: [
        {
            player: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player'
            },
            slotNumber: {
                type: Number
            }
        }
    ],
    availableSlots: {
        type: [[Number]], // This specifies that the array contains numbers
        default: Array.from({ length: 100 - 8 }, (_, index) => index + 9), // You can provide a default array of available slots
        required: true, // You can make the field required if needed
    },
    slotStatus: {  // this field used in squad and duo game modes
        type: [
            {
                code: {
                    type: String,
                },
                isFull: {
                    type: Boolean
                }
            }
        ],
        default: []
    },
    slotLength: {  // this field used in squad and duo game modes
        type: Number,
        default: 0,
    },
    timeStamp: {  // after 24 hrs, the record will be deleted (change it to 3 hrs after development)
        type: Date,
        expires: 86400,
        default: Date.now,
    },
});

// export the model
const Game = mongoose.model('game', gameSchema);
module.exports = Game;