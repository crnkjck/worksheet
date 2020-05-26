import { loadCards } from "./cardActions"
import { Base64 } from 'js-base64';

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
    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.listBranches({
            owner: repo.owner.login,
            repo: repo.name,
            headers: {
                'If-None-Match': ''
              }      
        }).then((result) => {
            dispatch({
                type: "SET_CURRENT_REPO",
                currentRepo: repo,
                branchList: result.data,
            headers: {
                'If-None-Match': ''
              }
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
    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.getContents({
            owner: currentRepo.owner.login,
            repo: currentRepo.name,
            ref: branch.name,
            path: path,
            headers: {
                'If-None-Match': ''
              }
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


export const loadFile = (repo, file, path, format, octokit,back) => {
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
            back()
           console.log(err)
        })
    }
}


export const loadFromUrl = (repo, branch, path, octokit) => {
    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
            working:true
        })
        octokit.repos.getContents({
            owner: repo.currentRepo.owner.login,
            repo: repo.currentRepo.name,
            ref: branch.name,
            path: path,
            headers: {
                'If-None-Match': ''
              }
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


export const createFile = (name,hist, repo, octokit) => {
    return  (dispatch) => {
        var newPath = repo.path + (repo.path === "" ? name : "/" + name) + ".json"
        var newId = Date.now().toString() + (Math.random()*9999).toString()
        var newCard = {id: newId, solver: "", solverContent:"", content:""}
        var newCardArr = {type:"magic",cards: [newCard], cardOrder: [newId] }
        
        
        var content = Base64.encode(JSON.stringify(newCardArr))
        octokit.repos.createOrUpdateFile({
            owner: repo.currentRepo.owner.login,
            repo: repo.currentRepo.name,
            path: newPath,
            branch: repo.currentBranch.name,
            message: "...",
            content: content, 
            headers: {
                'If-None-Match': ''
              }
            }).then((result) => {               
                dispatch({
                    type: "CREATE_FILE",
                    currentRepoData: [...repo.currentRepoData, result.data.content]
                })      
                hist.push(hist.location.pathname + "/" + name + ".json")
            })
                
            .catch((err) => {
                alert("File was not saved.\n Please try again.")
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