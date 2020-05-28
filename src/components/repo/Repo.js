import React, {useState} from 'react'
import {connect} from "react-redux";
import {Card, ListGroup, Button} from "react-bootstrap";
import {loadCards} from "../../store/actions/cardActions"
import {loadFile} from "../../store/actions/repoActions"

import NewFile from "./NewFile"

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
                {
                    e.type === "dir" ?
                        <Link to={generateFolderLink(e)}>{e.name}/</Link>
                    :
                        <Link to={generateFileLink(e)}>{e.name}</Link>
                }              
            </ListGroup.Item>
        )
    }


/**
 * Generate router Link for folder type, custom links
 * @param {*} e 
 */
    const generateFolderLink = (e) =>{
        var link = `/${match.params.repo}/${match.params.branch}`
// If route is in root, add item to url
        if(match.params.path === undefined){
            link = link + `/${e.name}`
        }else{
// If route is nested and no file is opened, add folder to url
            if(repo.currentFile === null){
                link = link +"/" + match.params.path + `/${e.name}`
// If route is nested and file is opened, replace it with clicked folder                
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


/**
 * Generate router Link for file type, custom links
 * @param {*} e 
 */
    const generateFileLink = (e) => {
        var link = `/${match.params.repo}/${match.params.branch}`
// If route is in root, add item name to path
        if(match.params.path === undefined || match.params.path === ""){
            link = link + `/${e.name}`
// If route is nested and last item in url is file replace it with clicked file             
        }else{
            var tmp = match.params.path.split("/")
            if(repo.currentFile){
                if(repo.currentFile.type !== "dir"){
                    tmp.pop()
                }
            }
  
            var pathAsString = pathToString(tmp)            
            if(pathAsString === ""){
                link = link + `/${e.name}`
            }else{
                link = link + "/" + pathAsString + `/${e.name}`
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