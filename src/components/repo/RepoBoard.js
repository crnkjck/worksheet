import React, {Component} from "react";
import {Container, Row, Col, Form, Button, DropdownButton, Dropdown, Breadcrumb, ListGroup} from "react-bootstrap";
import Repo from "./Repo"
import CardList from "../card/CardList"
import {connect} from "react-redux";

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import {updateRepo, findUserRepos, resetRepoData, setCurrentRepo, setCurrentRepoData, loadFile, loadFromUrl} from "../../store/actions/repoActions"
import {pathToRegexp} from "path-to-regexp"

//import Editor from "../../../build/elm/Editor.js"
//import Editor from "editor/Editor.js"
//import Elm from 'react-elm-components'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class RepoBoard extends Component{

    componentDidMount(){
        console.log("mounted", this.props)
// Load logged user repos
        if(this.props.user.accessToken !== ""){
            this.props.findUserRepos(this.props.octokit)
        }        
    }
 

    componentDidUpdate(prevProps) {
        var {match} = this.props
        var {repo} = this.props
        //console.log(match,prevProps)
        //console.log(this.props, prevProps)
        
        if((this.props.user !== prevProps.user)){
// Load user repos after login           
            if(this.props.user.accessToken !== ""){  
                this.props.findUserRepos(this.props.octokit)        
            }else{
                this.props.resetRepoData()
            }    
        }
     
// On url change load new folder/file        
        if((match.url !== prevProps.match.url)){    
            this.setDataFromURL(prevProps) 
        }else{
// Load repo, branch and folder from URL
            if((match.params.repo && repo.currentRepo === "") || (match.params.branch && repo.currentBranch === "") || (match.params.path && repo.path === "")){    
                this.setDataFromURL(prevProps) 
// When loading file (not only folder) from url, to load the file, not only folder            
            }else if(match.params.path !== repo.path){      
                this.setDataFromURL(prevProps) 
            }
        }
    } 

/**
 * Handle setting current folder or file from URL
 * @param {*} prevProps 
 */    
    setDataFromURL(prevProps){
        var {params} = this.props.match
        var {repo} = this.props
        //console.log(params, repo)
// Set repo from URL
        if((params.repo !== repo.currentRepo.name) || (params.repo && repo.currentRepo ==="")){
            //console.log("repo stuff")
            var repoItem = repo.repoList.find(e => e.name === params.repo)
            if(repoItem){
                this.props.setCurrentRepo(repoItem, this.props.octokit)
            }
// Set branch from URL            
        }else if(params.branch !== repo.currentBranch.name){
            //console.log("branch stuff")
            if(params.branch !== undefined){
                var branchItem = repo.branchList.find(e => e.name === params.branch)
                if(branchItem){
                    this.setCurrentBranch(branchItem)
                }     
            }
        }
// Set folder/file from URL
        else if(params.path !== repo.path){
            //console.log("file stuff")
            if(params.path !== undefined){  
// Find file with same path as URL path in current repo
                var dataItem = repo.currentRepoData.find(e => e.path === params.path)
             
                //console.log(dataItem)
                if(dataItem !== undefined){
// In case of file load it to currentFile
                    if(dataItem.type === "file" ){
                        if(repo.currentFile){
// If file is already opened, do nothing
                            if(dataItem.name === repo.currentFile.name){
                                return
                            }
                        }
                       
                        if(dataItem.name.includes(".json")){
                            this.props.loadFile(this.props.repo, dataItem, this.props.match.params.path, "raw", this.props.octokit)
                        }else{
                            this.props.loadFile(this.props.repo, dataItem, this.props.match.params.path, "html", this.props.octokit)
                        }
// If folder load it to currentRepoData                     
                    }else{
                        this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, params.path, this.props.octokit)  
                    }
                     
                
                //this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, params.path, this.props.octokit)   
                }else if(dataItem === undefined && params.path !== "" && !repo.currentFile){
                    this.props.loadFromUrl(this.props.repo, this.props.repo.currentBranch, params.path, this.props.octokit)
                }       
            }
        }
    }


/**
 * Set current branch
 */
    setCurrentBranch = (branch) => {
        this.props.setCurrentRepoData(this.props.repo.currentRepo, branch, this.props.repo.path, this.props.octokit)   
    }
  
/**
 * Set new path in repo
 */
    addToPath = (path) => {
        this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, path, this.props.octokit)   
    }

/**
 * Create string from path in Array
 */
    pathToString = (e) => {
        var x = e.reduce((result, item) => {
            return `${result}${item}/`
          }, "")
          if(x[x.length - 1] === "/"){     
            x = x.slice(0,x.length-1)
          }
          return x  
    }

