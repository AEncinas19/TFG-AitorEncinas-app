import React, { Component } from 'react';
import {connect, Provider} from 'react-redux';
import {View, Image, Text, StyleSheet, Alert, TouchableHighlight} from "react-native";

import{NavigationContainer} from '@react-navigation/native';
//import {SafeAreaView} from "react-native-safe-area-context";

import { logging, stateLog } from '../redux/actions';
import IndexScreen from './IndexScreen';
import LogInScreen from './LogInScreen';
import SignInScreen from './SignInScreen';

class LoggingScreen extends React.Component {

    render() {
        if (this.props.logged) {
            return (
                <View style= {{flex:1}} className="IndexScreen">
                    <IndexScreen />
                </View>
            )
        }
        else {
            if (this.props.logState == "LOGIN") {
                return (
                    <View style={{flex:1}} className="LogScreen">
                        <LogInScreen onChangeUsername={(username)=>this.props.dispatch(logging(username))}
                                     onChangeState={()=>this.props.dispatch(stateLog("SIGNIN"))}
                        />
                    </View>
                )
            }
            else if (this.props.logState == "SIGNIN"){
                return(
                    <View style={{flex:1}} className="SignScreen">
                        <SignInScreen onChangeState={()=>this.props.dispatch(stateLog("LOGIN"))} 
                        />
                    </View>
                )
            }
            else{
                return (
                    <View style={{flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center' }}>
                        <TouchableHighlight style={styles.button} onPress = {() => this.props.dispatch(stateLog("LOGIN"))}>
                            <Text>Log In</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.button} onPress = {() => this.props.dispatch(stateLog("SIGNIN"))}>
                            <Text>Sign In</Text>
                        </TouchableHighlight>
                    </View>
                )
            }
        } 
    }
}

const styles = StyleSheet.create({
    button: {
        height: 60,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'green',
        fontSize: 25,
        textAlign: 'center',
        padding: 10
    }
}
    );

function mapStateToProps(state) {
  return {
    ...state
  };
}

//export default App;
export default connect(mapStateToProps)(LoggingScreen);