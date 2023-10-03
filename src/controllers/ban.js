// Importing all requirements
const Admin = require('../models/user/Admin');
const User = require('../models/user/User');
const Ban = require('../models/players/Ban');
const Player = require('../models/players/Player');
const { comparePassword } = require('../middleware/auth/passwordMiddleware');
const { updateOne } = require('../models/players/Player');


// To ban a user/player
const banPlayer = async (req, res) => {
    try {
        // fetch the password and user-id from the request
        const { password } = req.body;
        const userId = req.query['user-id'];

        // now check that admin is logged in
        let admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({ status: 401, message: "Access Denied!!" });

        // now, cofirm that the given user exists
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: 404, message: "user not found"});

        // now, match the admin password
        if (!comparePassword(password, admin.password))
            return res.status(401).json({ status: 401, message: "Access Denied!!", info: "Invalid Credentials" });

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

// export all required methods
module.exports = { banPlayer };