/**
 * Create Link for breadcrumbs
 */
    breadcrumbsNav = (e) => {
        var {params} = this.props.match
        var link = `/${params.repo}/${params.branch}`

        var pathArr = this.props.match.params.path.split("/")
        var index = pathArr.findIndex(x => x === e)
        
        pathArr = pathArr.slice(0,index+1)
     
        var newPath = this.pathToString(pathArr)
        if(newPath !== ""){
            link = link + "/"
        }
        link = link + newPath
        return(
            link
        )

        //this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, newPath, this.props.octokit)   
    }

    
    render(){
        console.log()
      
        var {user, repo} = this.props
        var {params} = this.props.match
        var pathArr = repo.path.split("/")

        if(user.accessToken === ""){
            return(
                <Container>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Log In to see Repositories</span>
                        </div>
                        <div>Log In to see Repositories</div>
                        {/*
                        <button onClick = {this.getFile}>Get Data</button>
                        <button onClick = {this.uploadFile}>Upload File</button>
                        */}
                    </div>
                    <Row>    
                    </Row>
                </Container>
            )
        }else{
            //console.log("RepoBoard ", repo)
        return(   
            <Container>
                <Row>
                    <Col sm = {1}/>  
        
                    <Col className = "repoNav" xs = {"auto"}>   
                        {
                        repo.repoList.length ?
                                <DropdownButton  id="repo-dropdown-button" title={repo.currentRepo ? repo.currentRepo.name:"Repos" } size="lg">
                                    {
                                        repo.repoList && repo.repoList.map((item,i) => {
                                            return( 
                                                <Dropdown.Item key = {item.id} href={`/${item.name}`} onClick={()=> console.log(item.name,"clicked")/*() => this.props.setCurrentRepo(item,this.props.octokit)*/}>
                                                    {item.name}
                                                </Dropdown.Item>
                                            )
                                        })
                                    }
                                </DropdownButton>
                            :
                                null
                        }
                    </Col>
                    <Col className = "repoNav" xs={"auto"}>
                        {
                        repo.branchList.length ?
                                <DropdownButton  id="repo-dropdown-button" title={repo.currentBranch ? repo.currentBranch.name:"Branch" } size="lg">
                                    {
                                        repo.branchList && repo.branchList.map((item,i) => {
                                            return( 
                                                <Dropdown.Item key = {item.name} href={`/${params.repo}/${item.name}`} onClick={() => console.log(item.name,"branch clicked")/*this.setCurrentBranch(item)*/} >
                                                   {item.name}
                                                </Dropdown.Item>
                                            )
                                        })
                                    }
                                </DropdownButton>
                            :
                                null
                            }
                    </Col>
                    <Col className = "repoNav" xs>
                        {
                        params.path ?
                                <Breadcrumb>
                                    <Breadcrumb.Item href={`/${params.repo}/${params.branch}`}>
                                        {params.branch}
                                    </Breadcrumb.Item>                                          
                                    {
                                        params.path && params.path.split("/").map((item,i) => {
                                            return( 
                                                <Breadcrumb.Item key={item} href={this.breadcrumbsNav(item)}> 
                                                    {item}
                                                </Breadcrumb.Item>  )
                                        })
                                    }
                                </Breadcrumb>
                            :
                                null
                        }              
                    </Col>   
                </Row>

                <Row>
                    <Col sm = {1}/>  
                        
                    <Col sm = {10}>   
                        {
                            repo.currentBranch ?
                            
                            <Repo  addToPath={this.addToPath} pathToString = {this.pathToString} url = {this.props.match.url}/>
/*
                            <Route path={`${this.props.match.path}/:path`} component={(props) => <Repo {...props} addToPath={this.addToPath}/>}/>
                            */
                            :
                            null
                        } 
                    </Col>
                </Row>
                <Row>
                    <Col sm = {1}/>  
                        
                    <Col sm={10}>
                    
                    </Col>
                </Row>

                <Row>
                    <Col sm = {1}/>  
                     
                    <Col sm={10}>
                        <DndProvider backend={Backend}>
                            <CardList/> 
                        </DndProvider>
                    </Col>
                </Row>
     
            </Container>
        )      
    }
}
}


