import { Base64 } from 'js-base64';


export const createCard = (cards, cardOrder, insertIndex, type, repo, octokit) => {
    var tempOrder = cardOrder
    var newId = Date.now().toString() + (Math.random()*9999).toString()
    var newCard = {id: newId, solver: type, solverContent:"", content:""}
    tempOrder.splice(insertIndex,0, newId)

    var newCardArr = {type:"magic",cards: [...cards.cards, newCard], cardOrder: tempOrder }

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
            console.log(result)
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
            console.log(result)
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
        })
    }
}
 

export const deleteCard = (card, cards, cardOrder,  repo, octokit) => {
    
    var tempOrder = cardOrder
    var removeIndex = cardOrder.indexOf(card.id)
    tempOrder.splice(removeIndex,1)
    console.log(tempOrder)

    var newCardArr = {
        type:"magic",
        cardOrder: tempOrder, 
        cards: cards.cards.filter(item => item.id !== card.id) 
    }
    console.log(newCardArr)
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
            console.log(result)
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






/*


export const createTodo = (cardOrder,taskName) => {
    console.log(cardOrder)
    return  (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection("todos").add({
            title : "",
            assignment:"",
            content: ""
        }).then(
            (docRef) => _updateOrder([...cardOrder,docRef.id], taskName, dispatch, firestore)
        ).catch((err) => {
            dispatch({
                type: "CREATE_TODO_ERROR",
                err
            })
        })
    }
    
}



export const createCard = (cardOrder,taskName, insertIndex = null) => {
    
    return  (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        var cardsColRef = firestore.collection("cardData")
        var orderDocRef = firestore.collection("cardOrder").doc(taskName)

        var newCardRef = firestore.collection('cardData').doc()

       
        var batch = firestore.batch()
        if(insertIndex === null){
            batch.update(orderDocRef,{id:orderDocRef.id,order:[...cardOrder,newCardRef.id]})
        }else{
            batch.update(orderDocRef,{id:orderDocRef.id,order:[...cardOrder.slice(0,insertIndex), newCardRef.id, ...cardOrder.slice(insertIndex)]}) 
        }
        
        batch.set(newCardRef,{content: ""})
        
        batch.commit()

      
        return firestore.runTransaction(function(transaction){

            return transaction.get(cardsColRef,orderDocRef).then(function(cardsRef, orderRef){
                if(!cardsRef.exists || !orderRef.exists){
                    throw "Document doesnt exist"
                }
                var newCards = cardsRef.data().add({
                    title : "",
                    assignment:"",
                    content: ""
                })

                var newOrder = orderRef.data().update({
                    order:cardOrder})
                
                console.log(newCards)
                console.log(newOrder)

                transaction.update(cardsColRef, newCards)
                transaction.update(orderRef, newOrder)
            }
        )
        }
        )
    
    .then(function() {
        console.log("Transaction successfully committed!");
    }).catch(function(error) {
        console.log("Transaction failed: ", error);
    })
}
}



export const updateCard = (todo) => {

    return  (dispatch) => {

        try{
            dispatch({
                type: "UPDATE_CARD",
                todo: todo
            })
        }catch(err){
            dispatch({
                type: "UPDATE_CARD_ERROR",
                err
            })
        }
    }
   
    return  (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const col = firestore.collection("cardData").doc(todo.id)
        
        
        col.update({
            content: todo.content
        }).then(() => {
            dispatch({
                type: "UPDATE_TODO",
                todo: todo
            })
        }).catch((err) => {
            dispatch({
                type: "UPDATE_TODO_ERROR",
                err
            })
        })
    }
   
    
}
 

export const deleteCard = (todo) => {
    return  (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const col = firestore.collection("cardData").doc(todo.id)
        col.delete()
        .then(() => {
            dispatch({
                type: "DELETE_CARD",
                todo: todo
            })
        }).catch((err) => {
            dispatch({
                type: "UPDATE_CARD_ERROR",
                err
            })
        })
    }
}



export const updateOrder = (cardOrder, name) => {
    console.log("UPDATE ORDER", cardOrder)
    console.log("UPDATE ORDER", name)
    return  (dispatch, getState, { getFirebase, getFirestore }) => {
        _updateOrder(cardOrder, name, dispatch, getFirestore());
    }
    
}

const _updateOrder = (cardOrder, name, dispatch, firestore) => {
    console.log("_updateOrder:", cardOrder, name);
    firestore.collection("cardOrder").doc(name).update({
        order:cardOrder,
    }).then(() => {
        console.log("dispatch after _updateOrder");
        dispatch({
            type: "UPDATE_ORDER",
        })
    }).catch((err) => {
        dispatch({
            type: "UPDATE_CARD_ERROR",
            err
        })
    })
}
*/