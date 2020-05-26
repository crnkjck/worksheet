import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import RepoBoard from './components/repo/RepoBoard';
import {localStorageSignin} from "./store/actions/authActions"


class App extends Component {
  constructor(props){
    super(props);
    var user = localStorage.getItem("user")
    if(user === null || user === "null"){
      console.log("Not logged in")
    }else{
      this.props.localStorageSignin()
    }
  }

 
  render() {
    return(
      <BrowserRouter>
        <div >
          <Navbar/>
          <Switch>
            <Route path = "/:repo?/:branch?/:path*" component={RepoBoard}/>        
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
