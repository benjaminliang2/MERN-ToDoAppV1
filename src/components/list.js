import React, {useEffect, useState} from "react";
import {Tasks} from "./tasks"
import "../styles.css"
import {FaTrashAlt} from 'react-icons/fa'

export const List = ()=>{
    // const [tasksVisible, setTasksVisible] = useState(false)
    const [selectedList, setSelectedList] = useState(false)
    //array of objects
    const [existingLists, setExistingLists] = useState([])
    const [newList, setNewList] = useState({title:"", items:[]})
    const [newTitle, setNewTitle] = useState("")

    const addNewList = async (e)=>{
        e.preventDefault();
        
        // setExistingLists([...existingLists, newList])

        // setExistingLists(function(prevState, props){
        //     return {existingLists: [...prevState, newList]}
        // })

        setExistingLists(prevState =>([...prevState, newList]))
        // console.log(existingTasks)
        await fetch(
            'http://localhost:5000/api/v1/lists', {
                method: "post",
                body: JSON.stringify({ newTitle }),
                headers: {
                    'Content-Type': 'application/json'
                }
        })
        .then(res => res.json())
        .then(res => console.log(res))
        console.log("list was saved");
        setNewList({title:""})
        getExistingLists();

    }

    const deleteList = async (e) =>{
        console.log(e.target.value)
        const _id = e.target.value;
        await fetch('http://localhost:5000/api/v1/lists/' + _id, {
            method: 'DELETE',
        })
        .then(res => res.json()) 
        .then(res => console.log(res))
        if(selectedList._id == _id){
            setSelectedList(false)
        }
        getExistingLists();
    }
    
    useEffect(()=>{
        getExistingLists();
    }, [selectedList])

    // useEffect(() =>{
    //     // console.log(existingLists + " has changed")
    // },[existingLists])

    // useEffect(() =>{
    //     // console.log(" selectedList has changed")
    // },[selectedList])

    async function getExistingLists() {
        await fetch ('http://localhost:5000/api/v1/lists')
        .then(data => {
            return (data.json())
        })
        .then(items => {
            setExistingLists(items)
        })
        // console.log("gotexisitinlists -- completed")
    }

    

    const handleChange = (event) => {
        const {value} = event.target;
        // console.log(value)
        setNewTitle(value)
        setNewList({title:value});
    }
    const handleListSelect = (event)=>{
        const {value} = event.target;
        const listID = value;
        console.log(value)
        const tempSelectedList = existingLists.find(x => x._id === listID)
        setSelectedList(tempSelectedList)
        console.log(selectedList);
        // <Tasks selectedList = {selectedList}/>
    }
    
    const map = existingLists.map(list =>{
        
        return(<>
            <li >
                {/* if i switch the button for an h1 element to display title, i cant return the value with event.target.value */}
                <button onClick={handleListSelect} value ={list._id}>{list.title} </button>
                <button onClick={deleteList} value={list._id} className="delete-btn"><FaTrashAlt/></button>  
                {/* {list.title}                                                */}
            </li>
        </>
        )
        })
        
    return(<>
        <div className="lists-container">
            <h1>All Lists</h1>
            
            <ul>
                {map}      
            </ul>
            <form >
                <input type="text"  value={newList.title} onChange={handleChange} className="" placeholder="Add item..."/>
                <button className="" onClick={addNewList}>Add</button>
            </form>
        </div>
        <div className="tasks-container">
            {selectedList ? <Tasks selectedList = {selectedList} /> : "No List Selected"}

        </div>
        


    </>)
}