import React, {Component} from "react";
import {Container, Row, Col, Form, Button, DropdownButton, Dropdown, Breadcrumb} from "react-bootstrap";
import { Octokit } from "@octokit/rest"
import firebase from "firebase/app"
import { Base64 } from 'js-base64';
import Repo from "./Repo"

class RepoBoard extends Component{
    octokit = null
    constructor(props){
        super(props)
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

        this.octokit = new Octokit({
            auth:this.state.token,
            userAgent: "NikolajKn",
            baseUrl: "https://api.github.com"
        })
    }

    componentDidMount = () => {
        //alert("bla")
    }


    githubSignin = () =>{
        var provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user')
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
        /*
        var {data} = await this.octokit.repos.getContents({
            owner:"NikolajKn",
            repo:"bachelor",
            path:"package.json",
            ref:"development",
            mediaType:{
                format:"html"
            }
          });
          */
         console.log(this.octokit)
          var x = await this.octokit.repos.list({
              owner:"NikolajKn"
          });
          console.log(x)
        //var textik = Base64.decode(data.content)
    }

    

    findUserRepos = async (name) => {
        try{
            var allRepos = await this.octokit.repos.listForUser({
                username:name
            });
            this.setState({repoList:allRepos.data})
        }catch(e){
            this.setState({repoList:[]})
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
        this.setState({currentRepo:e,branchList:tempData})    
    }


    setCurrentBranch = (e) => {
        this.setRepoDetails(e)   
    }

    setRepoDetails = async (e) =>{
        var tempData = []
        //console.log("CUrrent state", this.state)
        
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

    render(){
        console.log()
        console.log("RepoBoard ", this.state)
        var pathArr = this.state.path.split("/")
        return(   
            <Container>
                <Row>
                    <Col sm = {1}>  
                    </Col>     
                    <Col sm = {10}>   
                        <Form className = "findUserForm" onSubmit={this.handleFindButton}>
                            <Form.Group controlId="formSearchUser">
                                <Form.Label>Find user repos</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" onChange={this.handleFindText}/>
                            </Form.Group>  
                                <Button variant="primary" type="submit">
                                    Search
                                </Button>
                            </Form> 
                            
                            

                            {
                            this.state.repoList.length ?
                                    <DropdownButton drop ={'right'} id="repo-dropdown-button" title="Repos">
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

                            {
                            this.state.branchList.length ?
                                    <DropdownButton drop ={'right'} id="repo-dropdown-button" title="Branches">
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

                            {
                            pathArr.length ?
                                    <Breadcrumb>
                                        
                                            <Breadcrumb.Item >{this.state.currentRepo.name}</Breadcrumb.Item>  
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
                        <button onClick = {this.githubSignin}>Github Signin</button>
                        <button onClick = {this.githubSignout}>Github Signout</button>
                        <button onClick = {this.resetState}>Reset State</button>
                        <button onClick = {this.getData}>Get Data</button>
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



export default RepoBoard
