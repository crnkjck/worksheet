import React, {Component} from "react";
import {Container, Row, Col, DropdownButton, Dropdown, Breadcrumb, Button} from "react-bootstrap";
import Repo from "./Repo"
import CardList from "../card/CardList"
import {connect} from "react-redux";
import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import {updateRepo, findUserRepos, resetRepoData, setCurrentRepo, setCurrentRepoData, loadFile, loadFromUrl} from "../../store/actions/repoActions"
import {closeCards} from "../../store/actions/cardActions"
import { githubSignin } from "../../store/actions/authActions";
import NewFile from "./NewFile"

class RepoBoard extends Component{

    constructor(props){
        super(props)
        this.state = {show : false}
    }
// Handlers for file creation modal
    handleClose = () => {
        this.setState({show:false})
    }
    
    handleShow = () => {
        this.setState({show:true})
    }

    componentDidMount(){
// Load logged user repos
        if(this.props.user.accessToken !== ""){
            this.props.findUserRepos(this.props.octokit)
        }        
    }
 

    componentDidUpdate(prevProps) {

        if(this.props.user.accessToken === ""){
            return
        }    
        if((this.props.repo.currentRepo === "") && (this.props.repo.currentRepoData.length !== 0)){
            this.props.resetRepoData()
            this.props.closeCards()
        }
        if(this.props.repo.currentRepo !== "" && this.props.match.url === "/"){
            this.props.resetRepoData()
            this.props.closeCards()
        }
        let {match} = this.props
        let {repo} = this.props
        
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
            if(match.url === "/" && prevProps.match.url !== "/"){
 
                this.props.resetRepoData()
                this.props.closeCards()            
            }
            this.setDataFromURL() 
        }else{
// Load repo, branch and folder from URL
            if((match.params.repo && repo.currentRepo === "") || (match.params.branch && repo.currentBranch === "") || (match.params.path && repo.path === "")){    
                this.setDataFromURL() 
// When loading file (not only folder) from url, to load the file, not only folder            
            }else if(match.params.path !== repo.path){      
                this.setDataFromURL() 
            }
        }
    } 

/**
 * Handle setting current folder or file from URL
 * 
 */    
    setDataFromURL(){
        let {params} = this.props.match
        let {repo} = this.props
// Set repo from URL
        if((params.repo !== repo.currentRepo.name) || (params.repo && repo.currentRepo ==="")){
            let repoItem = repo.repoList.find(e => e.name === params.repo)
            if(repoItem){
                this.props.setCurrentRepo(repoItem, this.props.octokit)
            }
// Set branch from URL            
        }else if(params.branch !== repo.currentBranch.name){
            if(params.branch !== undefined){
                let branchItem = repo.branchList.find(e => e.name === params.branch)
                if(branchItem){
                    this.setCurrentBranch(branchItem)
                }  
            }
        }
// Set folder/file from URL
        else if(params.path !== repo.path){
            if(params.path !== undefined){  
// Find file with same path as URL path in current repo
                let dataItem = repo.currentRepoData.find(e => e.path === params.path)
        
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
                            this.props.loadFile(this.props.repo, dataItem, this.props.match.params.path, "raw", this.props.octokit,this.props.history.goBack)
                        }else{
                            this.props.loadFile(this.props.repo, dataItem, this.props.match.params.path, "html", this.props.octokit,this.props.history.goBack)
                        }
// If folder load it to currentRepoData                     
                    }else{
                        this.props.setCurrentRepoData(this.props.repo.currentRepo, this.props.repo.currentBranch, params.path, this.props.octokit)  
                    }
                     
                }else if(dataItem === undefined && params.url !== "" && !repo.currentFile){                 
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
        let x = e.reduce((result, item) => {
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
        let {params} = this.props.match
        let link = `/${params.repo}/${params.branch}`

        let pathArr = this.props.match.params.path.split("/")
        let index = pathArr.findIndex(x => x === e)
        
        pathArr = pathArr.slice(0,index+1)
     
        let newPath = this.pathToString(pathArr)
        if(newPath !== ""){
            link = link + "/"
        }
        link = link + newPath
        return(
            link
        ) 
    }

    
    render(){
        var {user, repo} = this.props
        var {params} = this.props.match

        if(user.accessToken === ""){
            return(
                <Container>
                    <Row className="justify-content-md-center mt-3">
                        <Col xs={"auto"}>
                            <Button variant="outline-dark" onClick={()=> this.props.githubSignin()}>Log in with GitHub</Button>
                        </Col>   
                    </Row>
                </Container>
            )
        }else{
        return(   
            <Container fluid>
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
                                                <Dropdown.Item key = {item.id} href={`/${item.name}`}>
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
                                                <Dropdown.Item key = {item.name} href={`/${params.repo}/${item.name}`}>
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
                        params.branch ?
                                <Breadcrumb>
                                    <Breadcrumb.Item href={`/${params.repo}/${params.branch}`}>
                                        {params.branch}
                                    </Breadcrumb.Item>                                          
                                    {
                                        params.path && params.path.split("/").map((item,i) => {
                                            return( 
                                                <Breadcrumb.Item key={item} href={this.breadcrumbsNav(item)}> 
                                                    {item}
                                                </Breadcrumb.Item>  
                                                )
                                        })
                                    }
                                {    
                                repo.currentFile ?                                 
                                     null               
                                :
                                    <Breadcrumb.Item >
                                        <Button size="sm" variant="outline-primary" onClick={() => this.handleShow()}>
                                            Add Worksheet
                                        </Button>      
                                        <NewFile handleShow={() => this.handleShow()} handleClose={() => this.handleClose()} show={this.state.show}></NewFile>
                                    </Breadcrumb.Item>
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
                            :
                                null
                        } 
                    </Col>
                </Row>
  
                    <Row>
                        <Col>
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
        loadFile: (repo, file, path, format, octokit,back) => dispatch(loadFile(repo, file, path, format, octokit,back)),
        loadFromUrl: (repo, file, path, format, octokit) => dispatch(loadFromUrl(repo, file, path, format, octokit)),
        closeCards: () => dispatch(closeCards()),
        githubSignin: () => dispatch(githubSignin()),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(RepoBoard)