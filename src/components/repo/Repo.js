import React, { useState, useEffect }  from 'react'
import {connect} from "react-redux";
import {Card, ListGroup} from "react-bootstrap";
import { Base64 } from 'js-base64';
import {loadCards} from "../../store/actions/cardActions"
import {loadFile} from "../../store/actions/repoActions"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";


const Repo = (props) => {
 
    const {repo, octokit, addToPath, loadCards, loadFile, url, pathToString} = props
    //console.log(match)
    var readme = null
    const getRepoReadme = async () =>{
        loadFile(repo, readme, "README.md", "html", octokit)
    }
    var match = useRouteMatch()


    useEffect(() => {
        console.log("repo effect works too", match)
        if(match.params.path !== undefined){
            var file = repo.currentRepoData.find(e => e.path === match.params.path)
        
            try{
                //renderItemInfo(file)
                //loadFile(repo, file, match.params.path, "raw", octokit)
                if(repo.currentFile === null){
                    //getRepoReadme()
                } 
            }catch(e){
                console.log(e)
            }
        }
        
    }, [url])

/**
 * Returns each item from repo as Link to render
 * @param {*} e 
 */
    const renderListItem = (e) => {
        if(e.name === "README.md"){
            readme = e
        }
        return(
            <ListGroup.Item key={e.sha} onClick={null/*()=>renderItemInfo(e)*/}>
                {
                    e.type === "dir" ?
                        <Link to={generateFolderLink(e)}>{e.name}/</Link>
                        //<Link to={`${props.match.url}/${e.name}`}>{e.name}</Link>
                    :
                        //<Link to={`${props.match.url}/${e.name}`}>{e.name}</Link>
                        <Link to={generateFileLink(e)/*`/${match.params.repo}/${match.params.branch}/${match.params.path ? match.params.path+"/":""}${e.name}`*/}>{e.name}</Link>
                }
                
            </ListGroup.Item>
        )
    }

/**
 * Generate router Link for folder type, custom routing
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
                var pathArr = this.props.repo.path.split("/")
                var index = pathArr.findIndex(x => x === e)
            }
            
        }
        //console.log(link,repo)
        /*
        if(match.params.path === undefined){
            link = link + `/${e.name}`
            console.log(link)
        }else{
            if(repo.currentFile){
                if(repo.currentFile.type === "dir"){
                    link = link + `/${match.params.path}/${e.name}`
                }else{
                    var tmp = match.params.path.split("/")
                    tmp.pop()
                    
                    var pathAsString = pathToString(tmp)
                    
                    link = link + pathAsString + `/${e.name}`
                    console.log(link)
                }
        }
    }*/
    

        return(            
            `${link}`
        )
    }

/**
 * Generate router Link for file type, custom routing
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
        //console.log(link)
        return(            
            `${link}`
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

/*

const Repo = (props) => {
    console.log(props)
    const {repo, octokit, addToPath, loadCards, loadFile, url} = props
    //console.log(match)
    var readme = null
    const getRepoReadme = async () =>{
        loadFile(repo, readme, "README.md", "html", octokit)
    }
    var match = useRouteMatch()
    console.log("match",match)

    useEffect(() => {
        console.log("repo effect works too")
        try{
            if(repo.currentFile === null){
                //getRepoReadme()
            } 
        }catch(e){
            console.log(e)
        }
    }, [url])


    const renderListItem = (e) => {
        if(e.name === "README.md"){
            readme = e
        }
        return(
            <ListGroup.Item key={e.sha} onClick={()=>renderItemInfo(e)}>
            {
                e.type === "dir" ?
                    <Link to={`${match.url}/${e.name}`}>{e.name}</Link>
                :
                    <Link to={`/${match.params.repo}/${match.params.branch}/${match.params.path ? match.params.path+"/":""}${e.name}`}>{e.name}</Link>
            }
            
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

*/