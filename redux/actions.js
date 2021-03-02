export function activateSearch(){
    return { type: 'ACTIVATE_SEARCH'}
}

export function localFound(){
    return {type: 'LOCAL_FOUND'}
}

export function arriveToken(token){
    return {type: 'ARRIVE_TOKEN', payload:{token}}
}