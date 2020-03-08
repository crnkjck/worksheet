import React from 'react'
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import ReactMarkdown from "react-markdown"
import {Card,Form,Button, ButtonGroup} from "react-bootstrap";



const Notice = ({notice}) => {

    console.log(notice)

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleCreate = (e) => {
        e.preventDefault()
    }
    
    const handleDelete = (e) => {
        e.preventDefault()
    }
    const handleChange = (e) => {
        e.preventDefault()
    }
    
   
    return(
        <div className="card"> 
            <Card bg="white" text="black" >
                <div className="toolbar">
                    <ButtonGroup aria-label="Controls">
                        <Button  className="text-right"  variant="light" onClick={handleCreate}>+</Button>
                        <Button  className="text-right"  variant="light" onClick={handleDelete}>X</Button>
                    </ButtonGroup>
                </div>
                <Card.Body>

                    <Card.Title>{notice.title}</Card.Title>
                    <Card.Text>
                        {notice.content}
                    </Card.Text>

                    
                </Card.Body>
            </Card>
        </div>
    )}
   
   



const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(null,mapDispatchToProps)(Notice)

