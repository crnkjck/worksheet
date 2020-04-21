import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import DashWrapper from './components/dashboard/DashWrapper';
import NoticeBoard from './components/notice/NoticeBoard.js';
import Home from './components/home/Home.js';
import RepoWrapper from './components/repo/RepoWrapper';
import RepoBoard from './components/repo/RepoBoard';
import firebase from "firebase/app"
import {localStorageSignin} from "./store/actions/authActions"



class App extends Component {
  constructor(props){
    super(props);

    var remember = localStorage.getItem("user") != null
    remember ? this.props.localStorageSignin() : console.log("niesi prihlaseny")
  }

  render() {
 
    return(
      <BrowserRouter>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path = "/" component={RepoBoard}/>
            <Route path = "/notice" component={NoticeBoard}/>
            
          </Switch>
        </div>
      </BrowserRouter>
   
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    localStorageSignin: () => dispatch(localStorageSignin())
  }
}

export default connect(null,mapDispatchToProps)(App);
