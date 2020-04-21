
const initState = {
    user:"",
    accessToken:"",
    octokit: null
};


const authReducer = (state = initState, action) => {
    switch(action.type){
        case "LOGIN_USER" : 
            return {
                user: action.data,
                accessToken: action.data.credential.oauthAccessToken,
                octokit: action.octokit   
            };
        case "LOGOUT_USER" :  
            return  {
                user:"",
                accessToken:"",
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