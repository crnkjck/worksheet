import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import RepoBoard from './components/repo/RepoBoard';
import {localStorageSignin} from "./store/actions/authActions"


class App extends Component {
  constructor(props){
    super(props);
   // localStorage.setItem("user", null)
    var remember = localStorage.getItem("user") !== "null"
    remember ? this.props.localStorageSignin() : console.log("niesi prihlaseny")
  }

  render() {
 
    return(
      <BrowserRouter>
        <div className="App">
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
