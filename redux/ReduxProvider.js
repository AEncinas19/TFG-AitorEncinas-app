import {Provider} from 'react-redux';
import GlobalState from './reducers';
import { createStore } from 'redux';
import {View} from 'react-native';

import{NavigationContainer, StackActions} from '@react-navigation/native';
import{ createMaterialTopTabNavigator} from'@react-navigation/material-top-tabs';

import IndexScreen from '../components/IndexScreen';
import AppScreen from '../components/AppScreen';
import LoggingScreen from '../components/LoggingScreen';

import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default class ReduxProvider extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            latitud: 0,
            longitud: 0,
            locationdetected: false,
            activated: false,
            token: "",
            logState: "",
            logged: false,
            username: "",
            shop: {}
        };
        this.store = this.configureStore();
    }
    render(){
        return (
                <Provider store={ this.store }>
                    <View style={{height: 10}}></View> 
                    <NavigationContainer>
                        <Tab.Navigator initialRouteName="LogPage">
                            <Tab.Screen name="LogPage" component={LoggingScreen} />
                            <Tab.Screen name="App" component={AppScreen} />
                        </Tab.Navigator>
                    </NavigationContainer>
                </Provider>
        );
    }
    configureStore(){
        return createStore(GlobalState, this.initialState);
    }
}
