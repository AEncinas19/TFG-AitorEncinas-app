import React from 'react';
import{ View, TextInput, TouchableHighlight, StyleSheet, Text } from'react-native';

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

    async registerToServer() {
        let response = await fetch('https:localhost:8000/',{
            method: 'POST',
            HEADERS: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
            }
        });
        let responsed = await response.json();
        console.log(responsed)
        alert("Your user has been created succesfully")
        this.onUserNameChange("");
        this.onPasswordChange("");
    }



    render(){
        return(
            <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <View>
                    <Text>Username:</Text>
                    <TextInput style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onUserNameChange}/>
                </View>
                <View>
                    <Text>Password:</Text>
                    <TextInput style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onPasswordChange}/>
                </View>
                <TouchableHighlight style={styles.button} onPress = {() => this.props.registerToServer()}>
                    <Text>Sign In</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress = {() => this.props.onChangeState()}>
                    <Text>Log In</Text>
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
        justifyContent: 'center',
        backgroundColor: 'green',
        fontSize: 25,
        textAlign: 'center',
        padding: 10
    }
}
    );
