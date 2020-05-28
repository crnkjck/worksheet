import React from 'react'
import {connect} from "react-redux";
import {Button, Modal, Form} from "react-bootstrap";
import {createFile} from "../../store/actions/repoActions"

import {
    useHistory
  } from 'react-router-dom'

const NewFile = ({handleClose,show,repo,octokit,createFile}) => {
    var name = ""
    const handleChange = (e) => {
        name = e.target.value
    }

    var history = useHistory()
    const handleSave = (e) => {
        e.preventDefault()
        createFile(name, history, repo, octokit)
        handleClose()
    }

    return(
        <Modal show={show} onHide={() => handleClose()}>
            <Modal.Header closeButton>
            <Modal.Title>Create new worksheet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter file name" onChange={handleChange}/>
                    </Form.Group>
                    <Button variant="success" type="submit" onClick={handleSave}>
                        Add
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
 
    )
}
   


const mapDispatchToProps = (dispatch) => {
    return {
        createFile: (name,history, repo, octokit) => dispatch(createFile(name,history, repo, octokit))
    }
}


const mapStateToProps = (state) => {
    return {
        repo: state.repo,
        octokit: state.auth.octokit
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(NewFile)

