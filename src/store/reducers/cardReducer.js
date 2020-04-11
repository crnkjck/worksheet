

const initState = {
    /*
    cardOrder:["1","2"], 
    cards:[{id:"1",content:"bla"},{id:"2",content:"hallo"},{id:"3",content:"xxxxxxxxxx"}]
    */
    cardOrder:[], 
    cards:[] 
    
};


const cardReducer = (state = initState, action) => {
    switch(action.type){
        case "LOAD_CARD" : 
            console.log(action)
            return {
                cards: action.cards,
                cardOrder: action.cardOrder
            };
        case "CREATE_CARD" : 
       
            return state;
        case "UPDATE_CARD" : 
            return {
                ...state,
                cards: state.cards.map(item => (item.id === action.card.id ? {id:action.card.id, content:action.card.content}:item))   
            } 
        case "DELETE_CARD" : 
            return {
                ...state,
                cards: state.cards.filter(item => item.id !== action.card.id)   
            }    
        case "CREATE_CARD_ERROR":
            console.log("Error", action.err)
            return state;

        case "UPDATE_ORDER":
            console.log(action.cardOrder)
            return{
                ...state,
                cardOrder: action.cardOrder
            }
        default:
            return state;
    }
}

export default cardReducer;