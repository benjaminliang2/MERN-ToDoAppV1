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
        
        // console.log("____" + Object.getOwnPropertyNames(req.body))
        console.log(req.body.newTitle)
        const list = new List({
            title: req.body.newTitle,

        });
        await list.save();

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
        const list = await List.findOneAndDelete({ _id: listID })
    } catch (error) {
        res.send(error)
    }
})

app.patch("/api/v1/lists:id", async (req,res) =>{
    const { id: listID } = req.params
    console.log(listID)
    console.log(req.body.newTask)
    List.findByIdAndUpdate({_id: listID}, {$addToSet:{items: req.body.newTask}}, (err)=>{
        if(err){
            console.log(err)
        }
    })
})
app.listen(5000);