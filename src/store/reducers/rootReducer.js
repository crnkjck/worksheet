import authReducer from "./authReducer"
import todoReducer from "./todoReducer"
import {combineReducers} from "redux";
import {firestoreReducer} from "redux-firestore"

const rootReducer = combineReducers({
    auth: authReducer,
    todo: todoReducer,
    firestore: firestoreReducer
});

export default rootReducer;