import React from 'react';
import{ View, TextInput, TouchableHighlight, StyleSheet, Text, Icon, Input } from'react-native';

import {baseURL} from '../consts/url';

export default class LogInScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {userName: "", password: "", confirmpassword: "", passwordvisible: true, confirmpasswordvisible: true }
    }

    onUserNameChange = (text) => {
        this.setState({userName: text})
    }

    onPasswordChange = (text) => {
        this.setState({password: text})
    }

    onConfirmPasswordChange = (text) => {
        this.setState({confirmpassword: text})
    }

    showPassword = () => {
        this.setState({
            passwordvisible: !this.state.passwordvisible
        })
    }

    showConfirmPassword = () => {
        this.setState({
            passwordvisible: !this.state.confirmpasswordvisible
        })
    }

    async registerToServer() {

    let comprobacion1 = (this.state.userName.trim().length > 5) && (this.state.password.trim().length > 5);
    let comprobacion2 = this.state.password.trim() === this.state.confirmpassword.trim()

    if (comprobacion1){
        if(comprobacion2){

            try{
                let response = await fetch(baseURL+'/register',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Accept-encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username : this.state.userName.trim(),
                        password : this.state.password.trim(),
                    })
                });

                let responsed = await response.json();
                alert(responsed.error || responsed.success)
                this.TextInputName.clear();
                this.TextInputPassword.clear();
                this.textInsputConfirmPassword.clear();
            }
            catch(error){
                console.log(error)
            }
        }else{
            alert("contraseñas no coinciden")
        }
    }else{
            alert("username y password deben tener una longitud superior a 6 caracteres")
        }
    }



    render(){
        return(
            <View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <View>
                    <Text>Username:</Text>
                    <TextInput ref={inputName => {this.TextInputName = inputName}} style={{height:70, alignSelf:'center', fontSize:25, padding:5}}onChangeText={this.onUserNameChange}/>
                </View>
                <View>
                    <Text>Password:</Text>
                    <TextInput ref={inputPassword => {this.TextInputPassword = inputPassword}} style={{height:70, alignSelf:'center', fontSize:25, padding:5}} secureTextEntry={this.state.passwordvisible} onChangeText={this.onPasswordChange}/>
                    <TouchableHighlight style={styles.button2} onPress = {() => this.showPassword()}>
                    <Text style={{alignSelf: 'center', justifyContent:'space-around', color:'white'}}>{this.state.passwordvisible ? "Ver" : "Ocultar"}</Text>
                    </TouchableHighlight>
                </View>
                <View>
                    <Text>Confirm your Password:</Text>
                    <TextInput ref={inputConfirmPassword => {this.TextInputConfirmPassword = inputConfirmPassword}} style={{height:70, alignSelf:'center', fontSize:25, padding:5}}onChangeText={this.onConfirmPasswordChange}/>
                    <TouchableHighlight style={styles.button2} onPress = {() => this.showConfirmPassword()}>
                    <Text style={{alignSelf: 'center', justifyContent:'space-around', color:'white'}}>{this.state.confirmpasswordvisible ? "Ver" : "Ocultar"}</Text>
                    </TouchableHighlight>
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
        padding: 10,
        margin: 10
    },
    button2: {
        height: 30,
        width: 80,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'black',
        fontSize: 9,
        textAlign: 'center',
        padding: 10
    }
}
    );
