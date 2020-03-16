import React, {Component} from "react";
import {connect} from "react-redux";
import {firestoreConnect} from "react-redux-firebase";
import {compose} from "redux";
import {Container, Row, Col, Spinner,Form,Button} from "react-bootstrap";
import RepoBoard from "./RepoBoard";
import {loadUserRepos} from "../../store/actions/repoActions"
import firebase from "firebase/app"




class RepoWrapper extends Component{

    

    render(){
        /*
        var repos = loadUserRepos("NikolajKn")
        console.log(repos)
        if(repos.length === 0){
            return(
                <Container>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </Container>
            )
        }else{
            
            console.log(repos)
            */
            return(
                <RepoBoard></RepoBoard>

                
            )
        
  
    }
}


export default RepoWrapper