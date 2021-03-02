import React from 'react';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import { activateSearch, arriveToken } from '../redux/actions';
import { Alert, Platform } from 'react-native'
import * as Permissions from 'expo-permissions';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';


const hasNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (finalStatus === 'granted') return true;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
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

class IndexScreen extends React.Component {

    async componentDidMount() {
        hasNotificationPermission()
        this.registerForPushNotificationsAsync()

        Notifications.addNotificationReceivedListener(notification => {console.log(notification)})
        Notifications.addNotificationResponseReceivedListener( response => this.props.navigation.navigate('App')) /*cuando el usuario pulsa encima, cambia de pantalla*/
    }

    activate = async () => {
        let permission = await hasNotificationPermission();
        if (permission){
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