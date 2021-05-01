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
                    <IndexScreen navigation = {(tab) => this.props.navigation.navigate(tab)} />
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
                    <View style={styles.container}>
                        <Image source={require('../assets/LOGO_ESCUELA.png')}/>
                        <Text style={{color:"black",fontSize:10,margin:5}}>Realizada por Aitor Encinas Alonso</Text>
                        <View style={{margin:70}}></View>
                        <TouchableHighlight style={styles.loginBtn} onPress = {() => this.props.dispatch(stateLog("LOGIN"))}>
                            <Text style={styles.loginText}>LogIn</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.loginBtn} onPress = {() => this.props.dispatch(stateLog("SIGNIN"))}>
                            <Text style={styles.loginText}>SignUp</Text>
                        </TouchableHighlight>
                    </View>
                )
            }
        } 
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#d9931c",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10,
      },
    loginText:{
        color:"white",
        fontSize:20
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