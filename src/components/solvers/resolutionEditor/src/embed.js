import React from 'react';
import App from "./components/App";
import { Provider} from 'react-redux';
import {importState, exportState} from "./reducers/index"
import { createStore,applyMiddleware } from 'redux'
import reducer from './reducers'


const Embed = ({initState,changeState} = {}) => {
    
    const sender = ({getState}) => { 
        return next => action => {    
            const returnValue = next(action) 
//Put If statement here to activate only on certain action   
            if(action.type === "INPUT_BLUR" || action.type === "ADD_STEP" || action.type === "DELETE_STEP"){
                changeState(exportState(getState())) 
            }              
            return returnValue
        }
    }
    let preloadedState = null
    if(initState !== ""){
        preloadedState = importState(initState) 
    }else{
        preloadedState = importState("{\"language\":{\"consts\":{\"input\":\"\",\"object\":[],\"error\":\"\",\"symbols\":[]},\"funs\":{\"input\":\"\",\"object\":[],\"error\":\"\",\"symbols\":[]},\"preds\":{\"input\":\"\",\"object\":[],\"error\":\"\",\"symbols\":[]}},\"steps\":{\"order\":[],\"allSteps\":[],\"rank\":[],\"id\":0},\"inputChange\":{\"originValue\":\"\"}}")
    }

    const store = createStore(
        reducer,
        preloadedState,
        applyMiddleware(sender)
    );
    return(
        <React.StrictMode>
            <Provider store={store}>
                <App/>
            </Provider>
        </React.StrictMode>
    )
}
  

export default Embed




