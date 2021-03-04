import React from 'react';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import { activateSearch, actualLocation, arriveToken } from '../redux/actions';
import { Alert, Platform } from 'react-native'
import * as Permissions from 'expo-permissions';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';


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
        'You will not search if you do not enable geolocation. If you would like to search, please enable geolocation for Fin in your settings.',
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


class IndexScreen extends React.Component {

  async componentDidMount() {
    hasNotificationPermission()
    hasGeolocationPermission()
    this.registerForPushNotificationsAsync()

    this.myInterval = setInterval(() => {
      if (this.props.activated){
        this.getPosition();
        console.log("Se ha activado")
      }
    }, 30000)

    Notifications.addNotificationReceivedListener(notification => {console.log(notification)})
    Notifications.addNotificationResponseReceivedListener( response => this.props.navigation.navigate('App')) /*cuando el usuario pulsa encima, cambia de pantalla*/
  }

  async componentWillUnmount(){
    clearInterval(this.myInterval)
  }

  activate = async () => {
    let Notpermission = await hasNotificationPermission();
    let Geopermission = await hasGeolocationPermission();
    if (Notpermission && Geopermission){
      if (!this.props.activated){
        this.props.dispatch(activateSearch())
        this.getPosition()
      }
      else
        this.props.dispatch(activateSearch())
    }
    else{
        return
    }
  }

    render() {
        return(
            <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                <Text style={{flex:1, fontSize: 35 }}> Welcome to this demo App </Text> 
                <Text style={{flex:1, fontSize: 35 }}> Press  'Start Search'</Text> 
                <Text style={{flex:1, fontSize: 20 }}> Your expo push token: {this.props.token}</Text> 
                <Text style={{flex:1, fontSize: 20 }}> Geolocation & Push notifications: {this.props.activated? "true" : "false"} </Text> 
                <TouchableHighlight style={styles.button} onPress = {() => this.activate()}>
                    <Text> {this.props.activated ? "Stop Search" : "Start Search"}</Text>
                </TouchableHighlight>
            </View>
        )
    }


  async registerForPushNotificationsAsync() {
    try{
      let token = (await Notifications.getExpoPushTokenAsync()).data;
      this.props.dispatch(arriveToken(token))

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

}

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