import React , { useState } from "react";
import Notice from "./Notice"
import {connect} from "react-redux";
import {ListGroup} from "react-bootstrap";



import update from 'immutability-helper';




const NoticeList = ({notices}) => {

    console.log(notices)
   
    const [cards, setCards] = useState(Object.values(notices))

   
    

    console.log(cards)


    const renderNotice = (item, index) => {
        return(
            <ListGroup.Item key={item.id}>
                <Notice 
                    notice = {item}
                    index = {index}
                    />
           </ListGroup.Item>  
        )
    }
   
    return(
        
        <ListGroup variant="flush">
            {cards && cards.map((item,i) => {
                return( 
                    renderNotice(item,i)
                )
            })}

        </ListGroup>
      
    
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}


export default connect(null,mapDispatchToProps)(NoticeList)