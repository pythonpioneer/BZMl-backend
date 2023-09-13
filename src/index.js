// importing requirements
const connectToMongo = require('./connectionDB/db');
const express = require('express');
const cors = require("cors");

// mongo connection
connectToMongo();

const app = express()
const PORT = 3200;

const APIPATH = '/api/v1/';

// to use req.body, we have to use this middleware
app.use(express.json());
app.use(cors());

// all availble routing for the api
app.use(APIPATH + 'auth', require('./routes/auth/auth.js'));

// running the app
app.listen(PORT, () => {
  console.log(`BZML app listening on port http://localhost:${PORT}`);
});