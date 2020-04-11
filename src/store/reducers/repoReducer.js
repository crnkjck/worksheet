
const initState = {
    currentFile: "",
    repoList:[],
    currentRepo: "",
    branchList:[],
    currentBranch:"",
    currentRepoData:[],
    path:""
};


const repoReducer = (state = initState, action) => {
    switch(action.type){
        case "LOAD_FILE" : 
            console.log("LOAD_FILE", action, state)
            return {
                ...state,
                currentFile: action.file
            };

        case "CLOSE_FILE" :  
            return  {
                ...state,
                currentFile: ""
            }; 

        case "SET_REPO_LIST" : 
            console.log("SET_REPO_LIST", action, state)
            return {
                ...state,
                repoList: action.repoList
            };
         
        case "SET_CURRENT_REPO" :  
            return  {
                ...state,
                currentRepo: action.currentRepo,
                branchList: action.branchList
            }; 
        case "SET_CURRENT_REPO_DATA" :  
            return  {
                ...state,
                currentBranch: action.currentBranch,
                currentRepoData: action.currentRepoData,
                path: action.path
            }; 

        case "UPDATE_REPO" : 
            console.log("UPDATE_REPO", action, state)
            return {
                ...state,
                repoList: action.repoList,
                currentRepo: action.currentRepo,
                branchList: action.branchList,
                currentBranch: action.currentBranch,
                currentRepoData: action.currentRepoData,
                path: action.path
            };
        case "RESET_REPO_DATA" :  
            return  {
                ...state,
                repoList:[],
                currentRepo: "",
                branchList:[],
                currentBranch:"",
                currentRepoData:[],
                path:""
            }; 

        
        default:
            return state;
    }
}

export default repoReducer;