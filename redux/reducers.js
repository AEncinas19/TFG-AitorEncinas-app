import { combineReducers } from "redux";

function activated(state = false, action = {}) {
    switch(action.type) {
        case 'ACTIVATE_SEARCH':
            return !state;
        default:
            return state;
    }
}

function locationdetected(state = false, action = {}) {
    switch(action.type) {
        case 'LOCAL_FOUND':
            return true;
        default:
            return state;
    }
}

function token(state = '', action = {}){
    switch(action.type){
        case 'ARRIVE_TOKEN':
            return action.payload.token;
        default:
            return state;
    }
}

const GlobalState = (combineReducers({
    activated,
    locationdetected,
    token
}));

export default GlobalState;