const mapStateToProps = (state) => {
    return {
        user: state.auth,
        repo: state.repo,
        octokit: state.auth.octokit
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateRepo: (repo) => dispatch(updateRepo(repo)),
        findUserRepos: (octokit) => dispatch(findUserRepos(octokit)),
        resetRepoData: () => dispatch(resetRepoData()),
        setCurrentRepo: (repo, octokit) => dispatch(setCurrentRepo(repo, octokit)),
        setCurrentRepoData: (currentRepo, branch, path, octokit) => (dispatch(setCurrentRepoData(currentRepo, branch, path, octokit))),
        loadFile: (repo, file, path, format, octokit) => dispatch(loadFile(repo, file, path, format, octokit)),
        loadFromUrl: (repo, file, path, format, octokit) => dispatch(loadFromUrl(repo, file, path, format, octokit))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(RepoBoard)



/* no router

import React, {Component} from "react";
import {Container, Row, Col, Form, Button, DropdownButton, Dropdown, Breadcrumb, ListGroup} from "react-bootstrap";
import Repo from "./Repo"
import CardList from "../todo/CardList"
import {connect} from "react-redux";

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import {updateRepo, findUserRepos, resetRepoData, setCurrentRepo, setCurrentRepoData} from "../../store/actions/repoActions"
import {pathToRegexp} from "path-to-regexp"


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class RepoBoard extends Component{

    componentDidMount(){
        console.log("mounted", this.props)

        if(this.props.user.accessToken !== ""){
            this.props.findUserRepos(this.props.octokit)
            this.setDataFromURL()
        }        
    }


    componentDidUpdate(prevProps) {
        //console.log(this.props)
        if((this.props.user !== prevProps.user)){
            if(this.props.user.accessToken !== ""){  
                this.props.findUserRepos(this.props.octokit)        
            }else{
                this.props.resetRepoData()
            }    
        }
        if((this.props.location !== prevProps.location)){
            if(this.props.match.params.repo !== this.props.repo.currentRepo){
                console.log("Different Repo")
            }
            console.log("Location changed", this.props.location)   
        }
    } 
 
    setDataFromURL(){
        var {params} = this.props.match
        var {repo} = this.props.repo
        
        if(params.repo !== repo.currentRepo){
            this.props.setCurrentRepo()
        }
    }


    setCurrentBranch = (branch) => {
        this.props.setCurrentRepoData(this.props.repo.currentRepo, branch, this.props.repo.path, this.props.octokit)   
    }
  

    addToPath = (path) => {
        this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, path, this.props.octokit)   
    }


    pathToString = (e) => {
        var x = e.reduce((result, item) => {
            return `${result}${item}/`
          }, "")
          if(x[x.length - 1] === "/"){     
            x = x.slice(0,x.length-1)
          }
          return x  
    }


    breadcrumbsNav = (e) => {
        var pathArr = this.props.repo.path.split("/")
        var index = pathArr.findIndex(x => x === e)

        pathArr = pathArr.slice(0,index+1)
  
        var newPath = this.pathToString(pathArr)

        this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, newPath, this.props.octokit)   
    }

    
    render(){
        console.log()
      
        var {user, repo} = this.props
        var pathArr = repo.path.split("/")

        if(user.accessToken === ""){
            return(
                <Container>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Log In to see Repositories</span>
                        </div>
                        <div>Log In to see Repositories</div>
                        
                        </div>
                        <Row>    
                        </Row>
                    </Container>
                )
            }else{
                //console.log("RepoBoard ", repo)
            return(   
                <Container>
                    <Row>
                        <Col sm = {1}>  
                        </Col>     
                        <Col className = "repoNav" xs = {"auto"}>   
                            {
                            repo.repoList.length ?
                                    <DropdownButton  id="repo-dropdown-button" title={repo.currentRepo ? repo.currentRepo.name:"Repos" } size="lg">
                                        {
                                            repo.repoList && repo.repoList.map((item,i) => {
                                                return( 
                                                    <Dropdown.Item key = {item.id} as="button" onClick={() => this.props.setCurrentRepo(item,this.props.octokit)}>
                                                        <Link to={`/${item.name}`}>{item.name}</Link>
                                                    </Dropdown.Item>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                :
                                    null
                            }
                        </Col>
                        <Col className = "repoNav" xs={"auto"}>
                            {
                            repo.branchList.length ?
                                    <DropdownButton  id="repo-dropdown-button" title={repo.currentBranch ? repo.currentBranch.name:"Branch" } size="lg">
                                        {
                                            repo.branchList && repo.branchList.map((item,i) => {
                                                return( 
                                                    <Dropdown.Item key = {item.name} as="button" onClick={() => this.setCurrentBranch(item)} >{item.name}</Dropdown.Item>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                :
                                    null
                                }
                        </Col>
                        <Col className = "repoNav" xs>
                            {
                            pathArr.length ?
                                    <Breadcrumb>
                                        <Breadcrumb.Item onClick={() => this.breadcrumbsNav("")}>{repo.currentBranch.name}</Breadcrumb.Item>                                          
                                        {
                                            pathArr && pathArr.map((item,i) => {
                                                return( 
                                                    <Breadcrumb.Item key={item} onClick={() => this.breadcrumbsNav(item)}>{item}</Breadcrumb.Item>  )
                                            })
                                        }
                                    </Breadcrumb>
                                :
                                    null
                            }              
                        </Col>   
                    </Row>
    
                    <Row>
                        <Col sm = {1}>  
                        </Col>     
                        <Col sm = {10}>   
                            {
                                repo.currentBranch ?
                                <Route path={this.props.match.path} component={(props) => <Repo {...props} addToPath={this.addToPath} />}>
                                   
                                </Route>
                                :
                                null
                            } 
                        </Col>
                    </Row>
    
                    <Row>
                        <Col sm = {1}>  
                        </Col>  
                        <Col sm={10}>
                            <DndProvider backend={Backend}>
                                <CardList/> 
                            </DndProvider>
                        </Col>
                    </Row>
         
                </Container>
            )      
        }
    }
    }
    
    
    const mapStateToProps = (state) => {
        return {
            user: state.auth,
            repo: state.repo,
            octokit: state.auth.octokit
        }
    }
    
    const mapDispatchToProps = (dispatch) => {
        return {
            updateRepo: (repo) => dispatch(updateRepo(repo)),
            findUserRepos: (octokit) => dispatch(findUserRepos(octokit)),
            resetRepoData: () => dispatch(resetRepoData()),
            setCurrentRepo: (repo, octokit) => dispatch(setCurrentRepo(repo, octokit)),
            setCurrentRepoData: (currentRepo, branch, path, octokit) => (dispatch(setCurrentRepoData(currentRepo, branch, path, octokit)))
        }
    }
    
    
    export default connect(mapStateToProps,mapDispatchToProps)(RepoBoard)
    
    
    
    
    
    /*
    
        getFile = async () => {
            try{
                var x = {cardOrder:["1","2"], cards:[{id:"1",content:"bla"},{id:"2",content:"bhallo"}]}
                console.log(x)
                console.log(JSON.stringify(x))
               
                await this.octokit.repos.getContents({
                    owner:"NikolajKn",
                    repo:"Tester",
                    path:"temp.json",
                    ref:"master",
                    mediaType:{
                        format:"raw"
                    }
                  
                }).then((result) => {
                    console.log("aspon nieco",result)
                    console.log(JSON.parse(result.data))
                })
                
            }catch(e){
                  console.log("nefungujem")
                  console.log(e)
              }
        }
    
        uploadFile = async () => {
            try{
                var temp = {cardOrder:["1","2"], cards:[{id:"1",content:"prvy"},{id:"2",content:"druhy"}]}
    
                var x = Base64.encode(JSON.stringify(temp))
                console.log(x)
                await this.octokit.repos.createOrUpdateFile({
                    owner : "NikolajKn",
                    repo : "Tester",
                    path: "test1.json",
                    branch: "master",
                    message : "testing",
                    content : x,
                }).then((result) => {
                    console.log("aspon nieco",result)
                })
    
                temp = {cardOrder:["3","1","2"], cards:[{id:"1",content:"som prvy"},{id:"2",content:"som druhy"},{id:"3",content:"som treti"}]}
    
                x = Base64.encode(JSON.stringify(temp))
                console.log(x)
                await this.octokit.repos.createOrUpdateFile({
                    owner : "NikolajKn",
                    repo : "Tester",
                    path: "test2.json",
                    branch:"master",
                    message : "testing",
                    content : x,
                }).then((result) => {
                    console.log("aspon nieco",result)
                })
                
            }catch(e){
                  console.log("nefungujem")
                  console.log(e)
              }
        }
    
    
    */
    /*
    
    class RepoBoard extends Component{
        octokit = null
        user = null
        constructor(props){
            super(props)
            console.log(props)
            
            this.state = {
                token:"",
                userName:"",
                repoList:[],
                currentRepo: "",
                branchList:[],
                currentBranch:"",
                currentRepoData:[],
                path:""
            }
    
            if(props.accessToken !== ""){
                this.octokit = new Octokit({
                    auth:props.accessToken,
                    userAgent: "NikolajKn",
                    baseUrl: "https://api.github.com"
                })
                this.state = {
                    ...this.state,
                    token: props.accessToken,
                    userName: props.user.additionalUserInfo.username,
                }    
            }    
        }
        
        componentDidMount(){
            console.log("mounted", this.props)
            try{
                this.findUserRepos(this.state.userName).then(
                    (result) => {
                        console.log(result)
                        this.setState({
                            ...this.state,
                            repoList: result
                        })
                        console.log(this.state)
                    }
                )
            }catch(e){
                console.log(e)
            }
        }
    
        componentDidUpdate(prevProps) {
            console.log(this.props)
            if((this.props.user !== prevProps.user)){
                if(this.props.user){
                    //console.log(this.props.user)
                    var userName = this.props.user.additionalUserInfo.username
        
                    this.octokit = new Octokit({
                        auth: this.props.accessToken,
                        userAgent: userName,
                        baseUrl: "https://api.github.com"
                    })
                    this.findUserRepos(userName).then(
                        (result) => {
                            this.setState({
                                token: this.props.accessToken,
                                userName: userName,
                                repoList: result
                            })
                        }
                    )
                }else{
                    this.setState({
                        token:"",
                        userName:"",
                        repoList:[],
                        currentRepo: "",
                        branchList:[],
                        currentBranch:"",
                        currentRepoData:[],
                        path:""
                    })
                }
                
            }
          } 
        
    
    
        findUserRepos = async (name) => {       
            try{
                var allRepos = await this.octokit.repos.listForAuthenticatedUser({type:"owner"});
                return allRepos.data
            }catch(e){
                console.log(e)
                return []
            }  
        }
    
    
        findText = ""
        handleFindButton = async (e) => {
            e.preventDefault()
            this.findUserRepos(this.findText)
        }
    
        handleFindText = (e) => {
            this.findText = e.target.value
        }
    
    
        setCurrentRepo = async (e) => {       
            var tempData = []
            var repoBranches = await this.octokit.repos.listBranches({
                owner: e.owner.login,
                repo: e.name,        
              })
              repoBranches.data.map( (item) => {
                tempData = [...tempData,item]
            })
            this.setState({
                currentRepo:e,
                branchList:tempData, 
                currentBranch:"",
                currentRepoData:[],
                path:""
            })    
        }
    
    
        setCurrentBranch = (e) => {
            this.setRepoDetails(e)   
        }
    
        setRepoDetails = async (e) =>{
            var tempData = []
            //console.log("CUrrent state", this.state)
            try{
                var contents = await this.octokit.repos.getContents({
                    owner:this.state.currentRepo.owner.login,
                    repo:this.state.currentRepo.name,
                    ref:e.name,
                    path:this.state.path
                })
                contents.data.map( (item) => {
                    tempData = [...tempData,item]
                })  
                this.setState({currentBranch:e.name, currentRepoData:tempData})  
            }catch(e){
                alert("File does not exists in this branch")
            }
        }
    
        
        setRepoDetailsOther = async (e) =>{
            var tempData = []
            //console.log("CUrrent state", this.state)
            try{
                var contents = await this.octokit.repos.getContents({
                    owner:this.state.currentRepo.owner.login,
                    repo:this.state.currentRepo.name,
                    ref:this.state.currentBranch,
                    path:e
                })
        
                contents.data.map( (item) => {
                    tempData = [...tempData,item]
                })  
                this.setState({currentRepoData:tempData, path:e})  
            }catch(e){
                console.log(e)
            }
        }
      
    
        addToPath = (e) => {
            this.setRepoDetailsOther(e)
        }
    
        pathToString = (e) => {
            var x = e.reduce((result, item) => {
                return `${result}${item}/`
              }, "")
              if(x[x.length - 1] === "/"){     
                x = x.slice(0,x.length-1)
              }
              return x  
        }
    
        breadcrumbsNav = (e) => {
            var pathArr = this.state.path.split("/")
            var index = pathArr.findIndex(x => x === e)
    
            pathArr = pathArr.slice(0,index+1)
      
            var newPath = this.pathToString(pathArr)
            this.setRepoDetailsOther(newPath)
        }
    
    
        getFile = async () => {
            try{
                var x = {cardOrder:["1","2"], cards:[{id:"1",content:"bla"},{id:"2",content:"bhallo"}]}
                console.log(x)
                console.log(JSON.stringify(x))
               
                await this.octokit.repos.getContents({
                    owner:"NikolajKn",
                    repo:"Tester",
                    path:"temp.json",
                    ref:"master",
                    mediaType:{
                        format:"raw"
                    }
                  
                }).then((result) => {
                    console.log("aspon nieco",result)
                    console.log(JSON.parse(result.data))
                })
                
            }catch(e){
                  console.log("nefungujem")
                  console.log(e)
              }
        }
    
        uploadFile = async () => {
            try{
                var temp = {cardOrder:["1","2"], cards:[{id:"1",content:"prvy"},{id:"2",content:"druhy"}]}
    
                var x = Base64.encode(JSON.stringify(temp))
                console.log(x)
                await this.octokit.repos.createOrUpdateFile({
                    owner : "NikolajKn",
                    repo : "Tester",
                    path: "test1.json",
                    branch: "master",
                    message : "testing",
                    content : x,
                }).then((result) => {
                    console.log("aspon nieco",result)
                })
    
                temp = {cardOrder:["3","1","2"], cards:[{id:"1",content:"som prvy"},{id:"2",content:"som druhy"},{id:"3",content:"som treti"}]}
    
                x = Base64.encode(JSON.stringify(temp))
                console.log(x)
                await this.octokit.repos.createOrUpdateFile({
                    owner : "NikolajKn",
                    repo : "Tester",
                    path: "test2.json",
                    branch:"master",
                    message : "testing",
                    content : x,
                }).then((result) => {
                    console.log("aspon nieco",result)
                })
                
            }catch(e){
                  console.log("nefungujem")
                  console.log(e)
              }
        }
    
    
    
    
        render(){
            firebase.auth().onAuthStateChanged((user) => {
                //console.log("zmena auth statusu")     
                //console.log(user)
              });
            console.log()
            //console.log(firebase.auth().currentUser)
            console.log("RepoBoard ", this.state)
            var pathArr = this.state.path.split("/")
            if(this.state.userName === ""){
                return(
                    <Container>
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Log In to see Repositories</span>
                            </div>
                            <div>Log In to see Repositories</div>
                            <button onClick = {this.getFile}>Get Data</button>
                            <button onClick = {this.uploadFile}>Upload File</button>
                        </div>
                        <Row>
                            <DndProvider backend={Backend}>
                                <CardList octokit={this.octokit}/> 
                            </DndProvider>
                        </Row>
                    </Container>
                )
            }else{
            return(   
                <Container>
                    <Row>
                        <Col sm = {1}>  
                        </Col>     
                        <Col className = "repoNav" sm = {"auto"}>   
                                {
                                this.state.repoList.length ?
                                        <DropdownButton  id="repo-dropdown-button" title={this.state.currentRepo ? this.state.currentRepo.name:"Repos" }>
                                            {
                                                this.state.repoList && this.state.repoList.map((item,i) => {
                                                    return( 
                                                        <Dropdown.Item key = {item.id} as="button" onClick={() => this.setCurrentRepo(item)} >{item.name}</Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </DropdownButton>
                                    :
                                        null
                                }
                        </Col>
                        <Col className = "repoNav" sm={"auto"}>
                                {
                                this.state.branchList.length ?
                                        <DropdownButton  id="repo-dropdown-button" title={this.state.currentBranch ? this.state.currentBranch:"Branch" }>
                                            {
                                                this.state.branchList && this.state.branchList.map((item,i) => {
                                                    return( 
                                                        <Dropdown.Item key = {item.name} as="button" onClick={() => this.setCurrentBranch(item)} >{item.name}</Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </DropdownButton>
                                    :
                                        null
                                }
                        </Col>
                        <Col className = "repoNav" sm={6}>
                                {
                                pathArr.length ?
                                        <Breadcrumb>
                                            <Breadcrumb.Item onClick={() => this.breadcrumbsNav("")}>{this.state.currentBranch}</Breadcrumb.Item>                                          
                                            {
                                                pathArr && pathArr.map((item,i) => {
                                                    return( 
                                                        <Breadcrumb.Item key={item} onClick={() => this.breadcrumbsNav(item)}>{item}</Breadcrumb.Item>  )
                                                })
                                            }
                                        </Breadcrumb>
                                    :
                                        null
                                }
                                        
                        </Col>   
                    </Row>
    
                    <Row>
                        <Col sm = {1}>  
                            <button onClick = {this.getFile}>Get Data</button>
                            <button onClick = {this.uploadFile}>Upload File</button>
                        </Col>     
                        <Col sm = {10}>   
                            {
                                this.state.currentRepo ?
                                    <Repo item = {this.state.currentRepo} octokit={this.octokit} currentBranch={this.state.currentBranch} repoContents={this.state.currentRepoData} addToPath={this.addToPath} />
                                :
                                null
                            } 
                        </Col>
                    </Row>
    
                    <Row>
                        <Col sm = {1}>  
                            
                        </Col>  
                        <Col sm={10}>
                            <DndProvider backend={Backend}>
                                <CardList octokit={this.octokit}/> 
                            </DndProvider>
                        </Col>
                    </Row>
                </Container>
            )      
        }
    }
    }
    
    
    
    //export default RepoBoard
    
    const mapStateToProps = (state) => {
        return {
            user: state.auth.user,
            accessToken: state.auth.accessToken
        }
    }
    
    
    export default connect(mapStateToProps,null)(RepoBoard)
    */

/*

    getFile = async () => {
        try{
            var x = {cardOrder:["1","2"], cards:[{id:"1",content:"bla"},{id:"2",content:"bhallo"}]}
            console.log(x)
            console.log(JSON.stringify(x))
           
            await this.octokit.repos.getContents({
                owner:"NikolajKn",
                repo:"Tester",
                path:"temp.json",
                ref:"master",
                mediaType:{
                    format:"raw"
                }
              
            }).then((result) => {
                console.log("aspon nieco",result)
                console.log(JSON.parse(result.data))
            })
            
        }catch(e){
              console.log("nefungujem")
              console.log(e)
          }
    }

    uploadFile = async () => {
        try{
            var temp = {cardOrder:["1","2"], cards:[{id:"1",content:"prvy"},{id:"2",content:"druhy"}]}

            var x = Base64.encode(JSON.stringify(temp))
            console.log(x)
            await this.octokit.repos.createOrUpdateFile({
                owner : "NikolajKn",
                repo : "Tester",
                path: "test1.json",
                branch: "master",
                message : "testing",
                content : x,
            }).then((result) => {
                console.log("aspon nieco",result)
            })

            temp = {cardOrder:["3","1","2"], cards:[{id:"1",content:"som prvy"},{id:"2",content:"som druhy"},{id:"3",content:"som treti"}]}

            x = Base64.encode(JSON.stringify(temp))
            console.log(x)
            await this.octokit.repos.createOrUpdateFile({
                owner : "NikolajKn",
                repo : "Tester",
                path: "test2.json",
                branch:"master",
                message : "testing",
                content : x,
            }).then((result) => {
                console.log("aspon nieco",result)
            })
            
        }catch(e){
              console.log("nefungujem")
              console.log(e)
          }
    }


*/
/*

class RepoBoard extends Component{
    octokit = null
    user = null
    constructor(props){
        super(props)
        console.log(props)
        
        this.state = {
            token:"",
            userName:"",
            repoList:[],
            currentRepo: "",
            branchList:[],
            currentBranch:"",
            currentRepoData:[],
            path:""
        }

        if(props.accessToken !== ""){
            this.octokit = new Octokit({
                auth:props.accessToken,
                userAgent: "NikolajKn",
                baseUrl: "https://api.github.com"
            })
            this.state = {
                ...this.state,
                token: props.accessToken,
                userName: props.user.additionalUserInfo.username,
            }    
        }    
    }
    
    componentDidMount(){
        console.log("mounted", this.props)
        try{
            this.findUserRepos(this.state.userName).then(
                (result) => {
                    console.log(result)
                    this.setState({
                        ...this.state,
                        repoList: result
                    })
                    console.log(this.state)
                }
            )
        }catch(e){
            console.log(e)
        }
    }

    componentDidUpdate(prevProps) {
        console.log(this.props)
        if((this.props.user !== prevProps.user)){
            if(this.props.user){
                //console.log(this.props.user)
                var userName = this.props.user.additionalUserInfo.username
    
                this.octokit = new Octokit({
                    auth: this.props.accessToken,
                    userAgent: userName,
                    baseUrl: "https://api.github.com"
                })
                this.findUserRepos(userName).then(
                    (result) => {
                        this.setState({
                            token: this.props.accessToken,
                            userName: userName,
                            repoList: result
                        })
                    }
                )
            }else{
                this.setState({
                    token:"",
                    userName:"",
                    repoList:[],
                    currentRepo: "",
                    branchList:[],
                    currentBranch:"",
                    currentRepoData:[],
                    path:""
                })
            }
            
        }
      } 
    


    findUserRepos = async (name) => {       
        try{
            var allRepos = await this.octokit.repos.listForAuthenticatedUser({type:"owner"});
            return allRepos.data
        }catch(e){
            console.log(e)
            return []
        }  
    }


    findText = ""
    handleFindButton = async (e) => {
        e.preventDefault()
        this.findUserRepos(this.findText)
    }

    handleFindText = (e) => {
        this.findText = e.target.value
    }


    setCurrentRepo = async (e) => {       
        var tempData = []
        var repoBranches = await this.octokit.repos.listBranches({
            owner: e.owner.login,
            repo: e.name,        
          })
          repoBranches.data.map( (item) => {
            tempData = [...tempData,item]
        })
        this.setState({
            currentRepo:e,
            branchList:tempData, 
            currentBranch:"",
            currentRepoData:[],
            path:""
        })    
    }


    setCurrentBranch = (e) => {
        this.setRepoDetails(e)   
    }

    setRepoDetails = async (e) =>{
        var tempData = []
        //console.log("CUrrent state", this.state)
        try{
            var contents = await this.octokit.repos.getContents({
                owner:this.state.currentRepo.owner.login,
                repo:this.state.currentRepo.name,
                ref:e.name,
                path:this.state.path
            })
            contents.data.map( (item) => {
                tempData = [...tempData,item]
            })  
            this.setState({currentBranch:e.name, currentRepoData:tempData})  
        }catch(e){
            alert("File does not exists in this branch")
        }
    }

    
    setRepoDetailsOther = async (e) =>{
        var tempData = []
        //console.log("CUrrent state", this.state)
        try{
            var contents = await this.octokit.repos.getContents({
                owner:this.state.currentRepo.owner.login,
                repo:this.state.currentRepo.name,
                ref:this.state.currentBranch,
                path:e
            })
    
            contents.data.map( (item) => {
                tempData = [...tempData,item]
            })  
            this.setState({currentRepoData:tempData, path:e})  
        }catch(e){
            console.log(e)
        }
    }
  

    addToPath = (e) => {
        this.setRepoDetailsOther(e)
    }

    pathToString = (e) => {
        var x = e.reduce((result, item) => {
            return `${result}${item}/`
          }, "")
          if(x[x.length - 1] === "/"){     
            x = x.slice(0,x.length-1)
          }
          return x  
    }

    breadcrumbsNav = (e) => {
        var pathArr = this.state.path.split("/")
        var index = pathArr.findIndex(x => x === e)

        pathArr = pathArr.slice(0,index+1)
  
        var newPath = this.pathToString(pathArr)
        this.setRepoDetailsOther(newPath)
    }


    getFile = async () => {
        try{
            var x = {cardOrder:["1","2"], cards:[{id:"1",content:"bla"},{id:"2",content:"bhallo"}]}
            console.log(x)
            console.log(JSON.stringify(x))
           
            await this.octokit.repos.getContents({
                owner:"NikolajKn",
                repo:"Tester",
                path:"temp.json",
                ref:"master",
                mediaType:{
                    format:"raw"
                }
              
            }).then((result) => {
                console.log("aspon nieco",result)
                console.log(JSON.parse(result.data))
            })
            
        }catch(e){
              console.log("nefungujem")
              console.log(e)
          }
    }

    uploadFile = async () => {
        try{
            var temp = {cardOrder:["1","2"], cards:[{id:"1",content:"prvy"},{id:"2",content:"druhy"}]}

            var x = Base64.encode(JSON.stringify(temp))
            console.log(x)
            await this.octokit.repos.createOrUpdateFile({
                owner : "NikolajKn",
                repo : "Tester",
                path: "test1.json",
                branch: "master",
                message : "testing",
                content : x,
            }).then((result) => {
                console.log("aspon nieco",result)
            })

            temp = {cardOrder:["3","1","2"], cards:[{id:"1",content:"som prvy"},{id:"2",content:"som druhy"},{id:"3",content:"som treti"}]}

            x = Base64.encode(JSON.stringify(temp))
            console.log(x)
            await this.octokit.repos.createOrUpdateFile({
                owner : "NikolajKn",
                repo : "Tester",
                path: "test2.json",
                branch:"master",
                message : "testing",
                content : x,
            }).then((result) => {
                console.log("aspon nieco",result)
            })
            
        }catch(e){
              console.log("nefungujem")
              console.log(e)
          }
    }




    render(){
        firebase.auth().onAuthStateChanged((user) => {
            //console.log("zmena auth statusu")     
            //console.log(user)
          });
        console.log()
        //console.log(firebase.auth().currentUser)
        console.log("RepoBoard ", this.state)
        var pathArr = this.state.path.split("/")
        if(this.state.userName === ""){
            return(
                <Container>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Log In to see Repositories</span>
                        </div>
                        <div>Log In to see Repositories</div>
                        <button onClick = {this.getFile}>Get Data</button>
                        <button onClick = {this.uploadFile}>Upload File</button>
                    </div>
                    <Row>
                        <DndProvider backend={Backend}>
                            <CardList octokit={this.octokit}/> 
                        </DndProvider>
                    </Row>
                </Container>
            )
        }else{
        return(   
            <Container>
                <Row>
                    <Col sm = {1}>  
                    </Col>     
                    <Col className = "repoNav" sm = {"auto"}>   
                            {
                            this.state.repoList.length ?
                                    <DropdownButton  id="repo-dropdown-button" title={this.state.currentRepo ? this.state.currentRepo.name:"Repos" }>
                                        {
                                            this.state.repoList && this.state.repoList.map((item,i) => {
                                                return( 
                                                    <Dropdown.Item key = {item.id} as="button" onClick={() => this.setCurrentRepo(item)} >{item.name}</Dropdown.Item>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                :
                                    null
                            }
                    </Col>
                    <Col className = "repoNav" sm={"auto"}>
                            {
                            this.state.branchList.length ?
                                    <DropdownButton  id="repo-dropdown-button" title={this.state.currentBranch ? this.state.currentBranch:"Branch" }>
                                        {
                                            this.state.branchList && this.state.branchList.map((item,i) => {
                                                return( 
                                                    <Dropdown.Item key = {item.name} as="button" onClick={() => this.setCurrentBranch(item)} >{item.name}</Dropdown.Item>
                                                )
                                            })
                                        }
                                    </DropdownButton>
                                :
                                    null
                            }
                    </Col>
                    <Col className = "repoNav" sm={6}>
                            {
                            pathArr.length ?
                                    <Breadcrumb>
                                        <Breadcrumb.Item onClick={() => this.breadcrumbsNav("")}>{this.state.currentBranch}</Breadcrumb.Item>                                          
                                        {
                                            pathArr && pathArr.map((item,i) => {
                                                return( 
                                                    <Breadcrumb.Item key={item} onClick={() => this.breadcrumbsNav(item)}>{item}</Breadcrumb.Item>  )
                                            })
                                        }
                                    </Breadcrumb>
                                :
                                    null
                            }
                                    
                    </Col>   
                </Row>

                <Row>
                    <Col sm = {1}>  
                        <button onClick = {this.getFile}>Get Data</button>
                        <button onClick = {this.uploadFile}>Upload File</button>
                    </Col>     
                    <Col sm = {10}>   
                        {
                            this.state.currentRepo ?
                                <Repo item = {this.state.currentRepo} octokit={this.octokit} currentBranch={this.state.currentBranch} repoContents={this.state.currentRepoData} addToPath={this.addToPath} />
                            :
                            null
                        } 
                    </Col>
                </Row>

                <Row>
                    <Col sm = {1}>  
                        
                    </Col>  
                    <Col sm={10}>
                        <DndProvider backend={Backend}>
                            <CardList octokit={this.octokit}/> 
                        </DndProvider>
                    </Col>
                </Row>
            </Container>
        )      
    }
}
}



//export default RepoBoard

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        accessToken: state.auth.accessToken
    }
}


export default connect(mapStateToProps,null)(RepoBoard)
*/