const jwt = require('jsonwebtoken');

// creating a signature to sign the payload data for identification
const SIGNATURE = "iwillcompletethisprojectasap";

// create a middleware to genearate token
exports.generateToken = (payloadData) => {
    const authToken = jwt.sign(payloadData, SIGNATURE);
    return authToken;
};



            