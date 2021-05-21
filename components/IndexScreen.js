import React from 'react';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Text, StyleSheet, Dimensions} from 'react-native';
import { activateSearch, actualLocation, arriveToken, logging, localFound, arriveShop, arriveShops, setBackground } from '../redux/actions';
import { Alert, Platform} from 'react-native'
import * as Permissions from 'expo-permissions';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


import {baseURL} from '../consts/url';

const LOCATION_TASK_NAME = 'background-location-task'

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
      Alert.alert(notification.request.content.title, notification.request.content.body)
      console.log(notification)
      this.props.navigation('App');
    })
    Notifications.addNotificationResponseReceivedListener( response => {
      console.log(response);
      this.props.navigation('App');
    }) /*cuando el usuario pulsa encima, cambia de pantalla*/
    this.getShops()
    
    this.myInterval = setInterval(async () => {
      if (this.props.activated){
        let Notpermission = await hasNotificationPermission();
        let Geopermission = await hasGeolocationPermission();
        let EnableLocation = await checkIfLocationEnabled();
        if (Notpermission && Geopermission && EnableLocation){
          this.getPosition();
        } //Si cambia algo de los permisos, se deja de enviar.
        else {return}
      }
    }, 5000)
    this.myInterval2 = setInterval(async () => {
      if (this.props.activated){
        let Notpermission = await hasNotificationPermission();
        let Geopermission = await hasGeolocationPermission();
        let EnableLocation = await checkIfLocationEnabled();
        if (Notpermission && Geopermission && EnableLocation){
          this.sendLocation();
        } //Si cambia algo de los permisos, se deja de enviar.
        else {return}
      }
    }, 20000)
  }

  async componentWillUnmount(){
    clearInterval(this.myInterval)
    clearInterval(this.myInterval2)
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
        const { status } = await Location.requestPermissionsAsync();
        if (status === 'granted') {
          TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
            if (error) {
              // Error occurred - check `error.message` for more details.
              console.log(error)
              Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
              return;
            }
            const {locations} = data;
            console.log(locations);
            let response = await axios({
              method: 'post',
              url: baseURL+'/backlocation',
              headers: {}, 
              data: {
                latitud: locations[0].coords.latitude, // This is the body part
                longitud: locations[0].coords.longitude
              }
            });
            console.log(response)
            if (response.data.finish) {Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
              TaskManager.unregisterAllTasksAsync()}
          }); 
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            timeInterval: 10000,
            deferredUpdatesInterval: 5000, 
            foregroundService: {
              notificationTitle: "BackgroundLocation Is On",
          }});
        }
      }
      else {
        Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        TaskManager.unregisterAllTasksAsync()
        this.props.dispatch(activateSearch())
        if (this.props.locationdetected){
          this.props.dispatch(localFound());
        //this.deleteToken()
        }
      }
    }
      else{
          return
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

  async getShops() {
    let response = await fetch(baseURL+'/getshops', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    });

    if (response.status == 200){
      let responsed = await response.json();
      this.props.dispatch(arriveShops(responsed.shops))
    }
    else{
      return
    }
  }

  render() {
    if (this.props.logged){
      return(
          <View style={styles.container}>
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                colors={['#d9931c', 'transparent']}
                style={styles.background}>
              <View style={{flexDirection:'row', alignSelf:'flex-start', marginTop:40, marginLeft: 10}}>
                <AntDesign name="user" size={30} color="black" />
                <Text style={{fontSize: 24, color:'black'}}> {this.props.username}</Text>
              </View>
              <Text style={{alignSelf: 'center', color:"black", fontSize: 25, marginTop:40}}> ¡Bienvenido a esta Aplicación!</Text> 
              <Text style={{color:"black",fontSize: 25, textAlign: 'center', marginTop:50}}> Pulsa 'Empezar búsqueda' para encontrar tu tienda </Text>
              <TouchableHighlight style={styles.startBtn} onPress = {() => this.activate()}>
                  <Text style={styles.loginText}>{this.props.activated ? "Parar búsqueda" : "Empezar búsqueda"}</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.logoutBtn} onPress = {() => this.logout()}>
                  <Text style={styles.loginText}>Logout</Text>
              </TouchableHighlight>
            </LinearGradient>
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
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      marginTop: 20
  },
  startBtn:{
      width:"80%",
      backgroundColor:"#465881",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:120,
      marginBottom:10,
    },
  logoutBtn:{
    width:"80%",
    backgroundColor:"darkgray",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:30,

  },
  loginText:{
      color:"white",
      fontSize:20
  },
  background: {
    alignItems:'center', justifyContent:'space-around', 
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
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