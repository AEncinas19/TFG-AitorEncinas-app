import {Provider} from 'react-redux';
import GlobalState from './reducers';
import { createStore } from 'redux';


import{NavigationContainer} from '@react-navigation/native';
import{ createMaterialTopTabNavigator} from'@react-navigation/material-top-tabs';
import IndexScreen from '../components/IndexScreen';
import AppScreen from '../components/AppScreen';

import {SafeAreaView} from "react-native-safe-area-context";

import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default class ReduxProvider extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            locationdetected: false,
            activated: false
        };
        this.store = this.configureStore();
    }
    render(){
        return (
            <Provider store={ this.store }>
                <NavigationContainer>
                    <Tab.Navigator initialRouteName="Home">
                        <Tab.Screen name="Home" component={IndexScreen} />
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
