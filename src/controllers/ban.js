// Importing all requirements
const Admin = require('../models/user/Admin');
const User = require('../models/user/User');
const Ban = require('../models/players/Ban');
const Player = require('../models/players/Player');
const { comparePassword } = require('../middleware/auth/passwordMiddleware');


// To ban a user/player
const banPlayer = async (req, res) => {
    try {
        // fetch the password and user-id from the request
        const { pubgID, password } = req.body;  // it's confirm that the user exist, from vaidation array

        // now check that admin is logged in
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, match the admin password
        if (!comparePassword(password, admin.password))
            return res.status(401).json({ status: 401, message: "Access Denied!!", info: "Invalid Credentials" });

        // confirm that the given user exists
        let user = await User.findOne({ pubgID });
        if (!user) return res.status(404).json({ "status": 404, "message": "User Not Found" });

        // now, check that the user is already ban or not
        let banUser = await Ban.findOne({ pubgID });  // finding user pubgID
        if (banUser) return res.status(400).json({ status: 400, message: "User/Player is already banned!!"});

        // now ban the user by adding the user details into Ban model
        Ban.create({
            admin: req.user.id,
            pubgID: user.pubgID,
            email: user.email,
            mobileNumber: user.mobileNumber,
        })
            .then( async (banUser) => {  // now, we need to update the player status

                let player = await Player.findOne({ pubgID: banUser.pubgID });
                if (player){  // if player is there then update the player and send updated message

                    // updating user
                    player.isBan = true;
                    player.save();
    
                    // player ban response
                    return res.status(200).json({ status: 200, message: "User/Player Banned Successfully!!", user: user, banUser: banUser });
                }
                else return res.status(404).json({ status: 404, message: "Player not found"});
            })
            .catch(err => {
                return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
            });

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to get all the ban player list (admin only)
const getBanPlayers = async (req, res) => {
    try {  
        // confirm that the request is made by admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now fetch all the ban player list
        const banPlayers = await Ban.find();  // fetch all data form Ban model
        return res.status(200).json({ status: 200, message: "Ban players found", players: banPlayers });

    } catch (err) {
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to unban the user
const unbanPlayer = async (req, res) => {
    try {  // fetch the id and password from the body
        const { pubgID, password } = req.body;

        // confirm that the request is made by admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // match the password of the admin
        if (!comparePassword(password, admin.password))
            return res.status(401).json({ status: 401, message: "Access Denied!!", info: "Invalid Credentials" });

        // now, find that the given user exists
        let user = await User.findOne({ pubgID });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now, check that the player exists
        let player = await Player.findOne({ pubgID });
        if (!player) return res.status(404).json({ status: 404, message: "Player Not Found" });

        // now check that the ban player exists
        let banPlayer = await Ban.findOne({ pubgID });
        if (!banPlayer) return res.status(404).json({ status: 400, message: "User is not banned" });

        // now, delete the ban player from the ban model
        banPlayer = await Ban.findByIdAndDelete(banPlayer._id);
        if (banPlayer) {  // user deleted from the ban player model
            
            if (player.isBan) {  // if the ban status of player is true
                player.isBan = false;
                player.save();
            }

            // user, is successfully unbanned
            return res.status(200).json({ status: 200, messge: "Player is unbanned, now!!", player: player });
        }

        // if the player is not in ban model
        else return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to block the player
const blockPlayer = async (req, res) => {
    try {
        // fetch the id and password from the body
        const { pubgID, password } = req.body;

        // confirm that the request is made by the admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, match the password of the admin
        if (!comparePassword(password, admin.password))
            return res.status(401).json({ status: 401, message: "Access Denied!!", info: "Invalid Credentials" });

        // find that the user exists
        let user = await User.findOne({ pubgID });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // confirm that the player exists
        let player = await Player.findOne({ pubgID });
        if (player) { 

            // check that the player is already blocked
            if (player.isBlocked) {
                return res.status(400).json({ status: 400, messge: "Player is already blocked" });
            }

            // now, change the block status of the player
            player.isBlocked = true;
            player.save();

            // player is blocked now
            return res.status(200).json({ status: 200, messge: "Player is blocked, now!!", player: player });
        } 

        // if player not found
        else return res.status(404).json({ status: 404, message: "Player Not Found" });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to get the list of all block players
const getBlockPlayers = async (req, res) => {
    try {
        // validate that the request is made by the admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, get the list of all blcok players.
        const blockPlayers = await Player.find({ "isBlocked": true });

        if (blockPlayers.length > 0) {  // if there is block players
            return res.status(200).json({ status: 200, message: "Block players found!", blockPlayers: blockPlayers });
        }
        return res.status(200).json({ status: 200, message: "No block player found!" });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// to unblock the player
const unblockPlayer = async (req, res) => {
    try {
        // fetch the id and password from the body
        const { pubgID, password } = req.body;

        // confirm that the request is made by the admin
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, match the password of the admin
        if (!comparePassword(password, admin.password))
            return res.status(401).json({ status: 401, message: "Access Denied!!", info: "Invalid Credentials" });

        // check that the user exists with the given id
        let user = await User.findOne({ pubgID });
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now, confirm that the player exist with the given id
        let player = await Player.findOne({ pubgID });
        if (player) { 

            if (!player.isBlocked) {  // player is already unblocked
                return res.status(400).json({ status: 400, message: "Player is already unblocked!" });
            }

            // now change the player block status
            player.isBlocked = false;
            player.save();

            // player is unblocked now
            return res.status(200).json({ status: 200, messge: "Player is unblocked, now!!", player: player });
        }

        // player doesn't exists
        return res.status(404).json({ status: 404, message: "Player Not Found" });

    } catch (err) {  // unrecogonized errors
        return res.status(500).json({ status: 500, message: "Internal Server Error", issue: err });
    }
};

// export all required methods
module.exports = { banPlayer, getBanPlayers, unbanPlayer, blockPlayer, getBlockPlayers, unblockPlayer };
