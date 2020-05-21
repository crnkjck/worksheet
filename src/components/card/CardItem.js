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

import { Base64 } from 'js-base64';

const CardItem = ({card, cards, cardOrder, repo,  octokit, createCard, deleteCard, updateOrder, index, moveCard, taskName, loadCards, updateCard}) => {

    const ref = useRef(null)
    const [cardState, setCardState] = useState(card) 
    const [edit, setEdit] = useState({edit:false})

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
        updateCard(cardState, cards, repo, octokit)
        setEdit({edit:false})
    }


    function checkIndex(id){
        return cardState.id === id
    }


    const handleCreate = (e,type) => {
        console.log(octokit)
        e.preventDefault()
        var insertIndex = cardOrder.findIndex(checkIndex) + 1
        createCard(cards, cardOrder, insertIndex, type, repo, octokit)
    }
    

    const handleDelete = (e) => {
        e.preventDefault()
        if(cardOrder.length > 1){
            deleteCard(cardState, cards, cardOrder, repo, octokit)
        }
    }

    const handleSolverToogle = (e) => {
        setCardState({
            ...cardState,
            solver: e
        })
    }

    const handleSolverContent = (e) => {
        setCardState({
            ...cardState,
            solverContent: e
        })
    }
    

    return(
        <div className="cardCell" id={index}>                          
            <Card border="white" bg="white" text="black" ref={ref}>
                {
                    edit.edit ? 
                        <div className="toolbar">
                            <DropdownButton id = "controls" title = "" disabled={cards.working} variant="secondary">
                            {/*
                                cardState.solver === "tableauEditor" ? 
                                    <Dropdown.Item as = "button"  onClick = {()=>handleSolverToogle("")} active>
                                        Disable TableauEditor
                                    </Dropdown.Item>
                                :
                                    <Dropdown.Item as = "button" onClick = {()=>handleSolverToogle("tableauEditor")} >
                                        Use TableauEditor
                                    </Dropdown.Item>   */  
                            }    
      
                            {/*
                                cardState.solver === "resolver" ? 
                                    <Dropdown.Item as = "button"  onClick = {()=>handleSolverToogle("")} active>
                                        Disable Resolver
                                    </Dropdown.Item>
                                :
                                    <Dropdown.Item as = "button" onClick = {()=>handleSolverToogle("resolver")} >
                                        Use Resolver
                                    </Dropdown.Item>    
                                    <Dropdown.Divider />*/ 
                            } 
          
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
                                        <Container style = {{"pointerEvents": "none", "maxHeight":"10em", 'overflowY': 'hidden','overflowX': 'hidden'}}>
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




/*
                <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control as = "textarea" value ={stateTodo.content} onChange={handleChange} rows="3"/>
                        </Form.Group>
                        <Button className="float-right" variant="secondary" type="submit">Save</Button>
                    </Form>
*/
/*


<ReactMarkdown source={this.state.content} />
                        <Editor content = {"AAAAAAAAAAAAAAAAAAAAAAAAAA " + this.state.content}/>
                        

const mapStatetoProps = (state, ownProps) => {
    const id = ownProps.match.params.id
    const todos = state.firestore.data.todos
    const todo = todos ? todos[id] : null
    return {
        todo:todo
    }
}
export default compose(
    connect(mapStatetoProps),
    firestoreConnect([{collection: "todos"}])
)(ToDo)
*/

/*


 
    state = {
        id:"",
        title:"",
        content:""
    }

    componentDidMount(){
        this.setState({
            id: this.props.todo.id,
            title : this.props.todo.title,
            content: this.props.todo.content
        })
        
    }
    

    handleChange = (e) => {
        const tempState = this.state
        tempState["content"] = e.target.value
        this.setState({tempState})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.updateTodo(this.state)
    }

    handleCreate = (e) => {
        e.preventDefault()
        this.props.createTodo({title:"", content:""})
    }
    
    handleDelete = (e) => {
        e.preventDefault()
        this.props.deleteTodo(this.state)
    }
    
    render(){
        return(

            <Card bg="dark" text="white">
                <Card.Header>
                    {this.state.title}
                    <ButtonGroup aria-label="Controls">
                        <Button  variant="outline-light" onClick={this.handleCreate}>+</Button>
                        <Button  variant="outline-light" onClick={this.handleDelete}>X</Button>
                    </ButtonGroup>
                    
                    
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label> Zadanie </Form.Label>
                                <Form.Control as = "textarea" value ={this.state.content} onChange={this.handleChange} rows="3"/>
                            </Form.Group>
                            <Button variant="primary" type="submit">Save</Button>
                        </Form>
                    </Card.Text>
                    
                </Card.Body>
            </Card>
        )}



        */











        /*
 return(
        <div className="cardCell" onDoubleClick={handleStuff}> 
        <input className = "tempCheckbox" type = "checkbox" id={stateTodo.id} onFocus={console.log("Mam focus")}/>
            
                
                <Card border="white" bg="white" text="black" ref={ref} onClick={handleStuff1}>
                    <div className="toolbar">
                        <ButtonGroup aria-label="Controls">
                            <Button  className="text-right"  variant="light" onClick={handleDelete}>X</Button>
                            <Button  className="text-right"  variant="light" onClick={handleEdit}  onFocus={console.log("Mam focus")}>O</Button>
                        </ButtonGroup>
                    </div>
                    <label for={stateTodo.id}>
                    <Card.Body >
                        {
                            edit.edit ? 
                                <Form onSubmit={handleEditSubmit} >
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <SimpleMDE  value = {stateTodo.content} options={{toolbar:  ["preview","|","bold", "italic", "strikethrough", "|", "heading", "heading-smaller","code", "quote", "|","side-by-side","fullscreen"]}}/>
                                    </Form.Group>
                                    <Button className="float-right" variant="secondary" type="submit">Save</Button>
                                </Form>
                            :
                                <ReactMarkdown source={stateTodo.content}/>
                        }
                    </Card.Body>
                    </label>
                </Card>
            
            <div className="addCard">
                <Button className="addCardButton" variant="outline-dark" onClick={handleCreate}>Add</Button>
            </div>
        </div>
    )}
        */