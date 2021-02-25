import React from 'react';
import {connect} from 'react-redux';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';
import { activateSearch } from '../redux/actions';


class IndexScreen extends React.Component { 

    render() {
        return(
            <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                <Text style={{flex:1, fontSize: 35 }}> Welcome to this demo App </Text> 
                <Text style={{flex:1, fontSize: 35 }}> Press  'Start Search'</Text> 
                <TouchableHighlight style={styles.button} onPress = {() => this.props.dispatch(activateSearch())}>
                    <Text> {this.props.activated ? "Stop Search" : "Start Search"}</Text>
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