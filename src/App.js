import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Navbar from './components/layout/Navigation';
import Dashboard from './components/dashboard/Dashboard';
import DashWrapper from './components/dashboard/DashWrapper';
import ToDo from './components/todo/ToDo';
import SignIn from './components/auth/SignIn.js';
import SignUp from './components/auth/SignUp.js';
import ToDoCreate from './components/todo/ToDoCreate.js';
import NoticeBoard from './components/notice/NoticeBoard.js';
import Home from './components/home/Home.js';
import RepoWrapper from './components/repo/RepoWrapper';


class App extends Component {
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
