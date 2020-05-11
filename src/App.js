import React, {Component} from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import RepoBoard from './components/repo/RepoBoard';
import {localStorageSignin} from "./store/actions/authActions"

import Elm from 'react-elm-components'
//import Editor from "@fmfi-uk-1-ain-412/tableau-editor-embeddable"
import Editor2 from "./components/solvers/tableauEditor/src/Editor.elm"


class App extends Component {
  constructor(props){
    super(props);
   // localStorage.setItem("user", null)

    var remember = localStorage.getItem("user") !== null
    remember ? this.props.localStorageSignin() : console.log("niesi prihlaseny")
  }

  render() {
    //console.log(Editor) 
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
