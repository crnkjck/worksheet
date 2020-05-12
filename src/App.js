import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import RepoBoard from './components/repo/RepoBoard';
import NoticeBoard from './components/notice/NoticeBoard';
import {localStorageSignin} from "./store/actions/authActions"
//import Editor from "@fmfi-uk-1-ain-412/tableau-editor-embeddable"



class App extends Component {
  constructor(props){
    super(props);
    var user = localStorage.getItem("user")
    if(user === null || user === "null"){
      console.log("niesi prihlaseny")
    }else{
      this.props.localStorageSignin()
    }
  }

 
  render() {
    return(
      <BrowserRouter>
        <div className="App" >
          <Navbar/>
          <Switch>
            <Route path = "/:repo?/:branch?/:path*" component={RepoBoard}/>
            
            {
              //<Route path = "/:repo?/:branch?/:path*" component={RepoBoard}/>
            //<Route path = "/notice" component={NoticeBoard}/>
            }          
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
