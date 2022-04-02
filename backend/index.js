require('dotenv').config()
const List = require("./models/list")
const Task = require("./models/task")
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");



// To connect with your mongoDB database
mongoose.connect(process.env.ATLAS_URI)



// For backend and express

app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

    resp.send("App is Working");

});

//get (display) all lists
app.get("/api/v1/lists", async(req, res) =>{
    console.log("get request to display list")
    try {
        let result = await List.find({}).sort({sort:1});
        res.json(result)

    } catch (error) {
        
    }
})

//update a list
//not sure what best practices are for this
app.patch("/api/v1/lists", async(req, res) =>{
    try {
        const {id, sort} = req.body;
        let result = await List.findByIdAndUpdate({_id: id}, {sort: sort})
        res.json(result)

    } catch (error) {
        
    }
})

//create a list 
app.post("/api/v1/lists", async (req, resp) => {
    try {
        const list = new List({
            title: req.body.newTitle,
            sort: req.body.sort
        });
        let result = await list.save();
        if (result){
            console.log("saved successfully")
            resp.send(result)
        }

    } catch (e) {
        resp.send("Something Went Wrong");
        console.log("something went wrong ---" + e)
    }
});

//delete a list
app.delete("/api/v1/lists/:id", async (req,res)=>{
    try {
        console.log(req.params)
        const { id: listID } = req.params
        let result = await List.findOneAndDelete({ _id: listID })
        if (result){
            res.send(result)
        }
    } catch (error) {
        res.send(error)
    }
})


//get all tasks within a list
app.get("/api/v1/lists/:id", async (req,res) =>{
    try {
        const { id: listID } = req.params
        let result = List.findOne({_id: listID}, (err, list)=>{
            res.json(list)
        })
        // if(result){
        //     res.send(result)
        // }
    } catch (error) {
        res.send(error)
        console.log("Error getting all tasks in selected list----" + error)
    }

})

//create task within a list
app.patch("/api/v1/lists/:id", async (req,res) =>{
    // console.log(listID)
    // console.log(req.body.newTask)
    try {
        const { id: listID } = req.params
        let newTask = new Task({title:req.body.newTaskTitle})
        let result = await List.findByIdAndUpdate({_id: listID}, {$addToSet:{items: newTask}}, {returnDocument: 'after'})
        if(result){
            res.send(result)
        }
    } catch (error) {
        console.log(error)
    }
})

//delete a task within a list
app.delete("/api/v1/lists/:listid/:taskid", async (req,res)=>{
    console.log(req.params)
    try {
        const {listid: listID, taskid: taskID} = req.params;
        let result = await List.findOneAndUpdate({"_id": listID}, {$pull: {"items": {"_id": taskID}}}, {returnDocument: 'after'} )
        if (result){
            console.log("success")
            res.send(result)
        }

    } catch (error) {
        res.send(error)
        console.log("error deleting task---" + error)
    }
})

app.listen(5000);