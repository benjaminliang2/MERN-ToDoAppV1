const express = require('express')
const router = express.Router()

const {    
    getAllLists,
    updateList,
    createList, 
    deleteList,
    getAllTasks, 
    createTask,
    updateTask,
    deleteTask}
= require('./controller')

router.route('/').get(getAllLists).patch(updateList).post(createList)
router.route('/:listid').delete(deleteList).get(getAllTasks).patch(createTask)
router.route('/:listid/:taskid').patch(updateTask).delete(deleteTask)

module.exports = router