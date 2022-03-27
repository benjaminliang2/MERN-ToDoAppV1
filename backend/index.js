require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require("cors");


// To connect with your mongoDB database
mongoose.connect(process.env.ATLAS_URI)

// Schema for lists of app
const ListSchema = new mongoose.Schema({
    title:{
        type:String
    },
    items:[]

});
const List = mongoose.model('lists', ListSchema);
// User.createIndexes();

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
        List.find({}, (err,allLists) => {
           res.json(allLists)
        });
    } catch (error) {
        
    }
})

//create a list 
app.post("/api/v1/lists", async (req, resp) => {
    try {
        const list = new List({
            title: req.body.newTitle,
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
app.delete("/api/v1/lists:id", async (req,res)=>{
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

//create task within a list
app.patch("/api/v1/lists:id", async (req,res) =>{
    // console.log(listID)
    // console.log(req.body.newTask)
    try {
        const { id: listID } = req.params
        let result = await List.findByIdAndUpdate({_id: listID}, {$addToSet:{items: req.body.newTask}}, {returnDocument: 'after'})
        if(result){
            res.send(result)
        }
    } catch (error) {
        console.log(error)
    }
})

//delete a task within a list

app.listen(5000);