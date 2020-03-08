import React from 'react'
import {Row, Col} from "react-bootstrap";



const Home = () => {
  return (
     <Row>
      <Col sm = {2}/>
      <Col sm = {8}>  
        <div className="mainText">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae repudiandae repellat illo magni eligendi cupiditate voluptates eius nam voluptate. Incidunt nihil ullam quae quia officia quaerat, deserunt eligendi explicabo totam?</p>                          
        </div>
      </Col>
      <Col sm = {2}/>         
    </Row>
   
  )
}

export default Home


/*
 {
                        edit.edit ? 
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as = "textarea" value ={stateTodo.assignment} onChange={handleEditChange} rows="3"/>
                                </Form.Group>
                                <Button className="float-right" variant="secondary" type="submit">Save</Button>
                            </Form>
                        :
                            <Card.Text>{stateTodo.assignment} </Card.Text>
                }
                */