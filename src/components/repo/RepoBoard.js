import React, {Component} from "react";
import {Container, Row, Col, Form, Button, DropdownButton, Dropdown, Breadcrumb} from "react-bootstrap";
import { Octokit } from "@octokit/rest"
import { Base64 } from 'js-base64';
import Repo from "./Repo"
import {connect} from "react-redux";

import firebase from "firebase/app"


class RepoBoard extends Component{
    octokit = null
    user = null
    constructor(props){
        super(props)
        console.log(props)
        if(props.accessToken === ""){
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
        }else{
            this.state = {
                token: props.accessToken,
                userName: props.user.additionalUserInfo.username,
                repoList: [],
                currentRepo: "",
                branchList: [],
                currentBranch: "",
                currentRepoData: [],
                path:""
            }
        }
        

        this.octokit = new Octokit({
            auth:this.state.token,
            userAgent: "NikolajKn",
            baseUrl: "https://api.github.com"
        })
    }

    componentDidMount(){
        console.log("mounted", this.props)
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
                this.findUserRepos(this.props.user.additionalUserInfo.username).then(
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
        this.setState({currentRepo:e,branchList:tempData, currentBranch:"",
            currentRepoData:[],
            path:""})    
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
            var temp = {cardOrder:["1","2"], cards:[{id:"1",content:"bla"},{id:"2",content:"hallo"}]}

            var x = Base64.encode(JSON.stringify(temp))
            console.log(x)
            await this.octokit.repos.createOrUpdateFile({
                owner : "NikolajKn",
                repo : "Tester",
                path:"temp.json",
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
            console.log("zmena auth statusu")     
            console.log(user)
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



  /*
                        <Form className = "findUserForm" onSubmit={this.handleFindButton}>
                            <Form.Group controlId="formSearchUser">
                                <Form.Label>Find user repos</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={this.handleFindText}/>
                            </Form.Group>  
                                <Button variant="primary" type="submit">
                                    Search
                                </Button>
                            </Form> 
                            */
/*


    githubSignin = () =>{
        var provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('repo')
        firebase.auth().signInWithPopup(provider)
        .then((result) => {      
            this.octokit = new Octokit({
                auth:result.credential.accessToken,
                userAgent: result.user,
                baseUrl: "https://api.github.com"
            })  
            this.setState({
                token: result.credential.accessToken,
                userName:  result.user
            })       

         })
         .catch(function(error) {
            console.log(error.code)
            console.log(error.message)
         })
        

    }
      
    githubSignout = () =>{
        firebase.auth().signOut()   
        .then(() => {
            this.setState({
                token:"",
                userName:"",
                response:[]
            })    
        }, function(error) {
           console.log('Signout failed')
        });

       
     }


     resetState = () => {
        this.setState({
            token:"",
            userName:"",
            response:[]
        })
    }

   
    getData = async (user, token) => {
       
        var {data} = await this.octokit.repos.getContents({
            owner:"NikolajKn",
            repo:"bachelor",
            path:"package.json",
            ref:"development",
            mediaType:{
                format:"html"
            }
          });
          
         console.log(this.octokit)
          var x = await this.octokit.repos.listForAuthenticatedUser({type:"owner"});
          //var x = await this.octokit.repos.listForAuthenticatedUser();
          console.log(x)
        //var textik = Base64.decode(data.content)
    }

    */