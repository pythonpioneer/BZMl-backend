const jwt = require('jsonwebtoken');

// creating a signature to sign the payload data for identification
const SIGNATURE = "iwillcompletethisprojectasap";

// create a middleware to genearate token
exports.generateToken = (payloadData) => {
    const authToken = jwt.sign(payloadData, SIGNATURE);
    return authToken;
};

// a middlware to validate token and fethc user id from the token
exports.fetchUser = (req, res, next) => {

    // fetch the token from the request header and fetch user id from the token(jwt) 
    const token = req.header('auth-token');

    // if token is not present then send bad request
    if (!token) res.status(401).json({ errors: "please authenticate with a valid token" });

    // now fetch the id from the jwt token
    try {
        const data = jwt.verify(token, SIGNATURE);  // throw an error when token didn't verify, handled by catch
        req.user = data.user;
        next();
    } catch (err) {
        res.status(401).json({ errors: "please authenticate with a valid token", issue: err });
    }
}



