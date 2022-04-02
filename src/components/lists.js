import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Tasks} from "./tasks"
import "../styles.css"
import {List} from './list'
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {Button, Icon} from "semantic-ui-react"


let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}

const date = new Date().toLocaleDateString("en-us", options);
console.log(date)


export const Lists = ()=>{
    // const [tasksVisible, setTasksVisible] = useState(false)
    const [selectedList, setSelectedList] = useState(false)
    //array of objects
    const [existingLists, setExistingLists] = useState([])
    const [newList, setNewList] = useState({title:"", items:[]})
    const [newTitle, setNewTitle] = useState("")
    const [listSize, setListSize] = useState(0)


    const addNewList = async (e)=>{
        e.preventDefault();
        
        // setExistingLists([...existingLists, newList])

        // setExistingLists(function(prevState, props){
        //     return {existingLists: [...prevState, newList]}
        // })
        if (listSize === 0){
            var sort = 1;
        } else {
            var sort = existingLists[listSize-1].sort + 1 
        }
        setExistingLists(prevState =>([...prevState, newList]))
        // console.log(existingTasks)
        await fetch(
            'http://localhost:5000/api/v1/lists', {
                method: "post",
                body: JSON.stringify({ newTitle, sort }),
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
        e.stopPropagation();
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


    async function getExistingLists() {
        await fetch ('http://localhost:5000/api/v1/lists')
        .then(data => {
            return (data.json())
        })
        .then(items => {
            setExistingLists(items)
            // console.log(existingLists)
            setListSize(items.length)
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
        const listID = event.target.getAttribute("value");
        console.log(listID + "   selected")
        const tempSelectedList = existingLists.find(x => x._id === listID)
        setSelectedList(tempSelectedList)
    }
    


    

    // const [testData, setTestData] = useState(testdata2)
    // const AllLists = styled.div`
    //     padding:L 8px
    // `;

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


    const updateListsSortOrder = (lists)=>{
        //will update all sort values even if some havent changed. optimize later??
        lists.forEach(list =>{
            const id = list._id;
            const sort = list.sort
            fetch ('http://localhost:5000/api/v1/lists/', {
                method: 'PATCH',
                body: JSON.stringify({id, sort}),
                headers: {
                    'Content-Type': 'application/json'
                }       
            })
        })
        
    }


    const handleOnDragEnd = (result)=>{ 
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

        const items = Array.from(existingLists);
        // const newListIds = existingLists.map(a => a._id)
        //remove 1 element starting from the source index and return as reorderedItem
        const [reorderedItem] = items.splice(source.index,1);
        // //remove 0 elements starting from the dest index, and also insert the draggable 
        items.splice(destination.index,0, reorderedItem)
        console.log(items)
        //store new order of lists. 
        //persist new order in DB
        //idk setexistinglists will wait for the foreach loop to finish???????????????? it should be cause its not async
        items.forEach((item, index) => {item.sort = index})
        setExistingLists(items)
        updateListsSortOrder(items)

    }

    return<>
        <h1>{date} </h1>

        <div className="lists-container"> 
            <h2>Projects</h2>    
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="listsection">
                    {(provided) =>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {existingLists.map((list,index)=> <List key={list._id} list = {list} index = {index} handleDeleteList={deleteList} handleListSelect={handleListSelect}/> )}                           
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>


            <form className="add-control" >
                <div className="form-group">
                    <input className="form-control-sm" type="text" value={newList.title} onChange={handleChange} placeholder="Add new list..."/>                    
                    <button className="add-list-button" onClick={addNewList}>
                        <i class="fa fa-plus"></i>
                    </button>
                </div>    
            </form>
                
        </div>  

        <div className="tasks-container">
            {selectedList ? <Tasks selectedList =  {selectedList} /> : <h2>No List Selected</h2> }

        </div>
            
        

    </>
}