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
        try{
            let response = await fetch('http://a8141bcf5159.ngrok.io/autenticate',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({                    
                    username : this.state.userName,
                    password : this.state.password})
            });

            if (response.status == 200){
                let responsed = await response.json();
                this.TextInputName.clear();
                this.TextInputPassword.clear();
                this.props.onChangeUsername(responsed.username); //Cambia this.props.logged y this.props.username
            }else{
                console.log(response.status) // Mostrar en consola qué código HTTP es
                alert('La autenticación no ha sido satisfactoria')
                this.TextInputName.clear();
                this.TextInputPassword.clear();
            }
        }
        catch(error){
            console.log(error)
        }
    }



    render(){
        return(
            <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <Text>Username:</Text>
                <TextInput ref={inputName => {this.TextInputName = inputName}} style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onUserNameChange}/>
                <Text>Password:</Text>
                <TextInput ref={inputPassword => {this.TextInputPassword = inputPassword}} style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onPasswordChange}/>
                <TouchableHighlight style={styles.button} onPress = {() => this.sendToServer()}>
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
