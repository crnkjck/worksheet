import React , { useState, useCallback } from "react";

import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";
import ToDo from "./ToDo"
import {updateOrder,createTodo} from "../../store/actions/todoActions"

import update from 'immutability-helper';




const ToDoList = ({cards,cardOrder, changeOrder, updateOrder, taskName, createTodo}) => {
    
    const moveCard = useCallback(
        (dragIndex, hoverIndex) => {
          const dragCard = cardOrder[dragIndex]
          changeOrder(
            update(cardOrder, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard]
              ],
            }),
          )
        },
        [cardOrder],
      )
  

   

    const renderCard = (item, index) => {
        return(
            <ListGroup.Item className = "card" key={item.id}>
                <ToDo id={index}
                    todo = {item}
                    index = {index}
                    cardOrder = {cardOrder}
                    moveCard = {moveCard}
                    setOrder = {changeOrder}
                    taskName = {taskName}
                    />
           </ListGroup.Item>  
        )
    }

    if((cardOrder[0] === "" || cardOrder.length === 0) && (taskName !== "")){
        createTodo(cardOrder,taskName,0)
    }

    return(
        <ListGroup variant="flush">
            {cards && cards.map( (item,i) => {
                return( 
                    renderCard(item,i)
                )
            })}
        </ListGroup>
    )    
}


const mapDispatchToProps = (dispatch) => {
    return {
        updateOrder: (cardOrder, taskName) => dispatch(updateOrder(cardOrder,taskName)),
        createTodo: (cardOrder,taskName,insertIndex) => dispatch(createTodo(cardOrder,taskName,insertIndex)), 
    }
}


export default connect(null,mapDispatchToProps)(ToDoList)














  
/*
    if(JSON.stringify((cardOrder[0].order) !== JSON.stringify(order)) && order.length > 1){
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAaa")
        console.log("ORDER1: ",order)
        console.log("ORDER2: ",cardOrder[0].order)
        newOrder(order)
    }



    if((cardOrder[0].order !== order) && order.length > 1){
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBB")
        console.log("ORDER1: ",order)
        console.log("ORDER2: ",cardOrder[0].order)
        updateOrder(order)

    }
   */
    /*
    if(JSON.stringify(cardOrder[0].order) !== JSON.stringify(order) ){
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAaa")
        console.log("ORDER1: ",order)
        console.log("ORDER2: ",cardOrder[0].order)
        //setOrder(cardOrder[0].order)
        updateOrder(order)
        console.log("ORDER3: ",order)
        console.log("ORDER4: ",cardOrder[0].order)
        setCards(order.map(item => ({...todos[item], id: item}) ));
        
    }
    

*/