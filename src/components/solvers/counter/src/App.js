import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrement,
  increment,
  setValue,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './features/counter/counterSlice';


export const Sender = () => {
    
}


const App = ({initState,changeState} = {}) => {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter initState = {initState} changeState = {changeState}/>
      </header>
    </div>
  );
}

export default App;
