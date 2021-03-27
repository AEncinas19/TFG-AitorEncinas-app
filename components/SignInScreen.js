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

    let comprobacion = (this.state.userName.trim().length > 5) && (this.state.password.trim().length > 5);
    console.log(comprobacion)

    if (comprobacion){

        try{
            let response = await fetch('http://a8141bcf5159.ngrok.io/register',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username : this.state.userName,
                    password : this.state.password,
                })
            });

            let responsed = await response.json();
            alert(responsed.error || responsed.success)
            this.TextInputName.clear();
            this.TextInputPassword.clear();
        }
        catch(error){
            console.log(error)
        }
    }
    else{
            alert("username y password deben tener una longitud superior a 6 caracteres")
        }
    }



    render(){
        return(
            <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <View>
                    <Text>Username:</Text>
                    <TextInput ref={inputName => {this.TextInputName = inputName}} style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onUserNameChange}/>
                </View>
                <View>
                    <Text>Password:</Text>
                    <TextInput ref={inputPassword => {this.TextInputPassword = inputPassword}} style={{height:70, alignSelf:'stretch', fontSize:25, padding:5}}onChangeText={this.onPasswordChange}/>
                </View>
                <TouchableHighlight style={styles.button} onPress = {() => this.registerToServer()}>
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
