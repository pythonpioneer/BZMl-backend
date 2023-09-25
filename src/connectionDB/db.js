const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// mongodb setup
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.info("Coneection Successfull, " + "Connected to MongoDB");
        })
        .catch((err) => {
            console.log("Coneection Interrupted");
            console.log("error: ", err);
        })
};

module.exports = connectToMongo;
