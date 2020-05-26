import React, {useCallback } from "react";
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";
import CardItem from "./CardItem"
import {updateOrder,createCard} from "../../store/actions/cardActions"
import update from 'immutability-helper';



const CardList = ({cards, cardOrder, updateOrder}) => {

    var taskCards = []
    cardOrder.map((item) => {
        taskCards = [...taskCards, cards.find(e => e.id === item)]
    })

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
            <ListGroup.Item key={item.id} id = {item.id} className = "cardCell"style={{"padding":"0", "margin":"0","marginTop":"5px","marginBottom":"5px" }}>
                <CardItem 
                    id = {item.id}
                    card = {item}
                    index = {index}
                    moveCard = {moveCard}
                    setOrder = {updateOrder}
                    />
           </ListGroup.Item>  
        )
    }
   
    return(   
        <ListGroup variant="flush" className="mb-4">
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
        cardOrder: state.card.cardOrder   
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(CardList)
