import React, { Component, useState } from 'react'
import {Form} from "react-bootstrap";




const ToDoEditor = (props) => {
    const [value, setValue] = useState(props.content);
    
    const handleChange = (event) => {
        setValue(event.target.value);
    };

   
    return (
        <div>
            <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label> Zadanie </Form.Label>
                    <Form.Control as = "textarea" value ={value} onChange={handleChange} rows="3"/>
                </Form.Group>
            </Form>
        </div>
        )
    
}

export default ToDoEditor
