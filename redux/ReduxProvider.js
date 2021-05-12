import {Provider} from 'react-redux';
import GlobalState from './reducers';
import { createStore } from 'redux';
import {View, Text} from 'react-native';
import 'react-native-gesture-handler';
import{NavigationContainer, StackActions} from '@react-navigation/native';
import{ createMaterialTopTabNavigator} from'@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import AppScreen from '../components/AppScreen';
import LoggingScreen from '../components/LoggingScreen';

import React from 'react';

const Tab = createMaterialTopTabNavigator();
const Tab2 = createBottomTabNavigator();

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
            shop: {},
            shops: {}
        };
        this.store = this.configureStore();
    }
    render(){
        return (
                <Provider store={ this.store }>
                    <NavigationContainer>
                        <Tab2.Navigator initialRouteName="Home"
                                        screenOptions={({ route }) => ({
                                            tabBarIcon: ({ focused, color, size }) => {
                                                let iconName;
                                    
                                                if (route.name === 'Home') {
                                                iconName = focused
                                                    ? 'home-outline'
                                                    : 'home';
                                                } else if (route.name === 'App') {
                                                iconName = focused ? 'cart-outline' : 'cart';
                                                }
                                    
                                                // You can return any component that you like here!
                                                return <Ionicons name={iconName} size={size} color={color} />;
                                            },
                                            })}
                                        tabBarOptions={{
                                        activeTintColor: 'orange',
                                        inactiveTintColor: 'gray',
                                        showLabel: false
                                        }}>
                            <Tab2.Screen name="Home" component={LoggingScreen}/>
                            <Tab2.Screen name="App" component={AppScreen}/>
                        </Tab2.Navigator>
                    </NavigationContainer>
                </Provider>
        );
    }
    configureStore(){
        return createStore(GlobalState, this.initialState);
    }
}
