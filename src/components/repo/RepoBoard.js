import React, {Component} from "react";
import {Container, Row, Col, Form, Button, DropdownButton, Dropdown, Breadcrumb} from "react-bootstrap";
import Repo from "./Repo"
import CardList from "../todo/CardList"
import {connect} from "react-redux";

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

import {updateRepo, findUserRepos, resetRepoData, setCurrentRepo, setCurrentRepoData} from "../../store/actions/repoActions"


class RepoBoard extends Component{

    componentDidMount(){
        console.log("mounted", this.props)
        if(this.props.user.accessToken !== ""){
            this.props.findUserRepos(this.props.octokit)
        }        
    }


    componentDidUpdate(prevProps) {
        console.log(this.props)
        if((this.props.user !== prevProps.user)){
            if(this.props.user.accessToken !== ""){  
                this.props.findUserRepos(this.props.octokit)        
            }else{
                this.props.resetRepoData()
            }    
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
        console.log(this.props)

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
            console.log("RepoBoard ", this.repo)
        return(   
            <Container>
                <Row>
                    <Col sm = {1}>  
                    </Col>     
                    <Col className = "repoNav" sm = {"auto"}>   
                        {
                        repo.repoList.length ?
                                <DropdownButton  id="repo-dropdown-button" title={repo.currentRepo ? repo.currentRepo.name:"Repos" }>
                                    {
                                        repo.repoList && repo.repoList.map((item,i) => {
                                            return( 
                                                <Dropdown.Item key = {item.id} as="button" onClick={() => this.props.setCurrentRepo(item,this.props.octokit)} >{item.name}</Dropdown.Item>
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
                        repo.branchList.length ?
                                <DropdownButton  id="repo-dropdown-button" title={repo.currentBranch ? repo.currentBranch.name:"Branch" }>
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
                    <Col className = "repoNav" sm={6}>
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
                            repo.currentRepo ?
                                <Repo item = {repo.currentRepo} octokit={this.props.octokit} currentBranch={repo.currentBranch.name} repoContents={repo.currentRepoData} addToPath={this.addToPath} />
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
                            <CardList octokit={this.props.octokit}/> 
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