import React, { useState, useRef, useEffect } from 'react'
import {connect} from "react-redux";
import ReactMarkdown from "react-markdown"
import {Card,Form,Button, ButtonGroup, DropdownButton, Dropdown, Container} from "react-bootstrap";
import {updateCard,createCard,deleteCard, updateOrder, loadCards} from "../../store/actions/cardActions"
import {useDrag, useDrop } from "react-dnd"
import { ItemTypes } from '../../constants/ItemTypes';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import Solver from "../solvers/Solver.js"

const CardItem = ({card, cards, cardOrder, repo,  octokit, createCard, deleteCard, updateOrder, index, moveCard, taskName, loadCards, updateCard}) => {

/**
 * Check if card should be closed or open on initialization
 */
    const editOnLoad = () => {
        if(card.content === "" && card.solver === ""){
            return true
        }else{
            return false
        }
    }

    const ref = useRef(null)
    const [cardState, setCardState] = useState(card) 
    const [edit, setEdit] = useState({edit: editOnLoad()})

    useEffect(() => {setCardState(card)},[card])

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item, monitor){
            if (!ref.current){
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            if(dragIndex === hoverIndex){
                return
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
              }
          
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
              }
            
            moveCard(dragIndex, hoverIndex)
            item.index = hoverIndex

        },
    })


    const [{isDragging}, drag] = useDrag({
        item : {type : ItemTypes.CARD,card,index},
        canDrag: !edit.edit,
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        }),
    })
   

    drag(drop(ref))

    
    const handleBeginEdit = () => {
         setEdit({edit:true})    
    }
    

    const handleChange = (e) => {
        setCardState({...cardState,
            content: e})
    }


    const handleEditSubmit = (e) => {
        e.preventDefault();     
        let newSolverContent = tempContent === "" ? cardState.solverContent : tempContent      
        let tempCard = {...cardState, solverContent: newSolverContent}
        updateCard(tempCard, cards, repo, octokit)
        setEdit({edit:false})
        setCardState(tempCard)
    }


    function checkIndex(id){
        return cardState.id === id
    }


    const handleCreate = (e,type) => {
        e.preventDefault()
        let insertIndex = cardOrder.findIndex(checkIndex) + 1
        createCard(cards, cardOrder, insertIndex, type, repo, octokit)
    }
    

    const handleDelete = (e) => {
        e.preventDefault()
        if(cardOrder.length > 1){
            deleteCard(cardState, cards, cardOrder, repo, octokit)
        }
    }
    let tempContent = ""
    const handleSolverContent = (e) => {
        tempContent = e
        setCardState({...cardState, solverContent:e})
    }
    
    return(
        <div className="cardCellData" id={index} >                          
            <Card border="white" bg="white" text="black" ref={ref}>
                {
                    edit.edit ? 
                        <div className="toolbar">
                            <DropdownButton id = "controls" title = "" disabled={cards.working} variant="secondary">
                                <Dropdown.Item as = "button" onClick={handleDelete}>
                                    Delete Card
                                </Dropdown.Item>               
                            </DropdownButton>
                        </div>
                    :
                        null
                }
                
                {
                    edit.edit ? 
                        <Card.Body className="cardEditor" style={{'overflowY': 'auto','overflowX': 'auto'}}>       
                                {
                                cardState.solver ? 
                                    <Solver type = {cardState.solver} content = {cardState.solverContent} handleChange={handleSolverContent}/>
                                : 
                                    <Container >
                                        <SimpleMDE onChange={handleChange} value = {cardState.content} options={{toolbar:  ["preview","|","bold", "italic", "strikethrough", "|", "heading", "heading-smaller","code", "quote", "|","side-by-side","fullscreen"]}}/>                                            
                                        <ReactMarkdown source={cardState.content}/>
                                    </Container>
                            }
                            <Button className="float-right" variant="secondary" disabled={cards.working} onClick={handleEditSubmit}>Save</Button>                              
                        </Card.Body>       
                    :
                        <Card.Body onDoubleClick={handleBeginEdit}>
                            {
                                cardState.solver ? 
                                    <Container title="" style = {{"opacity":"50%", "pointerEvents": "none", "maxHeight":"10em", 'overflowY': 'hidden','overflowX': 'hidden'}}>
                                        <Solver type = {cardState.solver} content = {cardState.solverContent} handleChange={handleSolverContent}/>    
                                    </Container>                                       
                                :
                                    <ReactMarkdown source={cardState.content}/>
                            }                              
                        </Card.Body>                          
                }   
            </Card>        
            <div className="addCard">
                <Dropdown as={ButtonGroup} drop={"up"} disabled={cards.working}>
                    <Button className="addCardButton" variant="outline-dark" onClick={(e) => handleCreate(e,"")}  disabled={cards.working}>Add</Button>

                    <Dropdown.Toggle className="addCardButton" split variant="outline-dark" id="dropdown-split-basic"  disabled={cards.working}/>

                    <Dropdown.Menu>
                        <Dropdown.Item  as="button" onClick={(e) => handleCreate(e,"tableauEditor")}>TableauEditor</Dropdown.Item>
                        <Dropdown.Item  as="button" onClick={(e) => handleCreate(e,"resolver")}>Resolver</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )}
   
   

const mapDispatchToProps = (dispatch) => {
    return {
        updateCard: (card, cards, repo, octokit) => dispatch(updateCard(card, cards,repo, octokit)),
        createCard: (cards, cardOrder, insertIndex, type, repo, octokit) => dispatch(createCard(cards, cardOrder, insertIndex, type, repo, octokit)),
        deleteCard: (stateCard, cards, cardOrder, repo, octokit) => dispatch(deleteCard(stateCard, cards, cardOrder, repo, octokit)),
        updateOrder: (cardOrder,taskName) => dispatch(updateOrder(cardOrder,taskName)),
        loadCards:(item) => dispatch(loadCards(item))

    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth,
        repo: state.repo,
        octokit: state.auth.octokit,
        cards: state.card,
        cardOrder: state.card.cardOrder     
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CardItem)