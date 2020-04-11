
const initState = {
    octokit: null
};


const utilityReducer = (state = initState, action) => {
    switch(action.type){
        case "INIT_OCTOKIT" : 
            console.log("INIT_OCTOKIT", action, state)
            return {
                octokit: action.octokit
            };
        case "CLOSE_OCTOKIT" :  
            return  {
                octokit: null
            };  
        default:
            return state;
    }
}

export default utilityReducer;