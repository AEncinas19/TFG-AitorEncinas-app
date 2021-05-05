import React from 'react';
import{ View, TextInput, TouchableHighlight, StyleSheet, Text, TouchableOpacity } from'react-native';

import {baseURL} from '../consts/url';

export default class LogInScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {userName: "", password: "", passwordvisible: true}
    }

    onUserNameChange = (text) => {
        this.setState({userName: text})
    }

    onPasswordChange = (text) => {
        this.setState({password: text})
    }

    showPassword = () => {
        this.setState({
            passwordvisible: !this.state.passwordvisible
        })
    }

    async sendToServer() {
        try{
            let response = await fetch(baseURL+'/autenticate',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({                    
                    username : this.state.userName.trim(),
                    password : this.state.password.trim()})
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
            //<View style={{ flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center' }}> style={{height:70, alignSelf:'center', fontSize:25, padding:5}}
            <View style={styles.container}>
                <View style={styles.inputView} >
                    <TextInput  
                        ref={inputName => {this.TextInputName = inputName}}
                        style={styles.inputText}
                        placeholder="Username..." 
                        placeholderTextColor="white"
                        onChangeText={this.onUserNameChange}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput  
                        ref={inputPassword => {this.TextInputPassword = inputPassword}}
                        style={styles.inputText}
                        placeholder="Password..." 
                        placeholderTextColor="white"
                        onChangeText={this.onPasswordChange}
                        secureTextEntry={this.state.passwordvisible}/>
                </View>
                <TouchableHighlight onPress = {() => this.showPassword()}>
                <Text style={{alignSelf: 'center', justifyContent:'space-around', color:'black'}}>{this.state.passwordvisible ? "Ver contraseña" : "Ocultar contraseña"}</Text>
                </TouchableHighlight>
                <TouchableOpacity style={styles.loginBtn} onPress = {() => this.sendToServer()}>
                    <Text style={styles.loginText}>LogIn</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => this.props.onChangeState()}>
                    <Text style={{color:"black", fontSize:15, margin:10}}>SignUp</Text>
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
        marginBottom:20,
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