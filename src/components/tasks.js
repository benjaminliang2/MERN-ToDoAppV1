import React, {useState, useEffect} from 'react'
import {Task} from "./task"
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export const Tasks = ({selectedList}) => {
  const title = selectedList.title;
  const currentListId = selectedList._id;
  
  const [existingTasks,setExistingTasks] =useState([])
  const [newTaskObject, setNewTaskObject] = useState({title: ''})
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [tasksSize, setTasksSize] = useState(0)
 
  useEffect(()=>{
    // console.log("render tasks comp")
    getAllTasks()
  }, [selectedList])

  async function getAllTasks(){
    // console.log("getting all tasks pending")
    await fetch("http://localhost:5000/api/v1/lists/" + currentListId)
    .then(res => {
      return res.json()
    })
    .then(res => {
      setExistingTasks(res[0].items)
      setTasksSize(res[0].items.length)
    })
    
    // console.log(existingTasks)
  }

  const addNewTask = async (e)=>{
    e.preventDefault();

    if (tasksSize === 0){
      var sort = 1;
    } else {
        var sort = existingTasks[tasksSize-1].sort + 1 
    }

    setExistingTasks([...existingTasks, newTaskObject])
    await fetch('http://localhost:5000/api/v1/lists/' + currentListId, {
      method: 'PATCH',
      body: JSON.stringify({newTaskTitle, sort}),
      headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(res => res.json())
    .then(res => console.log(res))
    setNewTaskObject({title:""})
    getAllTasks();

  }
  
  const deleteTask = async (event)=>{
    event.preventDefault();
    const taskId = event.target.value;
    await fetch('http://localhost:5000/api/v1/lists/' + currentListId + '/' + taskId, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => console.log(res))
    getAllTasks();
  }
  
  const updateTasksSortOrder = (tasks) =>{
    tasks.forEach(task =>{
      const id = task._id;
      const sort = task.sort
      fetch('http://localhost:5000/api/v1/lists/' + currentListId + '/' + id, {
        method: 'PATCH',
        body: JSON.stringify( {sort}),
        headers: {
          'Content-Type': 'application/json'
        } 
      })
    })
  }

  // const map = existingTasks.map((task) =>{
  //   // console.log("task ID # = " +task._id)
  //   return(<>
  //     <h3>{task.title}</h3>
  //     <button value={task._id} onClick={deleteTask}>delete task</button>
  //   </>)
    
  // })


  

  
  const handleChange = (event)=>{
    setNewTaskObject({title: event.target.value})
    setNewTaskTitle(event.target.value);

  }
  const handleOnDragEnd= (result)=>{
    const {destination, source, draggableId} = result;
    console.log(draggableId)
    //user dropped item somewhere out of context
    if(!destination) {
        return;
    }
    //user dropped item back to where it was previously. 
    if(destination.droppableId === source.droppableId && destination.index===source.index){
        return
    }

    const items = Array.from(existingTasks);
    // const newListIds = existingLists.map(a => a._id)
    //remove 1 element starting from the source index and return as reorderedItem
    const [reorderedItem] = items.splice(source.index,1);
    // //remove 0 elements starting from the dest index, and also insert the draggable 
    items.splice(destination.index,0, reorderedItem)
    // console.log(items)
    //store new order of lists. 
    //persist new order in DB
    //idk setexistinglists will wait for the foreach loop to finish???????????????? it should be cause its not async
    items.forEach((item, index) => {item.sort = index})
    setExistingTasks(items)
    updateTasksSortOrder(items)
  }
  return (<>
  
      <h2>{title}</h2>
      {/* <ul>{map}</ul> */}
      
      <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="listsection">
              {(provided) =>(
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                      {existingTasks.map((task,index)=> <Task key={task._id} task = {task} index = {index} handleDeleteTask={deleteTask}/> )}                           
                      {provided.placeholder}
                  </div>
              )}
          </Droppable>
      </DragDropContext>




      <form className='add-control' >
        <div className="form-group">
            <input className='form-control-sm' type="text" value={newTaskObject.title} onChange={handleChange} placeholder="Add New Task..." />
            <button onClick={addNewTask}>
              <i className="fa fa-plus"></i>
            </button>
        </div>
              
      </form>
  </>
      
  )
}

