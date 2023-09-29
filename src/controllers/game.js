// Imporiting all requirements
const Admin = require("../models/user/Admin");
const User = require("../models/user/User");
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
                return res.status(200).json({ status: 200, message: "Games found", totalGames: game.length, games: game });
            }

            // validating that the user is registerd as user
            user = await User.findById(req.user.id);
            if (user) {
                // now return the some previous game information 
                game = await GameHistory.find().select('-host');
                return res.status(200).json({ status: 200, message: "Games found", totalGames: game.length, games: game });
            }

            // if the requested user is not admin and any user.
            else return res.status(404).json({ status: 404, message: "User Not Found" });
        }

        else return res.status(404).json({ status: 404, message: "query not found" });

    } catch (err) {
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// to delete a game
const deleteGame = async (req, res) => {
    try {  

        // fetch the game id from query
        const gameId = req.query['game-id'];

        // confirm that the game id exists
        let game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ status: 404, message: "game not found" });

        res.send(gameId)

    } catch (err) {
        return res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// exporting required methods
module.exports = { createGame, getGames, deleteGame };

