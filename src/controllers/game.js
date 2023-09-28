// Imporiting all requirements
const Admin = require("../models/user/Admin");
const Game = require("../models/games/Game");
const GameHistory = require("../models/games/GameHistory");


// to create a game
const createGame = async (req, res) => {
    try {
        // fetch all the game information from the req body
        const { gamingPlatform, gamingMode, roomId, roomPass, prizePool, entryFee, maxPlayer } = req.body;

        // now confirm the admin identity
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, create the game
        Game.create({
            host: req.user.id,
            gamingPlatform: gamingPlatform?.toUpperCase(),
            gamingMode: gamingMode?.toUpperCase(),
            roomId: roomId,
            roomPass: roomPass,
            prizePool: prizePool,
            entryFee: entryFee,
            maxPlayer: maxPlayer,
        })
            .then((game) => {
                
                // now push the game data into game history
                GameHistory.create({
                    host: req.user.id,
                    gamingPlatform: game.gamingPlatform,
                    gamingMode: game.gamingMode,
                    prizePool: prizePool,
                    entryFee: entryFee,
                })
                    .then((GameHistory) => {
                        return res.status(200).json({ "status": 200, "message": "Game Created", "game": game });
                    })
                    .catch(err => {
                        return res.status(500).json({ errors: "Internal server error", issue: err });
                    });

            })
            .catch(err => {
                return res.status(500).json({ errors: "Internal server error", issue: err });
            });
        
    } catch (err) {
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// exporting required methods
module.exports = { createGame };
