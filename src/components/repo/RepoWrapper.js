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
            return(
                <RepoBoard></RepoBoard>               
            )
        
  
    }
}


export default RepoWrapper