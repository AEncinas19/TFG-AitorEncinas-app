export function activateSearch(){
    return { type: 'ACTIVATE_SEARCH'}
}

export function actualLocation(latitud, longitud){
    return {type: 'ACTUAL_LOCATION', payload:{latitud, longitud}}
}

export function localFound(){
    return {type: 'LOCAL_FOUND'}
}

export function arriveToken(token){
    return {type: 'ARRIVE_TOKEN', payload:{token}}
}

export function logging(username){
    return {type: 'LOGGING', payload:{username}}
}

export function stateLog(log){
    return {type: 'LOG_STATE', payload:{log}}
}

export function arriveShop(shop){
    return {type: 'ARRIVE_SHOP', payload:{shop}}
}

export function addProduct(item){
    return {type: 'ADD_PRODUCT', payload:{item}}
}

export function removeProduct(item){
    return {type: 'REMOVE_PRODUCT', payload:{item}}
}

export function arriveShops(shops){
    return {type: 'ARRIVE_SHOPS', payload:{shops}}
}