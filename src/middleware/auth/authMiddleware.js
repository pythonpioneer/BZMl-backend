// importing all requirements
const jwt = require('jsonwebtoken');

// setting local variables
const dotenv = require('dotenv');
dotenv.config();

// creating a signature to sign the payload data for identification
const SIGNATURE = process.env.SIGNATURE;

// create a middleware to genearate token
exports.generateToken = (payloadData) => {
    const authToken = jwt.sign(payloadData, SIGNATURE);
    return authToken;
};

// a middlware to validate token and fetch user id from the token (login required)
exports.fetchUser = (req, res, next) => {

    // fetch the token from the request header and fetch user id from the token(jwt) 
    const token = req.header('auth-token');

    // if token is not present then send bad request
    if (!token) return res.status(401).json({ errors: "please authenticate with a valid token" });

    // now fetch the id from the jwt token
    try {
        const data = jwt.verify(token, SIGNATURE);  // throw an error when token didn't verify, handled by catch
        req.user = data.user;
        next();
    } catch (err) {
        return res.status(401).json({ errors: "please authenticate with a valid token", issue: err });
    }
}

/* a middleware to validate token and fetch user id from token,
if token is not there, still pass the control to the next function. (need special care to handle) 
*/
exports.fetchAnyUser = (req, res, next) => {

    // fetch the token from request header
    const token = req.header('auth-token');

    // if we got toke from the header
    if (token) {
        
        try {  // now fetch the id from the jwt token
            const data = jwt.verify(token, SIGNATURE);  // throw an error when token didn't verify, handled by catch
            req.user = data.user;
            next();
        } catch (err) {
            return res.status(401).json({ errors: "please authenticate with a valid token", issue: err });
        }
    }

    // if token is not there, still pass the control to the next function
    else next();
}



