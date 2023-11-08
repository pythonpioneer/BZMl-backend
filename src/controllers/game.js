// Imporiting db models
const Admin = require("../models/user/Admin");
const User = require("../models/user/User");
const Game = require("../models/games/Game");
const Player = require("../models/players/Player");
const GameHistory = require("../models/games/GameHistory");
const { generateSlots, generateSlotCode } = require("../helper/utility/generateSlots");


// to create a game
const createGame = async (req, res) => {

    // maps having max players limits
    const _fullCapacityMaps = ['ERANGEL', 'SANHOK', 'MIRAMAR', 'VIKENDI'];  // max players: 100, allowed players: 92(100 - 8)
    const _livikMap = ['LIVIK'];  // max players: 52, allowed: 44
    const _karakinMap = ['KARAKIN'];  // max players: 64, allowed: 56
    const _nusaMap = ['NUSA'];  // max players: 32, allowed: 28

    // to generate the available slots
    let allowedPlayers;
    let firstSlot;
    let teamMembers;

    try {
        // fetch all the game information from the req body
        const { gamingTitle, gamingPlatform, gamingMode, prizePool, gamingMap, entryFee } = req.body;
        let maxPlayers = req.body.maxPlayers;
        let availableSlots;  // to generate the slot array based on maps 
        let slotStatus = [];  // this array will contain all the team codes and team status       

        // now, figure out the max limit of the players in the particular maps ( ERANGEL_100 | NUSA_32 | SANHOK_100 | KARAKIN_64 | MIRAMAR_100 | LIVIK_52 | VIKENDI_100 )
        if (_fullCapacityMaps.includes(gamingMap.toUpperCase())) {
            if (!maxPlayers <= 92) maxPlayers = 92;  // if the value is more than 92 or undefined then it will become 92
        }
        else if (_livikMap.includes(gamingMap.toUpperCase())) {  // setting the maximum allowed players value
            if (!maxPlayers <= 44) maxPlayers = 44;
        }
        else if (_karakinMap.includes(gamingMap.toUpperCase())) {  // setting the maximum allowed players value
            if (!maxPlayers <= 56) maxPlayers = 56
        }
        else if (_nusaMap.includes(gamingMap.toUpperCase())) {  // setting the maximum allowed players value
            if (!maxPlayers <= 28) maxPlayers = 28;
        }

        // total allowed players
        allowedPlayers = maxPlayers;

        // now, find the first slot based on map
        if (gamingMap.toUpperCase() === 'NUSA') firstSlot = 5;  // 4 slots for peoples to wait for their slots to become vaccant
        else firstSlot = 9;  // 8 slots for peoples to wait for their slots to become vaccant

        // now, set the mode of the game to generate the available slots
        if (gamingMode.toUpperCase() === 'SOLO') teamMembers = 1;
        else if (gamingMode.toUpperCase() === 'DUO') teamMembers = 2;
        else if (gamingMode.toUpperCase() === 'SQUAD') {
            teamMembers = 4;

            // generating team code and full status must be false 
            let randomCode;
            for (let i=0; i<maxPlayers; i+=4) {
                
                // getting random codes and saving the code for every slot
                randomCode = generateSlotCode(slotStatus);
                slotStatus.push({ code: randomCode, isFull: false });
            }
        }

        // now, generate the available slot array
        availableSlots = generateSlots({ allowedPlayers, teamMembers, firstSlot });

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
            maxPlayers: maxPlayers,
            availableSlots: availableSlots,
            slotLength: availableSlots.length,
            slotStatus: slotStatus,
        })
            .then((game) => {
                // now push the game data into game history
                GameHistory.create({
                    host: req.user.id,
                    gameId: game._id,
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
        let notFetched;

        // to get all the current game list (login not required)
        if (gameType === 'current') {

            // value that shouldn't be fetched (default if user is logged in as user)
            notFetched = ['-host', '-roomId', '-roomPass', '-availableSlots', '-players', '-slots'];  // add all slots fields

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
                // else do not fetch the declared fields in notFetched
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
        const { roomId, roomPass, prizePool, gamingMap, gamingTitle } = req.body;
        let toBeUpdated = false;  // if any field given to update

        // now, create a new game object
        let newGame = { timeStamp: Date.now() };

        // now, find and fill all the field to be updated
        if (gamingMap) {
            toBeUpdated = true;
            newGame.gamingMap = gamingMap.toUpperCase();
        }
        if (gamingTitle) {
            toBeUpdated = true;
            newGame.gamingTitle = gamingTitle;
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
const registerInSoloGame = async (req, res) => {
    try {
        // fetching the game id from the query params
        const gameId = req.query['game-id'];

        // check that the given user exists
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "user not found!" });

        // confirm that the game exists
        let game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ status: 404, message: "game not found!" });

        // if the game is not solo then return the bad response (development purpose)
        if (game.gamingMode.toLowerCase() != 'solo') return res.status(403).json({ status: 403, message: "This API is for SOLO modes only." });

        // now, check that the user is verified and can register in the game
        if (!user.isVerified) return res.status(404).json({ status: 403, message: "User is not verified!"});

        // now, find that the player exist
        let player = await Player.findOne({ pubgID: user.pubgID });
        if (!player) return res.status(404).json({ status: 404, message: "player not found!" });

        // if player is not ban or not blocked then the player continues
        if (player.isBan || player.isBlocked) return res.status(403).json({ status: 403, message: "Either player is ban or blocked!!" });

        // now make sure there is still place for the players to join/regster in the game
        if (game.availableSlots.length <= 0) return res.status(403).json({ status: 403, message: "Game slots are full. You cannot join the game at this time." }); 

        // now, check that the player is not already registered
        let isIds = game.players.filter(value => value.toString() === player._id.toString());

        if (isIds.length != 0) {  // if player is already registered

            // find the slot number of the registered player and return the response to the player
            let slotNumber = game.slots.find(value => value.player.toString() === player._id.toString()).slotNumber;
            return res.status(200).json({ status: 200, message: "Player is already registered!", slotNumber }); 
        }

        // make sure that user have sufficient cash for the match
        if (user.myCash < game.entryFee) return res.status(402).json({ status: 402, message: "Insufficient funds in your account." });

        // now generate a available slot numbers
        let slotNumber = game.availableSlots.pop();
        game.save();

        // update the game by entering player id and slot numbers
        game = await Game.findByIdAndUpdate(
            gameId,
            { $push: { slots: { player: player._id, slotNumber: slotNumber[0] } } },
            { new: true }
        );

        // now, register the user in the game
        ++game.currPlayers;
        game.players.push(player._id);
        game.save();

        // now find the game in game history
        let gameHistory = await GameHistory.findOne({ gameId: game._id });  // there is no-need to validate this variable

        // now, save the player in gameHistory
        gameHistory.players.push(player._id);
        gameHistory.save();

        // now, deduct the money from the user
        user.myCash -= game.entryFee;
        user.save();

        return res.status(200).json({ status: 200, message: "User registered in the game, Successfully!!", slotNumber });
    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to register in game with squad or register in squad games
const registerInSquadGame = async (req, res) => {
    try {
        // fetch the data from the query param
        const gameId = req.query['game-id'];
        let { teamCode, isSquadAvailable } = req.body;

        // confirm that the user exist
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "user not found!" });

        // confirm that the game exists
        let game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ status: 404, message: "game not found!" });

        // if the game is not squad then return the bad response (development purpose)
        if (game.gamingMode.toLowerCase() != 'squad') return res.status(403).json({ status: 403, message: "This API is for SQUAD modes only." });

        // now, check that the user is verified and can register in the game
        if (!user.isVerified) return res.status(404).json({ status: 403, message: "User is not verified!"});

        // now, find that the player exist
        let player = await Player.findOne({ pubgID: user.pubgID });
        if (!player) return res.status(404).json({ status: 404, message: "player not found!" });

        // if player is not ban or not blocked then the player continues
        if (player.isBan || player.isBlocked) return res.status(403).json({ status: 403, message: "Either player is ban or blocked!!" });      
        
        // now, check that the player is not already registered
        let isIds = game.players.filter(value => value.toString() === player._id.toString());

        // finding the starting point to find the teamCode from the slotNumber
        let startingPoint;
        if (game.gamingMap === 'NUSA') startingPoint = 5;
        else startingPoint = 9;

        if (isIds.length != 0) {  // if player is already registered

            // find the slot number of the registered player and return the response to the player
            let slotNumber = game.slots.find(value => value.player.toString() === player._id.toString()).slotNumber;

            // now, find the team code for the player slots
            let teamPosition = Math.floor((slotNumber - startingPoint) / 4);
            let teamCode = game.slotStatus[teamPosition].code;

            return res.status(200).json({ status: 200, message: "Player is already registered!", slotNumber, teamCode }); 
        }

        // make sure that user have sufficient cash for the match
        if (user.myCash < game.entryFee) return res.status(402).json({ status: 402, message: "Insufficient funds in your account." });

        // if team code is there, then register the user and give theslots
        if (teamCode) {

            let teamPosition;  // the position of the team

            // now, find the team code index
            for (let i=game.slotStatus.length-1; i>=0; i--) {
                if (game.slotStatus[i].code === teamCode) {
                    teamPosition = i;
                }
            }

            // now, check that the team is available or teamcode exists 
            if (!teamPosition) return res.status(404).json({ status: 404, message: "Invalid Team Code!!", info: "Team Code not Found!" });

            // if we have the team code then check that the slot is available or not
            let slots = game.availableSlots[teamPosition];
            if (slots.length === 0) return res.status(404).json({ status: 404, message: "No available slots for this team!" }); 

            // if there is slot available then give the player a slot number
            let slotNumber = game.availableSlots[teamPosition].pop();
            game.players.push(player._id);  // save player with slots
            game.save();

            // save the player and slots in game slot array
            game = await Game.findByIdAndUpdate(
                gameId,
                { $push: { slots: { player: player._id, slotNumber } } },
                { new: true }
            );

            // now find the game in game history
            let gameHistory = await GameHistory.findOne({ gameId: game._id });  // there is no-need to validate this variable

            // now, save the player in gameHistory
            gameHistory.players.push(player._id);
            gameHistory.save();

            // deduct the cash from user accounts
            user.myCash -= game.entryFee;
            user.save();

            // player registered successfully
            return res.status(200).json({ status: 200, message: "Player Registered Successfully!!", teamCode, slotNumber });
        }

        // if the player is new and he/she is trying to register in the game
        if (!teamCode && isSquadAvailable === true) {

            // check that the slots are avialable or  not
            if (game.slotLength <= 0) return res.status(200).json({ status: 200, message: "No slots for squads, Try registering solo or Enter your team code!" });

            // now, find the slot for the player and give him a team code
            let teamCode = game.slotStatus[game.slotLength - 1].code;  // contain the team code 
            let slotNumber = game.availableSlots[game.slotLength - 1].pop();

            // now, make changes in the game and update the game
            game.slotStatus[game.slotLength - 1].isFull = true;
            game.slotLength -= 1;
            game.players.push(player._id);  // save player with slots
            game.save();

            // save the player and slots in game slot array
            game = await Game.findByIdAndUpdate(
                gameId,
                { $push: { slots: { player: player._id, slotNumber } } },
                { new: true }
            );

            // now find the game in game history
            let gameHistory = await GameHistory.findOne({ gameId: game._id });  // there is no-need to validate this variable

            // now, save the player in gameHistory
            gameHistory.players.push(player._id);
            gameHistory.save();

            // deduct the cash from user accounts
            user.myCash -= game.entryFee;
            user.save();

            // player registered successfully
            return res.status(200).json({ status: 200, message: "Player Registered Successfully!!", teamCode, slotNumber });
        }

        




        else res.send("ok")

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// exporting required methods
module.exports = { createGame, getGames, deleteGame, updateGame, registerInSoloGame, registerInSquadGame };

