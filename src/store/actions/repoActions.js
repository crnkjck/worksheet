import { loadCards } from "./cardActions"


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
            dispatch({
                type:"CLOSE_CARDS"
            })
            //dispatch(setCurrentRepoData(repo,{name:"master"},"", octokit))
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
            console.log(result)
            result.data.map( (item) => {
                tempData = [...tempData,item]
            })  

            dispatch({
                type: "SET_CURRENT_REPO_DATA",
                currentBranch: branch,
                currentRepoData: tempData,
                path: path
            })
            dispatch({
                type:"CLOSE_CARDS"
            })
        }).catch((e) => {
            console.log(e)
            alert("File does not exists in this branch")
        })
    }   
}



export const updateRepo = (item) => {
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


export const loadFile = (repo, file, path, format, octokit) => {
    return  (dispatch) => {
        octokit.repos.getContents({
            owner: repo.currentRepo.owner.login,
            repo: repo.currentRepo.name,
            path: path,
            ref: repo.currentBranch.name,
            mediaType: {
                format: format
            }
        }).then((result) => {
            console.log(result)
            var cardJson = false
            try{
                var parsedItem = JSON.parse(result.data)
                cardJson = parsedItem.type === "magic" ? true : false
            }catch(e){
                console.log("Not JSON")
            }
            
            if(cardJson){
                dispatch(loadCards(repo,result))
                dispatch({
                    type: "LOAD_FILE",
                    currentFile: file,
                    currentFileContent: null
                })
                
                
            }else{
                dispatch({
                    type: "LOAD_FILE",
                    currentFile: file,
                    currentFileContent: result
                })
            }
            
        }).catch((err) => {
           console.log(err)
        })
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