
export function importState(initState) {
    var state = initState === "" ? {value:0} : JSON.parse(initState)
return state
    
}
