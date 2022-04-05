require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");

const customRouter = require('./route')



// To connect with your mongoDB database
mongoose.connect(process.env.ATLAS_URI)



// For backend and express init
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {

    res.send("App is Working");

});

app.use('/api/v1/lists', customRouter)


app.listen(5000);