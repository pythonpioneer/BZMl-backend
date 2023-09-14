const jwt = require('jsonwebtoken');

// creating a signature to sign the payload data for identification
const SIGNATURE = "iwillcompletethisprojectasap";

// create a middleware to genearate token
exports.generateToken = (payloadData) => {
    const authToken = jwt.sign(payloadData, SIGNATURE);
    return authToken;
};

exports.validateToken = (req, res, next) => {

    // fetch the user id from the token(jwt) from
    const token = req.body('auth-token');

    // if token is not present then send bad request
    if(!token) res.status(401).json({ errors: "please authenticate with a valid token" });

    // now fetch the id from the jwt token
    try {
        const data = jwt.verify(token, SIGNATURE);
    }
    catch(err){

    }


}



            