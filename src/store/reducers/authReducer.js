
const initState = {
    userName:"",
    accessToken:"",
    userData:"",
    octokit: null
};


const authReducer = (state = initState, action) => {
    switch(action.type){
        case "LOGIN_USER" : 
        console.log("LOGIN", action, state)
            return {
                user: action.data,
                accessToken: action.data.credential.accessToken,
                octokit: action.octokit
               
            };
        case "LOGOUT_USER" :  
            return  {
                userName:"",
                accessToken:"",
                userData:"",
                octokit: null
            };  
        
        case "LOGIN_USER_ERROR":
            console.log("Error", action.err)
            return state;
        case "LOGOUT_USER_ERROR":
            console.log("Error", action.err)
            return state;
        default:
            return state;
    }
}

export default authReducer;