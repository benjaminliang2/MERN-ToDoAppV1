import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from 'styled-components'
import {BsXCircle} from "react-icons/bs"


const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: white;
    
`;

export const List = (props)=>{
    return(<>
        <Draggable draggableId={props.list._id} index={props.index}>
            {(provided, snapshot) =>(
                <Container
                {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}> 
                    <div value={props.list._id} onClick = {props.handleListSelect} className="list"> 
                        <button className="btn-primary" value={props.list._id} onClick={props.handleDeleteList} >                          
                            
                        </button>
                        {props.list.title}                        
                    </div>
                </Container>
            )}
        </Draggable>

    </>
    )
}
