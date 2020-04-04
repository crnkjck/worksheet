
const initState = {
    userName:"",
    accessToken:"",
    userData:""
};


const authReducer = (state = initState, action) => {
    switch(action.type){
        case "LOGIN_USER" : 
        console.log("LOGIN", action, state)
            return {
                user:action.data,
                accessToken:action.data.credential.accessToken,
               
            };
        case "LOGOUT_USER" :  
            return  {
                userName:"",
                accessToken:"",
                userData:""
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