const mongoose = require("mongoose")
// import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    sort:{
        type: Number
    },
    title: String,

})

const Task = mongoose.model('tasks', TaskSchema);

module.exports = Task;