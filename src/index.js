// importing requirements
const connectToMongo = require('./connectionDB/db');
const express = require('express');
const cors = require("cors");

// setting local variables
const dotenv = require('dotenv');
dotenv.config();

// mongo connection
connectToMongo();

// development environment specifications
const app = express()
const PORT = process.env.PORT  || 2100;
const APIPATH = process.env.API_PATH;  // this can be any string, a starting path for the API

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(cors());

// all availble routing for the api
app.use(APIPATH + 'auth', require('./routes/auth.js'));
app.use(APIPATH + 'user', require('./routes/user.js'));
app.use(APIPATH + 'admin', require('./routes/admin.js'));
app.use(APIPATH + 'games', require('./routes/games.js'));
app.use(APIPATH + 'ban', require('./routes/ban.js'));
app.use(APIPATH + 'verify', require('./routes/verify.js'));

// running the app
app.listen(PORT, () => {
  console.log(`BZML app listening on port http://localhost:${PORT}`);
});