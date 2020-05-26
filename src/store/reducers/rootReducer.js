import authReducer from "./authReducer"
import cardReducer from "./cardReducer"
import repoReducer from "./repoReducer"
import {combineReducers} from "redux";
import {firestoreReducer} from "redux-firestore"

const rootReducer = combineReducers({
    auth: authReducer,
    card: cardReducer,
    repo: repoReducer,
    firestore: firestoreReducer
});

export default rootReducer;