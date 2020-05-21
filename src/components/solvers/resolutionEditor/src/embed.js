import React from 'react';
import ReactDOM from 'react-dom';

import App from "./components/App";
//import store from './app/store';
import { Provider, useDispatch } from 'react-redux';

import {importState, exportState} from "./reducers/index"

import { configureStore,getDefaultMiddleware  } from '@reduxjs/toolkit';

import { createStore,applyMiddleware } from 'redux'

import reducer from './reducers'


const Embed = ({initState,changeState} = {}) => {
    
    const sender = ({getState}) => { 
        return next => action => {       
            const returnValue = next(action)     
            
            var x = getState()
            console.log(action)
            console.log(x)
            if(action.type === "ADD_STEP"){
                var s = exportState(x)
                changeState(s)
            }
            

            return returnValue
        }
    }
    
      
    var store = null
    if(initState === ""){
        /*
        store = configureStore({
            reducer,
            middleware
          });
          */
         store = createStore(
            reducer,
            applyMiddleware(sender)
          );
    }else{
        console.log(importState(initState))
        const preloadedState = { 
            state: importState(initState)
        }
        /*
        store = configureStore({
            reducer,
            middleware,
            preloadedState
          });*/

          store = createStore(
            reducer,
            applyMiddleware(sender)
          );
    }
    
      
  
    return(
        <React.StrictMode>
            <Provider store={store}>
                <App initState = {initState}/>
            </Provider>,
        </React.StrictMode>
    )
}
  

export default Embed


