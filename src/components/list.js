import styled from 'styled-components'
import React from "react";
import { Draggable } from "react-beautiful-dnd";

import {BsTrash2Fill} from "react-icons/bs"



const Container = styled.div`
    ${'' /* border: 1px solid lightgrey; */}
    border-radius: 2px;
    margin-bottom: 8px;
    
`;

export const List = (props)=>{
    return(<>
        <Draggable draggableId={props.list._id} index={props.index}>
            {(provided, snapshot) =>(
                <div
                {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}> 
                    <div className="list container"  > 
                        <div className="row" value={props.list._id} onClick = {props.handleListSelect}>
                            <h3 className='list-title col'>{props.list.title}</h3>
                            <div className="col-auto">
                                <button className="delete-btn fa"  value={props.list._id} onClick={props.handleDeleteList} >   
                                    <BsTrash2Fill/>
                                </button>
                            </div>
                            
                        </div>
                                            
                    </div>
                </div>
                
            )}
            
        </Draggable>

    </>
    )
}
