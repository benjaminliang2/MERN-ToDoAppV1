import React, {useState, useEffect} from 'react'

export const Tasks = ({selectedList}) => {
  const title = selectedList.title;
  const allTasks = selectedList.items;
  const _id = selectedList._id;
  
  const [existingTasks,setExistingTasks] =useState(allTasks)
  const [newTask, setNewTask] = useState('Add new task')
  // console.log(allTasks[0]);
  // console.log(existingTasks)


  useEffect(()=>{
    setExistingTasks(allTasks)
  },[selectedList])
  
  const addNewTask = async (e)=>{
    e.preventDefault();
    setExistingTasks([...existingTasks, newTask])
    await fetch('http://localhost:5000/api/v1/lists' + _id, {
      method: 'PATCH',
      body: JSON.stringify({newTask}),
      headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(res => res.json())
    .then(res => console.log(res))
    setNewTask("")
  }
  
  // const deleteTask =()=>{

  // }
  
  const map = existingTasks.map((task) =>{
    return(<>
      <h3>{task}</h3>
      {/* <button onClick={deleteTask}>delete task</button> */}
    </>)
    
  })


  

  
  const handleChange = (event)=>{
    setNewTask(event.target.value)
  }
  // console.log(title)
  return (<>
    <h1>{title}</h1>
    <ul>{map}</ul>
    
    <form >
            <input type="text" value={newTask} onChange={handleChange}/>
            <button onClick={addNewTask}>Add</button>
    </form>
  </>
      
  )
}

