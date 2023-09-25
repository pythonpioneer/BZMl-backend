const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// mongodb setup
const mongoURI = 'mongodb://localhost:27017/bzml';
console.log(process.env.MONGO_URI);

const connectToMongo = async () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.info("Coneection successfull, " + "connected to MongoDB");
        })
        .catch((err) => {
            console.log("Coneection Interrupted");
            console.log("error: ", err);
        })
};

module.exports = connectToMongo;
