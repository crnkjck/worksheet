

const initState = {
    
    /*
    cardOrder:["1","2"], 
    cards:[{id:"1",content:"bla"},{id:"2",content:"hallo"},{id:"3",content:"xxxxxxxxxx"}]
    */
    working: false,
    cardOrder:[], 
    cards:[] 
    
};


const cardReducer = (state = initState, action) => {
    switch(action.type){
        case "LOAD_CARD" : 
            return {
                ...state,
                cards: action.cards,
                cardOrder: action.cardOrder
            };
        case "CREATE_CARD" : 
            
            return {
                ...state,
                cards: action.cards,
                cardOrder: action.cardOrder
            };
        case "UPDATE_CARD" : 
            console.log(action)
            return {
                ...state,
                cards: action.cards,
                cardOrder: action.cardOrder
            } 
        case "DELETE_CARD" : 
            return {
                ...state,
                cards: action.cards,
                cardOrder: action.cardOrder   
            }    
        case "CREATE_CARD_ERROR":
            console.log("Error", action.err)
            return state;

        case "UPDATE_ORDER":
            return{
                ...state,
                cardOrder: action.cardOrder
            }

        case "SET_WORKING":
            return{
                ...state,
                working: action.working
            }
        case "CLOSE_CARDS":
            return{
                ...state,
                cardOrder:[], 
                cards:[] 
            }
        default:
            return state;
    }
}

export default cardReducer;