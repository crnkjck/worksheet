import React, { useState, useRef, useEffect } from 'react'
import {connect} from "react-redux";

import ReactMarkdown from "react-markdown"
import {Card,Form,Button, ButtonGroup} from "react-bootstrap";
import {updateTodo,createTodo,deleteTodo, updateOrder} from "../../store/actions/todoActions"
import {useDrag, useDrop } from "react-dnd"
import { ItemTypes } from '../../constants/ItemTypes';


import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";


const ToDo = ({todo,createTodo,updateTodo,deleteTodo, updateOrder, cardOrder, index,moveCard, taskName}) => {

    const ref = useRef(null)
    const [stateTodo, setStateTodo] = useState(todo) 
    const [edit, setEdit] = useState({edit:false})


    
    const [, drop] = useDrop({
        accept: ItemTypes.TODO,
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
        item : {type : ItemTypes.TODO,todo,index},
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        }),
    })
   
    drag(drop(ref))


    const handleBeginEdit = () => {
         setEdit({edit:true})
         
    }
    
    const handleChange = (e) => {
        setStateTodo({...stateTodo,
            content: e})
    }


    const handleEditSubmit = (e) => {
        e.preventDefault();
        updateTodo(stateTodo)
        setEdit({edit:false})
    }


    function checkIndex(id){
        return stateTodo.id === id
    }

    const handleCreate = (e) => {
        e.preventDefault()
        var insertIndex = cardOrder.findIndex(checkIndex) + 1
        createTodo(cardOrder,taskName,insertIndex)
    }
    

    const handleDelete = (e) => {
        e.preventDefault()
        

        if(cardOrder.length > 1){

            deleteTodo(stateTodo)
            var array = [...cardOrder]; // make a separate copy of the array
            var index = array.indexOf(stateTodo.id)

            if (index !== -1) {
                array.splice(index, 1);
                updateOrder(array,taskName)
            }
        }
    }
    

    return(
        <div className="cardCell" id={index}>             
                
                <Card border="white" bg="white" text="black" ref={ref}>
                    <div className="toolbar">
                        <ButtonGroup aria-label="Controls">
                            <Button  className="text-right"  variant="light" onClick={handleDelete}>X</Button>
                            <Button  className="text-right"  variant="light" onClick={handleBeginEdit}>O</Button>
                        </ButtonGroup>
                    </div>
                    
                    <Card.Body  onClick={handleBeginEdit}>
                        {
                            edit.edit ? 
                                <Form onSubmit={handleEditSubmit} >
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <SimpleMDE onChange={handleChange} value = {stateTodo.content} options={{toolbar:  ["preview","|","bold", "italic", "strikethrough", "|", "heading", "heading-smaller","code", "quote", "|","side-by-side","fullscreen"]}}/>
                                    </Form.Group>
                                    <Button className="float-right" variant="secondary" type="submit">Save</Button>
                                    <ReactMarkdown source={stateTodo.content}/>
                                </Form>
                                
                            :
                                <ReactMarkdown source={stateTodo.content}/>
                        }
                    </Card.Body>
                   
                </Card>
            
            <div className="addCard">
                <Button className="addCardButton" variant="outline-dark" onClick={handleCreate}>Add</Button>
            </div>
        </div>
    )}
   
   

/*
                <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Control as = "textarea" value ={stateTodo.content} onChange={handleChange} rows="3"/>
                        </Form.Group>
                        <Button className="float-right" variant="secondary" type="submit">Save</Button>
                    </Form>
*/

const mapDispatchToProps = (dispatch) => {
    return {
        updateTodo: (todo) => dispatch(updateTodo(todo)),
        createTodo: (cardOrder,taskName,insertIndex) => dispatch(createTodo(cardOrder,taskName,insertIndex)),
        deleteTodo: (todo) => dispatch(deleteTodo(todo)),
        updateOrder: (cardOrder,taskName) => dispatch(updateOrder(cardOrder,taskName)) 

    }
}
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
export default connect(null,mapDispatchToProps)(ToDo)




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