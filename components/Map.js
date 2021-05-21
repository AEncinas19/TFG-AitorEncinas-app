import * as React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Dimensions} from 'react-native';
import { Marker } from 'react-native-maps';
import {connect} from 'react-redux';


class Map extends React.Component {

    render(){
        return (
            <View style={styles.container}>
                <MapView
                style={styles.map}
                region={{latitude: this.props.latitud, longitude: this.props.longitud, latitudeDelta: 0.04, longitudeDelta:0.05}}
                >
                <Marker 
                    coordinate={{latitude: this.props.latitud, longitude: this.props.longitud}}
                    image={require('../assets/marker.png')}
                    title={this.props.username}
                />
                {this.props.shops.map((shop, index) => (
                    <Marker
                    key={index}
                    coordinate={{latitude: shop.latitud, longitude: shop.longitud}}
                    title={shop.name}
                    />
                ))}
                </MapView>      
            </View>
        );
        }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-50,
  },
});

function mapStateToProps(state) {
    return {
      ...state
    };
  }
  
  //export default App;
  export default connect(mapStateToProps)(Map);