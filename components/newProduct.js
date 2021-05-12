import React, { Component } from 'react';
import { Image, StyleSheet, Dimensions, View, TouchableHighlight, Text, TouchableOpacity } from 'react-native';

export default class NewProduct extends Component {

  render() {
    return (
        <View style={{flex:1, height:150, width: Dimensions.get('window').width*4.7/5,flexDirection:'row', justifyContent:'flex-start', backgroundColor:'white', marginBottom:10}}>
            <Image source={{uri: this.props.url}} style={styles.card}/>
            <View style={{flexDirection:'column', justifyContent:'space-around', width: Dimensions.get('window').width*3.2/5}}>
                <Text style={{alignSelf:'center', fontWeight:'bold', fontSize:20, marginTop:5, marginLeft:10}}>{this.props.productname}</Text>
                <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Text style={{width:Dimensions.get('window').width/4, marginLeft: 10, alignSelf:'flex-end'}}>Precio por unidad: {this.props.price} €</Text>
                    <View style = {{flexDirection:'row', justifyContent:'space-around', alignSelf:'center', width:Dimensions.get('window').width/4, marginLeft:10, marginRight:10}}>
                        <TouchableHighlight style={{borderRadius:15, width:30, height:30, borderWidth: 2, borderColor:'#d9931c', textAlign:'center' }} onPress = {() => {this.props.onAddProduct()}}>
                            <Text style={{fontSize:20, color:'#d9931c', textAlign:'center'}}>+</Text>
                        </TouchableHighlight>
                        <Text style={{fontSize:20, fontWeight:'bold', marginRight:5, marginLeft:5}}>{this.props.quantity}</Text>
                        <TouchableHighlight style={{borderWidth:2, borderRadius:15, width:30, height:30, borderColor:'#d9931c', textAlign:'center'}} onPress = {() => {this.props.onRemoveProduct()}}>
                            <Text style={{fontSize:20, color:'#d9931c', textAlign:'center', borderRadius:15, marginBottom:20}}>-</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {width: Dimensions.get('window').width*1.5/5}}
)