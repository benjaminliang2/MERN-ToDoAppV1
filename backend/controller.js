
const List = require("./models/list")
const Task = require("./models/task")
const mongoose = require("mongoose")

const getAllLists =  async(req, res) =>{
    console.log("get request to display list")
    try {
        let result = await List.find({}).sort({sort:1});
        res.json(result)

    } catch (error) {
        
    }
}

const updateList =  async(req, res) =>{
    try {
        const {id, sort} = req.body;
        let result = await List.findByIdAndUpdate({_id: id}, {sort: sort})
        res.json(result)

    } catch (error) {
        
    }
}

const createList =  async (req, res) => {
    try {
        const list = new List({
            title: req.body.newTitle,
            sort: req.body.sort
        });
        let result = await list.save();
        if (result){
            console.log("saved successfully")
            res.send(result)
        }

    } catch (e) {
        res.send("Something Went Wrong");
        console.log("something went wrong ---" + e)
    }
}

const deleteList =  async (req,res)=>{
    try {
        console.log(req.params)
        const { listid: listID } = req.params
        let result = await List.findOneAndDelete({ _id: listID })
        if (result){
            res.send(result)
        }
    } catch (error) {
        res.send(error)
    }
}


const getAllTasks =  async (req,res) =>{
    try {  
        let result = await List.aggregate([
            {
                $match :{_id:  new mongoose.mongo.ObjectId(req.params.listid) }
            },{
                $unwind: {
                    "path" : "$items",
                    "preserveNullAndEmptyArrays": true
                }
            },{
                $sort: {
                    "items.sort": 1
                }
            },{
                $group: {
                    _id: "$_id",
                    items: {
                        $push: "$items"
                    }
                }
            }
            
        ])
        console.log(result)
        res.json(result);
    } catch (error) {
            res.send(error)
            console.log("Error getting all tasks in selected list----" + error)
    }


}


const createTask = async (req,res) =>{
    try {
        const { listid: listID } = req.params
        let newTask = new Task({title:req.body.newTaskTitle, sort: req.body.sort })
        let result = await List.findByIdAndUpdate({_id: listID}, {$addToSet:{items: newTask}}, {returnDocument: 'after'})
        if(result){
            res.send(result)
        }
    } catch (error) {
        console.log(error)
    }
}

const updateTask = async (req,res)=>{
    try {
        const {listid: listID, taskid: taskID} = req.params;
        let result = await List.findOneAndUpdate(
            {"_id": listID, "items._id":taskID}, 
            {$set: 
                {"items.$.sort": req.body.sort}
            })
        res.json(result)

    } catch (error) {
        
    }


}

const deleteTask =  async (req,res)=>{
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
}

module.exports = {
    getAllLists,
    updateList,
    createList, 
    deleteList,
    getAllTasks, 
    createTask,
    updateTask,
    deleteTask
}