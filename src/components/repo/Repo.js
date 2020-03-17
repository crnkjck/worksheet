import React, { useState }  from 'react'
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import ReactMarkdown from "react-markdown"
import {Card,Form,Button, ButtonGroup, Accordion, ListGroup} from "react-bootstrap";



const Repo = ({item,octokit,currentRepo,currentBranch}) => {

    const [repoContents,setRepoContents] = useState([])
    const [repoDetail, setRepoDetail] = useState([])

    const getRepoData = async () => {
        var tempData = []
        var contents = await octokit.repos.getContents({
            owner:item.owner.login,
            repo:item.name
          });
          contents.data.map( (item) => {
            tempData = [...tempData,item]
        })
        setRepoContents(tempData)   
    }


    if(repoContents.length === 0){
        getRepoData()
    }
    //console.log(item)

    const renderListItem = (item) => {
        return(
            <ListGroup.Item key={item.sha} onClick={()=>renderItemInfo(item.name)}>
                {item.name}
            </ListGroup.Item>
        )
    }

    const renderItemInfo = async (fileName) => {
        console.log(fileName)
        var {data} = await octokit.repos.getContents({
            owner:item.owner.login,
            repo:currentRepo,
            path:fileName,
            ref:currentBranch,
            mediaType:{
                format:"raw"
            }
          });
          console.log(data)
          setRepoDetail(data)    
    }

    return(
        
            <Card bg="white" text="black" >

                    <Card.Body>
                        <ListGroup variant="flush">
                            {repoContents && repoContents.map( (item) => {
                                return( 
                                    renderListItem(item)
                                )
                            })}
                        </ListGroup>
                    {
                        repoDetail.length ? 
                        <div dangerouslySetInnerHTML={{__html:repoDetail}}/>       
                        :
                        <div>
                            ...
                        </div>
                    }

                    </Card.Body>
                
            </Card>
   
    )}
   
   



const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(null,mapDispatchToProps)(Repo)

