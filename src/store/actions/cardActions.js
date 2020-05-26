import { Base64 } from 'js-base64';


export const createCard = (cards, cardOrder, insertIndex, type, repo, octokit) => {
    var tempOrder = cardOrder
    var newId = Date.now().toString() + (Math.random()*9999).toString()
    var newCard = {id: newId, solver: type, solverContent:"", content:""}
    tempOrder.splice(insertIndex,0, newId)
    var newCardArr = {type:"magic",cards: [...cards.cards, newCard], cardOrder: tempOrder }
    var content = Base64.encode(JSON.stringify(newCardArr))

    console.log(newCardArr)
    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
                working:true
        })
        octokit.repos.createOrUpdateFile({
        owner: repo.currentRepo.owner.login,
        repo: repo.currentRepo.name,
        path: repo.currentFile.path,
        branch: repo.currentBranch.name,
        message: "...",
        sha: repo.currentFile.sha,
        content: content, 
        headers: {
            'If-None-Match': ''
          }
        }).then((result) => {
            dispatch({
                type: "CREATE_CARD",
                cards: newCardArr.cards,
                cardOrder: newCardArr.cardOrder
            })
            dispatch({
                type: "SET_CURRENT_FILE",
                currentFile: result.data.content
            })
            dispatch({
                type: "SET_WORKING",
                    working:false
            })
        })
            
        .catch((err) => {
            alert("File was not saved.\n Please try again.")
            console.log(err)
            dispatch({
                type: "SET_WORKING",
                    working:false
            })
        })
    }
}



export const updateCard = (card, cards, repo, octokit) => {
    var newCardArr = {
        type:"magic",
        cardOrder: cards.cardOrder, 
        cards: cards.cards.map(item => (item.id === card.id ? {id: card.id, solver: card.solver, solverContent: card.solverContent, content: card.content}: item))
    }
    var content = Base64.encode(JSON.stringify(newCardArr))

    return(dispatch) => {
        dispatch({
            type: "SET_WORKING",
                working:true
        })
        octokit.repos.createOrUpdateFile({
            owner: repo.currentRepo.owner.login,
            repo: repo.currentRepo.name,
            path: repo.currentFile.path,
            branch: repo.currentBranch.name,
            message: "...",
            sha: repo.currentFile.sha,
            content: content,
            headers: {
                'If-None-Match': ''
              }
        }).then((result) => {
            dispatch({
                type: "UPDATE_CARD",
                cards: newCardArr.cards,
                cardOrder: newCardArr.cardOrder
            })
            dispatch({
                type: "SET_CURRENT_FILE",
                currentFile: result.data.content
            })
            dispatch({
                type: "SET_WORKING",
                    working:false
            })
        }).catch((err) => {
            console.log(err)
            dispatch({
                type: "SET_WORKING",
                    working:false
            })
        })
    }
}
 

export const deleteCard = (card, cards, cardOrder,  repo, octokit) => {
    
    var tempOrder = cardOrder
    var removeIndex = cardOrder.indexOf(card.id)
    tempOrder.splice(removeIndex,1)
    var newCardArr = {
        type:"magic",
        cardOrder: tempOrder, 
        cards: cards.cards.filter(item => item.id !== card.id) 
    }
    var content = Base64.encode(JSON.stringify(newCardArr))

    return  (dispatch) => {
        dispatch({
            type: "SET_WORKING",
                working:true
        })
        octokit.repos.createOrUpdateFile({
        owner: repo.currentRepo.owner.login,
        repo: repo.currentRepo.name,
        path: repo.currentFile.path,
        branch: repo.currentBranch.name,
        message: "...",
        sha: repo.currentFile.sha,
        content: content,
        headers: {
            'If-None-Match': ''
          }
        }).then((result) => {
            dispatch({
                type: "DELETE_CARD",
                cards: newCardArr.cards,
                cardOrder: newCardArr.cardOrder
            })
            dispatch({
                type: "SET_CURRENT_FILE",
                currentFile: result.data.content
            })
            dispatch({
                type: "SET_WORKING",
                    working:false
            })
        })
            
        .catch((err) => {    
            console.log(err)
            dispatch({
                type: "SET_WORKING",
                    working:false
            })
        })
    }
}



export const updateOrder = (cardOrder) => {

    return  (dispatch) => {
        
        try{
            dispatch({
                type: "UPDATE_ORDER",
                cardOrder
            })
        }catch(err){
            dispatch({
                type: "UPDATE_CARD_ERROR",
                err
            })
        }
    }
}


export const loadCards = (repo,result) => {

    var parsedItem = JSON.parse(result.data)
    var cards = parsedItem.cards
    var cardOrder = parsedItem.cardOrder
    return(dispatch)=>{
        try{
            dispatch({
                type:"LOAD_CARD",
                cards,
                cardOrder   
            }) 
            dispatch({
                type:"RESET_REPO_ON_FILE_OPEN"   
            }) 
        }catch(err) {
            dispatch({
                type: "LOGOUT_USER_ERROR",
                err
            })
        }

    }
}


export const closeCards = () => {
    return (dispatch) => {
        try{
            dispatch({
                type: "CLOSE_CARDS"
            })
        }catch(err){
           console.log(err)
        }
    } 
}

