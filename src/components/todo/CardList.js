import React , { useState, useCallback, useEffect } from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";
import CardItem from "./CardItem"
import {updateOrder,createCard} from "../../store/actions/cardActions"
import update from 'immutability-helper';



const CardList = ({cards, cardOrder, file, updateOrder, createCard, octokit}) => {

    //console.log(cards,cardOrder)

    //const [order, setOrder] = useState(cardOrder)

    //useEffect(() => {setOrder(cardOrder)},[cardOrder])

    var taskCards = []
    cardOrder.map((item) => {
        taskCards = [...taskCards, cards.find(e => e.id === item)]
    })
    //console.log(taskCards, cards)

    const moveCard = useCallback(
        (dragIndex, hoverIndex) => {
          const dragCard = cardOrder[dragIndex]
          updateOrder(
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
            <ListGroup.Item className = "card" key={item.id} id = {item.id} octokit={octokit}>
                <CardItem 
                    id = {item.id}
                    card = {item}
                    index = {index}
                    cardOrder = {cardOrder}
                    moveCard = {moveCard}
                    setOrder = {updateOrder}
                    file = {file}
                    />
           </ListGroup.Item>  
        )
    }

    /*
    if((cardOrder[0] === "" || cardOrder.length === 0)){
        createCard(cardOrder,taskName,0)
    }
    */
 
    return(
       
        <ListGroup variant="flush">
            {taskCards && taskCards.map( (item,i) => {
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
        createCard: (cardOrder,taskName,insertIndex) => dispatch(createCard(cardOrder,taskName,insertIndex)), 

    }
}


const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        accessToken: state.auth.accessToken,
        cards: state.card.cards,
        cardOrder: state.card.cardOrder,
        file:state.card.file
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(CardList)




/*

const ToDoList = ({cards,cardOrder, changeOrder, updateOrder, taskName, createCard}) => {

    var token = null
    var user = null

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
                <CardItem id={index}
                    card = {item}
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
        createCard(cardOrder,taskName,0)
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
        createCard: (cardOrder,taskName,insertIndex) => dispatch(createCard(cardOrder,taskName,insertIndex)), 
    }
}


export default connect(null,mapDispatchToProps)(ToDoList)
*/








  
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