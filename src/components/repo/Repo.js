import React, {useState} from 'react'
import {connect} from "react-redux";
import {Card, ListGroup, Button} from "react-bootstrap";
import {loadCards} from "../../store/actions/cardActions"
import {loadFile} from "../../store/actions/repoActions"

import {
    BrowserRouter as Router,
    Link,
    useRouteMatch
  } from "react-router-dom";


const Repo = (props) => {
 
    const {repo, pathToString} = props
    var readme = null
    var match = useRouteMatch()


/**
 * Returns each item from repo as Link to render
 * @param {*} e 
 */
    const renderListItem = (e) => {
        if(e.name === "README.md"){
            readme = e
        }
        return(
            <ListGroup.Item key={e.sha}>
                <Link to={generateLink(e)}>{e.name + (e.type === "dir" ? "/" : "")}</Link>             
            </ListGroup.Item>
        )
    }

    const generateLink = (e) => {
        var link = `/${match.params.repo}/${match.params.branch}`
        // If route is in root, add item to url
                if(match.params.path === undefined){
                    link = link + `/${e.name}`
                }else{
        // If route is nested and no file is opened, add item to url
                    if(repo.currentFile === null){
                        link = link +"/" + match.params.path + `/${e.name}`
        // If route is nested and file is opened, replace it with clicked item                
                    }else{
                        var pathArr = match.params.path.split("/")
                        pathArr.pop()
        
                        var pathAsString = pathToString(pathArr) 
                        if(pathAsString === ""){
                            link = link + `/${e.name}`
                        }else{
                            link = link + "/" + pathAsString + `/${e.name}`
                        }
                    }
                }
                return(            
                    link
                )
    }

    return(
        <div>
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
        </div>
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