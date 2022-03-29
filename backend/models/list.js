// Schema for lists of app
const mongoose = require("mongoose")
const TaskSchema = require("./task").schema
// import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    title:{
        type:String
    },
    items:[TaskSchema]

});
const List = mongoose.model('lists', ListSchema);

module.exports = List;