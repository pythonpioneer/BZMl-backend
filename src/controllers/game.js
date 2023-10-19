// Imporiting db models
const Admin = require("../models/user/Admin");
const User = require("../models/user/User");
const Game = require("../models/games/Game");
const GameHistory = require("../models/games/GameHistory");


// to create a game
const createGame = async (req, res) => {
    try {
        // fetch all the game information from the req body
        const { gamingTitle, gamingPlatform, gamingMode, prizePool, gamingMap, entryFee, maxPlayer } = req.body;

        // now confirm the admin identity
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, create the game
        Game.create({
            host: req.user.id,
            gamingTitle: gamingTitle.toUpperCase(),
            gamingPlatform: gamingPlatform?.toUpperCase(),
            gamingMode: gamingMode?.toUpperCase(),
            gamingMap: gamingMap.toUpperCase(),
            prizePool: prizePool,
            entryFee: entryFee,
            maxPlayer: maxPlayer,
        })
            .then((game) => {
                // now push the game data into game history
                GameHistory.create({
                    host: req.user.id,
                    gamingTitle: game.gamingTitle,
                    gamingPlatform: game.gamingPlatform,
                    gamingMode: game.gamingMode,
                    gamingMap: game.gamingMap,
                    prizePool: prizePool,
                    entryFee: entryFee,
                })
                    .then((GameHistory) => {
                        return res.status(201).json({ "status": 201, "message": "Game Created", "game": game });
                    })
                    .catch(err => {
                        return res.status(500).json({ status: 500, message: "Game is not added to GameHistory model", issue: err });
                    });

            })
            .catch(err => {
                return res.status(500).json({ status: 500, message: "Game is not added to Game model", issue: err });
            });

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

/* Authentication is not required to get all the current list of games but,
to get all games list authentication is required of user */
const getGames = async (req, res) => {
    try {

        // fetch the gametype and 
        const gameType = req.query['gametype']?.toLowerCase();
        let game;

        // to get all the current game list (login not required)
        if (gameType === 'current') {

            // value that shouldn't be fetched (default if user is logged in as user)
            let notFetched = ['-host'];

            // now, check that the user is logged in or not
            if (req?.user?.id) {  // user is logged in

                // now, fetch the user
                const user = await User.findById(req.user.id);

                // now verify the user
                if (!user) {  // user can be admin

                    // check that the user is admin or not
                    const admin = await Admin.findById(req.user.id);

                    if (admin) notFetched = [];
                    else return res.status(404).json({ status: 404, message: "User Not Found" });

                }
                else notFetched = ['-host'];  // if user is logged in as user

            }
            else {  // user is not logged in
                notFetched.push(...['-roomPass', '-roomId', '-currPlayers', '-isGameStarted']);  // don't fetch these values
            }

            // now fetch the game and send it in response
            game = await Game.find().select(notFetched);
            return res.status(200).json({ status: 200, message: "Games found", totalGames: game.length, games: game });  // the game arr can be empty, if there is no game in the db.
        }

        // to get all the game list (login required)
        if (gameType === 'previous') {

            // validate the user is logged in 
            if (!req?.user?.id) return res.status(401).json({ status: 401, message: "Access Denied!!" });

            // validating that the user is registerd as admin
            let user = await Admin.findById(req.user.id);
            if (user) {
                // return all game data
                game = await GameHistory.find();
                return res.status(200).json({ status: 200, message: "Games found", totalResults: game.length, games: game });
            }

            // validating that the user is registerd as user
            user = await User.findById(req.user.id);
            if (user) {
                // now return the some previous game information 
                game = await GameHistory.find().select('-host');
                return res.status(200).json({ status: 200, message: "Games found", totalResults: game.length, games: game });
            }

            // if the requested user is not admin and any user.
            else return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        // the passed query is not recogonizable.
        else return res.status(400).json({ status: 400, message: "Invalid Query Params" });

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to delete a game
const deleteGame = async (req, res) => {

    /* this method is not for export, it is used inside the game.js
    In this method host or superuser want to delete the game. (don't export) */
    async function _deleteGame(gameId, Game, GameHistory) {
        
        // now, delete the game from Game table
        let game = await Game.findByIdAndDelete(gameId);

        // creating a game to update in game history
        let newGame = {
            host: game.host.toString(),
            gamingPlatform: game.gamingPlatform,
            gamingMode: game.gamingMode,
            prizePool: game.prizePool,
            entryFee: game.entryFee,
            deletedBy: req.user.id,
            deletedOn: Date.now(),
            gameStatus: game.isGameStarted ? "game started" : "game didn't started",
        };
        
        // now, push the data into gameHistory with gameStatus=failed and gameDeletedOn=<current date>
        await GameHistory.updateOne({ gameId: game._id }, { $set: newGame }, { new: true });
        return res.status(200).json({ "status": 200, "message": "Game Deleted" });
    }

    try {

        // fetch the game id from query
        const gameId = req.query['game-id'];

        // confirm that the game id exists
        let game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ status: 404, message: "game not found" });

        // now, confirm that the request is maid by admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, confirm that the host of the game is same as the requested admin or superuser
        if (admin._id === game.host.toString()) {  // game host want to delete the game

            // now, delete the game
            _deleteGame(gameId, Game, GameHistory);
        }
        else if (admin.superUser) {  // if admin is superuser

            // now, delete the game
            _deleteGame(gameId, Game, GameHistory);
        }
        else return res.status(403).json({ status: 403, message: "Access Denied!!", info: "Admin access only!!" });  // any other admin want to delete the game

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to update a game
const updateGame = async (req, res) => {
    try {
        // fetch all the values from request body
        const { gamingPlatform, gamingMode, roomId, roomPass, prizePool, gamingMap } = req.body;
        let toBeUpdated = false;  // if any field given to update

        // now, create a new game object
        let newGame = { timeStamp: Date.now() };

        // now, find and fill all the field to be updated
        if (gamingPlatform) {
            toBeUpdated = true;
            newGame.gamingPlatform = gamingPlatform.toUpperCase();
        }
        if (gamingMap) {
            toBeUpdated = true;
            newGame.gamingMap = gamingMap.toUpperCase();
        }
        if (gamingMode) {
            toBeUpdated = true;
            newGame.gamingMode = gamingMode.toUpperCase();
        }
        if (roomId) {
            toBeUpdated = true;
            newGame.roomId = roomId;
        }
        if (roomPass) {
            toBeUpdated = true;
            newGame.roomPass = roomPass;
        }
        if (prizePool) {
            toBeUpdated = true;
            newGame.prizePool = true;
        }

        // now confirm that the game is to be updated
        if (toBeUpdated) {

            // fetch the game ID from the query
            const gameId = req.query['game-id'];
            if (!gameId) return res.status(400).json({ status: 400, message: "Invalid Game id" });

            // now confirm that the game exists
            let game = await Game.findById(gameId);
            if (!game) return res.status(404).json({ status: 404, message: "game not found" });

            // confirm that the user is logged in as admin
            let admin = await Admin.findById(req.user.id);
            if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

            // then update the game
            game = await Game.findByIdAndUpdate(gameId, { $set: newGame }, { new: true });
            return res.status(200).json({ status: 200, message: 'game updated', user: game });
        }

        // this will not send any json as response because status: 204
        else res.status(204).json({ status: 204, message: "Nothing is there to be updated" });

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to register the user in the game
const registerInGame = async (req, res) => {
    res.send("ok");
};

// exporting required methods
module.exports = { createGame, getGames, deleteGame, updateGame, registerInGame };

