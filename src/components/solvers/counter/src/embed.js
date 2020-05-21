import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

import {importState} from "./json/import"
import {exportState} from "./json/export"

import { configureStore,getDefaultMiddleware  } from '@reduxjs/toolkit';
import counterReducer, { selectState } from "./features/counter/counterSlice";

import { useSelector, useDispatch } from 'react-redux';

const Embed = ({initState,changeState} = {}) => {

    
 /**
  * Custom middleware, that on every action change Card state
  * @param {*} param0 
  */   
    const sender = ({getState}) => {
        return next => action => {
            const returnValue = next(action)              
            var state = getState()    

            if(action.type === "counter/incrementByAmount"){
                changeState(exportState(state)) 
            }
                       
            return returnValue
        }
    }
    
 
    const preloadedState = { 
        counter: importState(initState)
    }
      

    const middleware = [...getDefaultMiddleware(), sender]
    
    
    var store = configureStore({
        reducer: {
          counter: counterReducer,
        },
        middleware,
        preloadedState
      });
      
  
    return(
        <React.StrictMode>
            <Provider store={store}>
                <App/>
            </Provider>
        </React.StrictMode>
    )
}
  

export default Embed


