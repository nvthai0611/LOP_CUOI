const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./config/db');
const app = express();
require('dotenv').config();
const apiRouter = require("./src/routers/api")
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", apiRouter)
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
});