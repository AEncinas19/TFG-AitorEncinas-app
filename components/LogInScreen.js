import React from 'react';
import{ View, TextInput, TouchableHighlight, StyleSheet, Text } from'react-native';
import {connect} from 'react-redux';

import { logging } from '../redux/actions';

export default class LogInScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {userName: "", password: ""}
    }

    onUserNameChange = (text) => {
        this.setState({userName: text})
    }

    onPasswordChange = (text) => {
        this.setState({password: text})
    }

    async sendToServer() {
        let response = await fetch('https:localhost:8000/',{
            method: 'POST',
            HEADERS: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
            }
        });
        let responsed = await response.json();
        console.log(responsed)
        this.props.onChangeUsername(this.state.userName);
        this.onPasswordChange("");
        this.onUserNameChange("");
    }



    render(){
        return(
            <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <Text>Username:</Text>
                <TextInput style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onUserNameChange}/>
                <Text>Password:</Text>
                <TextInput style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onPasswordChange}/>
                <TouchableHighlight style={styles.button} onPress = {() => this.props.sendToServer()}>
                    <Text>Log In</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress = {() => this.props.onChangeState()}>
                    <Text>Sign In</Text>
                </TouchableHighlight>
            </View>
        )
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
