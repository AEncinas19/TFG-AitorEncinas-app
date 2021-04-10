import React from 'react';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import { activateSearch, actualLocation, arriveToken, logging, localFound, arriveShop } from '../redux/actions';
import { Alert, Platform } from 'react-native'
import * as Permissions from 'expo-permissions';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

import {baseURL} from '../consts/url';

const hasNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (finalStatus === 'granted') return true;
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Warning',
        'You will not receive notifications if you do not enable push notifications. If you would like to receive notifications, please enable push notifications for Fin in your settings.',
        [
          { text: 'Cancel'},
          // we can automatically open our app in their settings
          // so there's less friction in turning notifications on
          { text: 'Enable Notifications', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      )
      return false;
      
    }
  } catch (error) {
    Alert.alert(
      'Error',
      'Something went wrong while check your notification permissions, please try again later.'
    );
    return false;
  }
}

const hasGeolocationPermission = async () => {
  try {
    const { status } = await Location.requestPermissionsAsync();
    let finalStatus = status
    if (finalStatus === 'granted') return true;
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Warning',
        'You will not search if you do not enable geolocation in this app. If you would like to search, please enable geolocation for Fin in your settings.',
        [
          { text: 'Cancel'},
          // we can automatically open our app in their settings
          // so there's less friction in turning geolocation on
          { text: 'Enable Geolocation', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      )
      return false;
      
    }
  } catch (error) {
    Alert.alert(
      'Error',
      'Something went wrong while check your geolocation permissions, please try again later.'
    );
    return false;
  }
}

const checkIfLocationEnabled = async () => {
  let enabled = await Location.hasServicesEnabledAsync();
  if (!enabled){
    alert('Location service not enabled, please enable it to continue')
  }
  else {
    return enabled;
  }
}

class IndexScreen extends React.Component {

  async componentDidMount() {
    hasNotificationPermission()
    hasGeolocationPermission()
    this.registerForPushNotificationsAsync()
    Notifications.addNotificationReceivedListener(notification => { 
      console.log(notification)
      Alert.alert(notification.request.content.title, notification.request.content.body)
      this.props.navigation('App');
    })
    Notifications.addNotificationResponseReceivedListener( response => {
      console.log(response);
      this.props.navigation('App');
    }) /*cuando el usuario pulsa encima, cambia de pantalla*/
    
    this.myInterval = setInterval(async () => {
      if (this.props.activated){
        let Notpermission = await hasNotificationPermission();
        let Geopermission = await hasGeolocationPermission();
        let EnableLocation = await checkIfLocationEnabled();
        if (Notpermission && Geopermission && EnableLocation){
          this.getPosition();
          this.sendLocation();
          console.log("Se ha activado")
        } //Si cambia algo de los permisos, se deja de enviar.
        else {return}
      }
    }, 30000)
  }

  async componentWillUnmount(){
    clearInterval(this.myInterval)
  }

  activate = async () => {
    let Notpermission = await hasNotificationPermission();
    let Geopermission = await hasGeolocationPermission();
    let EnableLocation = await checkIfLocationEnabled();
    if (Notpermission && Geopermission && EnableLocation){
      if (!this.props.activated){
        this.props.dispatch(activateSearch());
        this.getPosition();
        this.sendLocation();
      }
      else
        this.props.dispatch(activateSearch())
        if (this.props.locationdetected)
          this.props.dispatch(localFound());
        //this.deleteToken()
    }
    else{
        return
    }
  }

    render() {
      if (this.props.logged){
        return(
            <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                <Text style={{flex:1, fontSize: 35 }}> Welcome {this.props.username} to this demo App </Text> 
                <Text style={{flex:1, fontSize: 35 }}> Press  'Start Search'</Text> 
                <Text style={{flex:1, fontSize: 20 }}> Your expo push token: {this.props.token}</Text> 
                <Text style={{flex:1, fontSize: 20 }}> Geolocation & Push notifications: {this.props.activated? "true" : "false"} </Text> 
                <TouchableHighlight style={styles.button} onPress = {() => this.activate()}>
                    <Text> {this.props.activated ? "Stop Search" : "Start Search"}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.button} onPress = {() => this.logout()}>
                    <Text>Logout</Text>
                </TouchableHighlight>
            </View>
        )
        }
        else{
          return(
            <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                <Text style={{flex:1, fontSize: 35 }}> You need to be logged </Text> 
            </View>
          )
        }
    }


  async registerForPushNotificationsAsync() {
    try{
      let token = (await Notifications.getExpoPushTokenAsync()).data;
      this.props.dispatch(arriveToken(token))
      this.sendToken(token);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', { /*en Android es necesario poner un canal por defecto*/
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    }
    catch(error){
      console.log("No se ha podido obtener el token para push notifications")
    }
  }

  async getPosition() {
    try{
      const { coords } = await Location.getCurrentPositionAsync({});
      let position = coords;
      this.props.dispatch(actualLocation(position.latitude, position.longitude))
      console.log(this.props.latitud)
    } 
    catch (error) {
      console.log("getPosition -> error", error);
    }
  }

  async sendToken(token){
    let response = await fetch(baseURL+'/pushtoken', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      //credentials: 'include',
      body: JSON.stringify({pushtoken: token}),
    });
  
    let responsed = await response.json();
    console.log(responsed)
    console.log(response.status)
    if (response.status == 401){
      alert('La sesión ha finalizado por exceso de espera. Vuelva a hacer Log in.')
      this.props.dispatch(logging(''));
    }else if (response.status != 200){
      alert('Ha surgido un error al guardar el pushtoken.')
      console.log(response.status)
    }
  }

  async logout(){
    let response = await fetch(baseURL+'/logout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      //credentials: 'include',
    });

    if (this.props.activated == true){this.props.dispatch(activateSearch())}
    if (this.props.locationdetected == true){this.props.dispatch(localFound())}
  
    this.props.dispatch(logging(""))
  }

  async sendLocation(){

    let response = await fetch(baseURL+'/location', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      //credentials: 'include',
      body: JSON.stringify({latitud: this.props.latitud, longitud: this.props.longitud, shopfind: this.props.locationdetected}),
    });

    let responsed = await response.json();

    if (response.status == 401){
      alert('La sesión ha finalizado por exceso de espera. Vuelva a hacer Log in.')
      if(this.props.activated && this.props.logged){
        if(this.props.locationdetected){
          this.props.dispatch(localFound())
        }
        this.props.dispatch(activateSearch());
        this.props.dispatch(logging(''));
      }
    }
    else if (responsed.shop && !this.props.locationdetected) {
      this.props.dispatch(localFound())
      let placementsreformed = responsed.shop.placements.map(item => {
        return {...item,
        quantity: 0}
      })
      responsed.shop.placements = placementsreformed;
      this.props.dispatch(arriveShop(responsed.shop))
      console.log("tienda enviada")
    }
    else {
      if (this.props.locationdetected && !responsed.shop){
        this.props.dispatch(localFound())
        console.log("Se ha dejado de encontrar tiendas")
      }
      else{
        return;
      }
    }

  }

}

/* async function deleteToken(){
  await fetch('', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(this.props.token),
  });
} */

const styles = StyleSheet.create({
    button: {
        height: 60,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'red',
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
export default connect(mapStateToProps)(IndexScreen);