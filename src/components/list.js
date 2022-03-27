import React, {useEffect, useState} from "react";
import { Data } from "../exampleData";
import {Tasks} from "./tasks"
//deconstruct and external default data
const {title, items} = Data


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
        await fetch('http://localhost:5000/api/v1/lists' + _id, {
            method: 'DELETE',
        })
        .then(res => res.json()) 
        .then(res => console.log(res))
        getExistingLists();
    }
    
    useEffect(()=>{
        getExistingLists();
    }, [selectedList])

    async function getExistingLists() {
        await fetch ('http://localhost:5000/api/v1/lists')
        .then(data => {
            return (data.json())
        })
        .then(items => {
            setExistingLists(items)
        })
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
                <button onClick={deleteList} value={list._id}>delete this list</button>                                                 
            </li>
        </>
        )
        })
        
    return(<>

        <h1>All Lists</h1>
        
        <ul>
            {map}      
        </ul>
        <form >
            <input type="text" value={newList.title} onChange={handleChange}/>
            <button onClick={addNewList}>Add</button>
        </form>
        {selectedList ? <Tasks selectedList = {selectedList} /> : "no list selected"}
        


    </>)
}