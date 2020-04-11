import authReducer from "./authReducer"
import cardReducer from "./cardReducer"
import utilityReducer from "./utilityReducer"
import repoReducer from "./repoReducer"
import {combineReducers} from "redux";
import {firestoreReducer} from "redux-firestore"

const rootReducer = combineReducers({
    auth: authReducer,
    card: cardReducer,
    utility: utilityReducer,
    repo: repoReducer,
    firestore: firestoreReducer
});

export default rootReducer;