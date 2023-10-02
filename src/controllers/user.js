// importing all requirements
const User = require('../models/user/User');
const { generateToken } = require('../middleware/auth/authMiddleware');
const { generatePassword, comparePassword } = require('../middleware/auth/passwordMiddleware');
const { isNumber } = require('../helper/utility/fieldIdentifier');


// to create user
const createUser = async (req, res) => {

    // generate password using bcrypt
    const securePassword = generatePassword(req.body.password);
    let gender = req.body.gender;
    gender = gender.toUpperCase();
    
    // fields to update user data
    let cash = 0;

    // find the ref-id
    if (req.body?.refCode) {
        let refUser = await User.findOne({ email: req.body.refCode });
        
        // if reffered user exist then
        refUser.myCash += 50;
        cash = 50;
        refUser.save();
    }

    // create the user in db
    User.create({
        pubgID: req.body.pubgID,
        pubgName: req.body.pubgName,
        fullName: req.body.fullName,
        email: req.body.email,
        mobileNumber: req.body.mobileNumber,
        password: securePassword,
        gender: gender,
        refCode: req.body.refCode ? req.body.refCode : null,
        isVerified: false,
        myCash: cash,
    })
        .then( async (user) => {  // sending response, when user is created

            // sending user id as payload, because accesssing data using id is easier
            const payloadData = {
                user: {
                    id: user.id
                },
            };

            // generating authToken when user created
            const authToken = generateToken(payloadData);
            return res.status(200).json({ "status": 200, "message": "user created", "auth-token": authToken });
        })

        .catch(err => res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err
        }));
};

// to login an existing user
const loginUser = async (req, res) => {

    try {  // now confirm authentication

        let user;
        const { userfield, password } = req.body;  // fetching values from request body

        /* find the user with given email/id/no. and validate, if user exists 
        now, find the type of user field */
        if (isNumber(userfield))
            user = await User.findOne({ mobileNumber: userfield });  // login with mobile no.
        else user = await User.findOne({ email: userfield });  // login with email

        // if user doesn't exist or wrong input fields
        if (!user) return res.status(400).json({ status: 400, message: "Invalid Credentials" });

        // now, compare the password using bcrypt.js
        const isPasswordMatches = comparePassword(password, user.password);
        if (!isPasswordMatches) return res.status(400).json({ status: 400, message: "Invalid Credentials" });  // password not matched

        // if password matched, sending user id as payload, accesssing data using id is easier
        const payloadData = {
            user: {
                id: user.id
            },
        };

        // generate auth-token send it
        const authToken = generateToken(payloadData)
        res.status(200).json({ status: 200, "message": "user Logged In", "auth-token": authToken });

    } catch (err) {
        res.status(500).json({  // any unrecogonize error will be raised from here
            errors: "Internal server error",
            issue: err
        })
    }
};

// to get the user details using user id
const getUserDetails = async (req, res) => {

    try {  // find user by id
        const user = await User.findById(req.user.id)
            .select('-password');  // not fetch password from db
        res.status(200).json({ "status": 200, "message": "User Found", "data": user });
    } catch (err) {
        res.status(500).json({ status: 500, errors: "Internal server error", issue: err });
    }
}

// to set user details or update
const setUserDetails = async (req, res) => {

    try {
        // fetch all variables from bod
        const { pubgName, fullName, email, mobileNumber, gender } = req.body;
        let toBeUpdated = false;

        // create a new user object, updating timestamp field
        const updatedUser = { timestamp: Date.now() };

        // now, fill all the updated details in the new user object
        if (pubgName) {
            toBeUpdated = true;
            updatedUser.isVerified = false;
            updatedUser.pubgName = pubgName;
        }
        if (fullName) {
            toBeUpdated = true;
            updatedUser.fullName = fullName;
        }
        if (email) {
            toBeUpdated = true;
            updatedUser.isVerified = false;
            updatedUser.email = email;
        }
        if (mobileNumber) {
            toBeUpdated = true;
            updatedUser.isVerified = false;
            updatedUser.mobileNumber = mobileNumber;
        }
        if (gender) {
            toBeUpdated = true;
            updatedUser.gender = gender;
        }

        if(toBeUpdated){
            // now find the user that to be updated and confirm that the user exists
            let user = await User.findById(req.user.id);
            if (!user) res.status(404).json({ status: 404, message: "User Not Found" });

            // now update the user and send the response
            user = await User.findByIdAndUpdate(req.user.id, { $set: updatedUser }, { new: true });
            res.status(200).json({ status: 200, message: 'user updated', user: user });
        }
        // this will not send any json as response because status: 204
        else res.status(204).json({status: 204, message: "Nothing is there to be updated"});

    } catch (err) { 
        res.status(500).json({ errors: "Internal server error", issue: err });
    }

};

// to delete the user account
const deleteUserAccount = async (req, res) => {

    try{  // find the user that to be deleted
        // and confirms the user identity
        let user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ status: 404, message: "User Not Found" });


        // if not admin then delete (issue-12)

        // now, delete the user
        user = await User.findByIdAndDelete(req.user.id);
        return res.status(200).json({ status: 200, message: 'user deleted', user: user });

    } catch(err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

// to generate or update the referral code
const generateRef = async (req, res) => {
    try {
        // fetch the referral code from the body
        const { myRefCode } = req.body;

        // now confirm that the user is logged in and exists
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 404, message: "User Not Found" });

        // now, find that the given refCode is not in used
        let refCode = await User.findOne({ myRefCode });
        if (refCode) return res.status(400).json({ status: 400, message: "Referral code already is in use" });

        // now update the refCode
        user = await User.findByIdAndUpdate(req.user.id, { $set: { myRefCode } }, { new: true });
        return res.status(200).json({ status: 200, message: "Referral code updated", user: user });

    } catch (err) {
        res.status(500).json({ errors: "Internal server error", issue: err });
    }
};

module.exports = { createUser, loginUser, getUserDetails, setUserDetails, deleteUserAccount, generateRef };