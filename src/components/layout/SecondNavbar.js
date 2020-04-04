import React from 'react';
import {ListGroup} from "react-bootstrap";


const SecondNavbar = ({names,changeTask}) => {
    const renderItem = (name, index) => {
        return(
            <ListGroup.Item as="li" className = "secondNavItem" key={index} onClick={() => changeTask(name)}>{name}</ListGroup.Item>
        )
    }


    return(
        <ListGroup as="ul">
            {names && Object.values(names).map( (item,i) => {
                return( 
                    renderItem(item,i)
                )
            })}
        </ListGroup>
    )
} 

export default SecondNavbar;

