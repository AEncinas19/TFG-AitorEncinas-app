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
            return !state;
        default:
            return state;
    }
}

function logState(state = "", action = {}) {
    switch(action.type) {
        case 'LOG_STATE':
            return action.payload.log;
        default:
            return state;
    }
}

function logged(state = false, action = {}) {
    switch(action.type) {
        case 'LOGGING':
            return !state;
        default:
            return state;
    }
}

function username(state = "", action = {}) {
    switch(action.type) {
        case 'LOGGING':
            return action.payload.username;
        default:
            return state;
    }
}

function latitud(state = 0, action = {}) {
    switch(action.type) {
        case 'ACTUAL_LOCATION':
            return action.payload.latitud;
        default:
            return state;
    }
}

function longitud(state = 0, action = {}) {
    switch(action.type) {
        case 'ACTUAL_LOCATION':
            return action.payload.longitud;
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
    longitud,
    latitud,
    locationdetected,
    token,
    logState,
    logged,
    username
}));

export default GlobalState;
