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


const GlobalState = (combineReducers({
    activated,
    locationdetected
}));

export default GlobalState;
