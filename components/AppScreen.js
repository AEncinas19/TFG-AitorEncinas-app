import React, { Component } from 'react';
import {connect, Provider} from 'react-redux';
import {View, Image, Text, StyleSheet, Alert, TouchableHighlight} from "react-native";
import AppDemo from './AppDemo';


//import {SafeAreaView} from "react-native-safe-area-context";

class AppScreen extends React.Component {

    async componentDidMount() {
         return
    }

    render() {
        if (!this.props.locationdetected) {
            return <View><Text>No place detected</Text></View>
        } 
        else {
            return (
                //<SafeAreaView>
                <View  className="App">
                    <AppDemo  
                        />
                    </View>
            )
            }
    }
}

function mapStateToProps(state) {
  return {
    ...state
  };
}

//export default App;
export default connect(mapStateToProps)(AppScreen);

