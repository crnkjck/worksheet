import { loadCards } from "./cardActions"


export const findUserRepos = (octokit) => {
    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.listForAuthenticatedUser({type:"owner"})
        .then((result) => {
            dispatch({
                type: "SET_REPO_LIST",
                repoList:result.data 
            })
            dispatch({
                type: "SET_WORKING",
                working: false
            })
        }).catch((e) => {
            console.log(e)
        })
    }   
}


export const setCurrentRepo = (repo, octokit) => {
    var tempData = []

    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.listBranches({
            owner: repo.owner.login,
            repo: repo.name,        
        }).then((result) => {
            dispatch({
                type: "SET_CURRENT_REPO",
                currentRepo: repo,
                branchList: result.data
            })
            dispatch({
                type:"CLOSE_CARDS"
            })
            dispatch({
                type: "SET_WORKING",
                working:false
            })
        }).catch((e) => {
            console.log(e)
        })
    }   
}


export const setCurrentRepoData = (currentRepo, branch, path, octokit) => {
    var tempData = []

    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.getContents({
            owner: currentRepo.owner.login,
            repo: currentRepo.name,
            ref: branch.name,
            path: path
        }).then((result) => {
            dispatch({
                type: "SET_CURRENT_REPO_DATA",
                currentBranch: branch,
                currentRepoData: result.data,
                path: path
            })
            dispatch({
                type:"CLOSE_CARDS"
            })
            dispatch({
                type: "SET_WORKING",
                working:false
            })
        }).catch((e) => {
            console.log(e)
            alert("File does not exist in this branch")
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
        dispatch({
            type: "SET_WORKING",
             working:true
        })

        octokit.repos.getContents({
            owner: repo.currentRepo.owner.login,
            repo: repo.currentRepo.name,
            path: path,
            ref: repo.currentBranch.name,
            mediaType: {
                format: format
            },
            headers: {
                'If-None-Match': ''
              }
        }).then((result) => {
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
            dispatch({
                type: "SET_WORKING",
                working:false
            })
            
        }).catch((err) => {
           console.log(err)
        })
    }
}


export const loadFromUrl = (repo, branch, path, octokit) => {
    var tempData = []

    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.getContents({
            owner: repo.currentRepo.owner.login,
            repo: repo.currentRepo.name,
            ref: branch.name,
            path: path
        }).then((result) => {
            if(Array.isArray(result.data)){
                dispatch(setCurrentRepoData(repo.currentRepo,branch, path, octokit))
            }else{
                var tmp = path.split("/")
                tmp.pop()

                var x = tmp.reduce((result, item) => {
                    return `${result}${item}/`
                  }, "")
                  if(x[x.length - 1] === "/"){     
                    x = x.slice(0,x.length-1)
                  }

                dispatch(setCurrentRepoData(repo.currentRepo,branch, x, octokit))
            }
            
            dispatch({
                type: "SET_WORKING",
                working:false
            })
        }).catch((e) => {
            console.log(e)
            alert("File not found")
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