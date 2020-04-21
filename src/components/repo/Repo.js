import React, { useState, useEffect }  from 'react'
import {connect} from "react-redux";
import {Card, ListGroup} from "react-bootstrap";
import { Base64 } from 'js-base64';
import {loadCards} from "../../store/actions/cardActions"
import {loadFile} from "../../store/actions/repoActions"


const Repo = ({repo, octokit, addToPath, loadCards, loadFile,match}) => {
    console.log(match)
    var readme = null
    const getRepoReadme = async () =>{
        loadFile(repo, readme, "README.md", "html", octokit)
    }

    useEffect(() => {
        try{
            if(repo.currentFile === null){
                getRepoReadme()
            } 
        }catch(e){
            console.log(e)
            console.log("No README.md in this folder")
        }
    }, [])

    const renderListItem = (e) => {
        if(e.name === "README.md"){
            readme = e
        }
        return(
            <ListGroup.Item key={e.sha} onClick={()=>renderItemInfo(e)}>
                {e.name}
            </ListGroup.Item>
        )
    }

    const renderItemInfo = async (e) => {
        if(e.type === "dir"){
            addToPath(e.path)
        }else{
            if(e.name.includes(".json")){
                loadFile(repo, e, e.path, "raw", octokit)
            }else{
                loadFile(repo, e, e.path, "html", octokit)
            }           
        }
    }


   
    
    return(
            <Card bg="white" text="black" >

                    <Card.Body>
                        <ListGroup variant="flush">
                            {repo.currentRepoData && repo.currentRepoData.map( (e) => {
                                return( 
                                    renderListItem(e)
                                )
                            })}
                        </ListGroup>
                    {
                        repo.currentFileContent ? 
                            <div dangerouslySetInnerHTML={{__html: repo.currentFileContent.data}}/> 
                                  
                        :
                            null 
                    }
                    </Card.Body>              
            </Card> 
    )
}
   


const mapDispatchToProps = (dispatch) => {
    return {
        loadCards: (item) => dispatch(loadCards(item)),
        loadFile: (repo, file, path, format, octokit) => dispatch(loadFile(repo, file, path, format, octokit))
    }
}


const mapStateToProps = (state) => {
    return {
        repo: state.repo,
        octokit: state.auth.octokit
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Repo)

