const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/bzml';

const connectToMongo = async () => {
    mongoose.connect(mongoURI);
    console.log("ok");
};

module.exports = connectToMongo;
