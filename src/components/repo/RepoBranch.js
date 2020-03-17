import React, { useState }  from 'react'
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import ReactMarkdown from "react-markdown"
import {Card,Form,Button, ButtonGroup, Accordion, ListGroup} from "react-bootstrap";



const RepoBranch = ({setRepoDetails,repo,octokit}) => {
    
    const [branches,setBranches] = useState([])

    const getRepoBranches = async (item) => {
        var tempData = []

        var repoBranches = await octokit.repos.listBranches({
            owner: repo.owner.login,
            repo: repo.name
          });
          repoBranches.data.map( (item) => {
            tempData = [...tempData,item]
        })

        setBranches(tempData)
    }

    if(branches.length === 0){
        getRepoBranches()
        }

    const renderListItem = (item) => {
        return(
            <ListGroup.Item key={item.sha} onClick={()=>setRepoDetails(item.name,repo.name)}>
                {item.name}
            </ListGroup.Item>
        )
    }

    return(
        <div className="card"> 
            <Card bg="white" text="black" >

                <Accordion.Toggle as={Card.Header} eventKey={repo.id}>
                   {repo.name}
                </Accordion.Toggle>
           
                <Accordion.Collapse eventKey={repo.id}>
                    <Card.Body>
                        <ListGroup variant="flush">
                            {branches && branches.map( (item) => {
                                return( 
                                    renderListItem(item)
                                )
                            })}
                        </ListGroup>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </div>
    )}
   
   

export default RepoBranch

