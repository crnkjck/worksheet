import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import DashWrapper from './components/dashboard/DashWrapper';
import NoticeBoard from './components/notice/NoticeBoard.js';
import Home from './components/home/Home.js';
import RepoWrapper from './components/repo/RepoWrapper';
import firebase from "firebase/app"


class App extends Component {
  constructor(props){
    super(props);
    firebase.auth().onAuthStateChanged((user) => {
      //console.log(user.getIdToken())
    });
  }
  render() {
    

  
    return(
      <BrowserRouter>
        <div className="App">
          <Navbar/>
          <Switch>
            <Route exact path ="/" component = {Home} />
            <Route path = "/tasks" component={DashWrapper}/>
            <Route path = "/notice" component={NoticeBoard}/>
            <Route path = "/repo" component={RepoWrapper}/>
          </Switch>
        </div>
      </BrowserRouter>
   
    )
  }
}

export default App;
