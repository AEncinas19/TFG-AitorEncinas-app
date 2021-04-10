import React, { Component } from 'react';
import {connect, Provider} from 'react-redux';
import {View, Image, Text, StyleSheet, Alert, TouchableHighlight} from "react-native";
import AppDemo from './AppDemo';
import {addProduct, arriveShop, removeProduct} from '../redux/actions';


//import {SafeAreaView} from "react-native-safe-area-context";

class AppScreen extends React.Component {

    render() {
        if (this.props.activated) {
            if (this.props.locationdetected){
                return(
                    <View style= {{flex:1}} className="IndexScreen">
                        <AppDemo shop = {this.props.shop}
                                 onAddProduct = {(product) => {this.props.dispatch(addProduct(product))}}
                                 onRemoveProduct = {(product) => {this.props.dispatch(removeProduct(product))}}
                                 onResetShop = {(shop) => {this.props.dispatch(arriveShop(shop))}}
                        />
                    </View>
                )
            }else{
            return (
                <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                    <Text style={{flex:1, fontSize: 50 }}>Geolocation: LATITUD:{this.props.latitud} LONGITUD:{this.props.longitud} </Text> 
                </View>
            )
            }
        }
        else {
            return <View><Text>No place detected</Text></View>
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

