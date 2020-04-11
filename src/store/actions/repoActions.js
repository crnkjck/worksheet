

export const findUserRepos = (octokit) => {
    return  (dispatch) => {
        octokit.repos.listForAuthenticatedUser({type:"owner"})
        .then((result) => {
            dispatch({
                type: "SET_REPO_LIST",
                repoList:result.data 
            })
        }).catch((e) => {
            console.log(e)
        })
    }   
}


export const setCurrentRepo = (repo, octokit) => {
    var tempData = []

    return  (dispatch) => {
        octokit.repos.listBranches({
            owner: repo.owner.login,
            repo: repo.name,        
        }).then((result) => {
            result.data.map((item) => {
                tempData = [...tempData,item]
            })
            
            dispatch({
                type: "SET_CURRENT_REPO",
                currentRepo: repo,
                branchList: tempData
            })
        }).catch((e) => {
            console.log(e)
        })
    }   
}


export const setCurrentRepoData = (currentRepo, branch, path, octokit) => {
    var tempData = []

    return  (dispatch) => {
        octokit.repos.getContents({
            owner: currentRepo.owner.login,
            repo: currentRepo.name,
            ref: branch.name,
            path: path
        }).then((result) => {
            result.data.map( (item) => {
                tempData = [...tempData,item]
            })  

            dispatch({
                type: "SET_CURRENT_REPO_DATA",
                currentBranch: branch,
                currentRepoData: tempData,
                path: path
            })
        }).catch((e) => {
            console.log(e)
            alert("File does not exists in this branch")
        })
    }   
}



export const updateRepo = (item) => {
    console.log(item)
    return  (dispatch) => {
        try{
            dispatch({
                type: "UPDATE_REPO",
                repoList: item.repoList,
                currentRepo: item.currentRepo,
                branchList: item.branchList,
                currentBranch: item.currentBranch,
                currentRepoData: item.currentRepoData,
                path: item.path
            })
        }catch(err){
           console.log(err)
        }
    }
    
}




export const loadFile = (file) => {
    console.log(file)
    return  (dispatch) => {
        try{
            dispatch({
                type: "LOAD_FILE",
                file
            })
        }catch(err){
           console.log(err)
        }
    }
    
}



export const resetRepoData = () => {
    return  (dispatch) => {
        try{
            dispatch({
                type: "RESET_REPO_DATA"
            })
        }catch(err){
           console.log(err)
        }
    }   
}