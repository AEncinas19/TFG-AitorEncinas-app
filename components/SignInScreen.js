import React from 'react';
import{ View, TextInput, TouchableHighlight, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView } from'react-native';

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
            <View style={styles.container}>
                <View style={styles.inputView} >
                    <TextInput  
                        ref={inputName => {this.TextInputName = inputName}}
                        style={styles.inputText}
                        placeholder="Username..." 
                        placeholderTextColor="white"
                        onChangeText={this.onUserNameChange}/>
                </View>
                <View style={styles.inputView2} >
                    <TextInput  
                        ref={inputPassword => {this.TextInputPassword = inputPassword}}
                        style={styles.inputText}
                        placeholder="Password..." 
                        placeholderTextColor="white"
                        onChangeText={this.onPasswordChange}
                        secureTextEntry={this.state.passwordvisible}/>
                </View>
                <TouchableHighlight style={{marginBottom: 5}} onPress = {() => this.showPassword()}>
                <Text style={{alignSelf: 'center', justifyContent:'space-around', color:'black'}}>{this.state.passwordvisible ? "Ver contraseña" : "Ocultar contraseña"}</Text>
                </TouchableHighlight>
                <View style={styles.inputView2} >
                    <TextInput  
                        ref={inputConfirmPassword => {this.TextInputConfirmPassword = inputConfirmPassword}}
                        style={styles.inputText}
                        placeholder="Confirm Password..." 
                        placeholderTextColor="white"
                        onChangeText={this.onPasswordChange}
                        secureTextEntry={this.state.passwordvisible}/>
                </View>
                <TouchableHighlight style={{marginBottom: 20}} onPress = {() => this.showPassword()}>
                <Text style={{alignSelf: 'center', justifyContent:'space-around', color:'black'}}>{this.state.passwordvisible ? "Ver contraseña" : "Ocultar contraseña"}</Text>
                </TouchableHighlight>
                <TouchableOpacity style={styles.loginBtn} onPress = {() => this.registerToServer()}>
                    <Text style={styles.loginText}>SignUp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => this.props.onChangeState()}>
                    <Text style={{color:"black", fontSize:15, margin:10}}>LogIn</Text>
                </TouchableOpacity>
            </View>
        )
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    inputView:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginTop:80,
        marginBottom:50,
        justifyContent:"center",
        padding:20
    },
    inputView2:{
        width:"80%",
        backgroundColor:"#465881",
        borderRadius:25,
        height:50,
        marginBottom:0,
        justifyContent:"center",
        padding:20
    },
      inputText:{
        height:50,
        color:"white"
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#d9931c",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:100,
        marginBottom:10,
      },
    loginText:{
        color:"white",
        fontSize:20
      }

}
);
