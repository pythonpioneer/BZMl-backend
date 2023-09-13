const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/bzml';

const connectToMongo = async () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Coneection successfull, " + "connected to MongoDB");
        })
        .catch((err) => {
            console.log("Coneection Interrupted");
            console.log("error: ", err);
        })
};

module.exports = connectToMongo;
