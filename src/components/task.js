import styled from "styled-components"
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import {BsTrash2Fill} from "react-icons/bs"


const Container = styled.div`
    ${'' /* border: 1px solid lightgrey; */}
    border-radius: 2px;
    margin-bottom: 8px;
    
`;


export const Task = (props)=>{
    return(<>
        <Draggable draggableId={props.task._id} index={props.index}>
            {(provided, snapshot) =>(
                <div
                {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}> 
                    <div className="task"> 
                        <h3>{props.task.title}</h3>
                        <button className="delete-btn fa"  value={props.task._id} onClick={props.handleDeleteTask} >   
                            <BsTrash2Fill/>
                            {/* <span aria-hidden="true">&times;</span> */}
                            {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
                        </button>
                        
                                            
                    </div>
                </div>
                
            )}
            
        </Draggable>

    </>
    )
}