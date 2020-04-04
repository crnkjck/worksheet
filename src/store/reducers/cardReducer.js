

const initState = {
    cards:[],
    cardOrder:[]
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
           
            return state;    
        case "DELETE_CARD" : 
           

            return state;    
        case "CREATE_CARD_ERROR":
            console.log("Error", action.err)
            return state;
        default:
            return state;
    }
}

export default cardReducer;