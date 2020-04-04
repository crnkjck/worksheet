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
*/


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

        /*
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
    })*/
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
    /*
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
    */
    
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

export const loadCards = (item) => {
    var parsedItem = JSON.parse(item)
    var cards = parsedItem.cards
    var cardOrder = parsedItem.cardOrder
    return(dispatch)=>{
        try{
        dispatch({
            type:"LOAD_CARD", 
            cards,
            cardOrder   
        }) }  
        catch(err) {
            dispatch({
                type: "LOGOUT_USER_ERROR",
                err
            })
        }

    }
}