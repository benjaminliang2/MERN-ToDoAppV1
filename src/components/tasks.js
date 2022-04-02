import React, {useState, useEffect} from 'react'

export const Tasks = ({selectedList}) => {
  const title = selectedList.title;
  const currentListId = selectedList._id;
  
  const [existingTasks,setExistingTasks] =useState([])
  const [newTaskObject, setNewTaskObject] = useState({title: ''})
  const [newTaskTitle, setNewTaskTitle] = useState("")

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
      setExistingTasks(res.items)
    })
    
    // console.log(existingTasks)
  }

  const addNewTask = async (e)=>{
    e.preventDefault();
    setExistingTasks([...existingTasks, newTaskObject])
    await fetch('http://localhost:5000/api/v1/lists/' + currentListId, {
      method: 'PATCH',
      body: JSON.stringify({newTaskTitle}),
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
  
  const map = existingTasks.map((task) =>{
    // console.log("task ID # = " +task._id)
    return(<>
      <h3>{task.title}</h3>
      <button value={task._id} onClick={deleteTask}>delete task</button>
    </>)
    
  })


  

  
  const handleChange = (event)=>{
    setNewTaskObject({title: event.target.value})
    setNewTaskTitle(event.target.value);

  }
  // console.log(title)
  return (<>
  
      <h1>{title}</h1>
      <ul>{map}</ul>
      
      <form className='add-control' >
        <div className="form-group">
            <input className='form-control-sm' type="text" value={newTaskObject.title} onChange={handleChange} placeholder="Add New Task..." />
            <button onClick={addNewTask}>
              <i class="fa fa-plus"></i>
            </button>
        </div>
              
      </form>
  </>
      
  )
}

