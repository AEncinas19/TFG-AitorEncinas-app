import React from 'react';
import {View, Image, Text, Modal, TouchableHighlight, TouchableOpacity, StyleSheet, Alert, SectionList, Dimensions} from "react-native";
import TarjetaScreen from './TarjetaScreen';
import Product from './Product';
import NewProduct from './newProduct';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


export default class App extends React.Component {


    constructor(props){
        super(props);
        this.state = {modalVisible:false, money: 0, tarjetaVisible: false, receipt: "", receiptVisible: false, verofertas: true}
    }

    getOfferProducts = () => {
            let offerproducts = []
            this.props.shop.placements.forEach(item => {
                if (item.isoffer)
                offerproducts.push(item)
            })
        return offerproducts;
    }   

    getNoOfferProducts = () => {
            let noofferproducts = []
            this.props.shop.placements.forEach(item => {
                if (!item.isoffer)
                noofferproducts.push(item)
            })
        return noofferproducts; 
    }

    addProduct = (item) => {
        if (item.quantity >9){
            alert('Has seleccionado demasiadas veces este producto')
            return
        }
        else{
                this.props.onAddProduct(item)
        }
    }

    removeProduct = (item) => {
        if (item.quantity == 0){
            return
        }
        else{
            this.props.onRemoveProduct(item)
        }
    }

    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    comprar = () => {
        this.setState({money: this.calcularCompra()});
        let newShop = JSON.parse(JSON.stringify(this.props.shop))
        let placementsreformed = newShop.placements.map(item => {
            return {...item,
            quantity: 0}
          })
          newShop.placements = placementsreformed;
         this.setState({tarjetaVisible: true});
        
          this.props.onResetShop(newShop);
    }

    extraerCarro = () => {
        let carro = []
        this.props.shop.placements.forEach(item => {
            if (item.quantity != 0)
            carro.push(item)
        })
        return carro;
    }

    calcularCompra = () => {
        let coste = 0;
        this.extraerCarro().forEach(item =>{
            coste += item.quantity*item.price
        })
        return coste;
    }

    render() {
        if (this.props.shop.name){
            return(
                <View style={{ flex:1, flexDirection:'column', alignItems:'center', marginTop:20}}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                        colors={['#d9931c', 'transparent']}
                        style={styles.background}
                    >
                    <View style={{flexDirection:'row', justifyContent:'space-around', alignItems:'center', marginTop:5}}>
                        <FontAwesome5 name="store-alt" size={24} color="black" />
                        <Text style={{fontSize: 24, color:'black'}}> {this.props.shop.name}</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop:40, marginBottom:25, justifyContent:'space-around', alignItems:'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold', marginRight:20, textDecorationLine: this.state.verofertas ? 'underline' : 'none'}} onPress={() => {this.setState({verofertas:true})}}>Ofertas</Text>
                        <Text style={{fontSize:20, fontWeight:'bold', marginLeft:20, textDecorationLine: !this.state.verofertas ? 'underline' : 'none'}} onPress={() => {this.setState({verofertas:false})}}>Productos</Text>
                    </View>
                    <SectionList 
                        sections={[{data: this.state.verofertas ? this.getOfferProducts() : this.getNoOfferProducts()}]}
                        renderItem={({item}) =>   <NewProduct 
                                                        price = {item.price}
                                                        quantity = {item.quantity}
                                                        productname = {item.productname}
                                                        onAddProduct = {() => this.addProduct(item)}
                                                        onRemoveProduct = {() => this.removeProduct(item)}
                                                        url = {item.url}
                        />
                        }
                    />
                    <View style={{              
                    width: 250,
                    backgroundColor: 'black',
                    marginTop:20,
                    borderRadius: 60,
                    }}>
                        <TouchableOpacity onPress={()=>this.setModalVisible(true)}>
                            <View style={{flexDirection:'row', justifyContent:'flex-start', marginLeft:30, alignItems:'center'}}>
                                <AntDesign name="shoppingcart" size={24} color="white" />
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 17,
                                    color: 'white',
                                    paddingVertical:15
                                }}> Ver carro y comprar</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </LinearGradient>
                    <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
                        <View style={{padding:30, alignItems:'center', justifyContent:'center'}}>
                            <TouchableHighlight style={{alignSelf:'flex-end'}} onPress={() => {this.setModalVisible(false)}}>
                                <Text style={{fontSize:20, marginBottom: 20}}>X</Text>
                            </TouchableHighlight>
                            <SectionList sections={[{data: this.extraerCarro(), title: 'Productos en carro'}]}
                            renderItem={({item}) =>   <View style={{ flex:1, flexDirection: 'column', alignItems:'flex-start', justifyContent:'space-around'}}>
                                                            <Text style={{fontSize:20}}>{item.quantity + 'x' + item.productname}</Text>
                                                            <Text style={{fontSize:10}}>Precio por producto: {item.price + '€'}</Text>
                                                    </View>} />
                            <Text style={{fontSize:35}}>{this.calcularCompra() + '€'}</Text>
                            <TouchableHighlight style={styles.comprarbutton} onPress={() => {this.comprar()}}>
                                <Text style={{fontSize:20, textAlign:'center', color: 'white'}}>Comprar</Text>
                            </TouchableHighlight>
                        </View>

                    </Modal>
                    <Modal animationType="slide" transparent={false} visible={this.state.tarjetaVisible}>
                        <View>
                            <TouchableHighlight style={{alignSelf:'flex-end'}} onPress={() => {this.setState({tarjetaVisible:false})}}>
                                <Text style={{fontSize:20, marginBottom: 20, marginRight: 5}}>X</Text>
                            </TouchableHighlight>
                        </View>
                        <TarjetaScreen money = {this.state.money}
                                        ontarjetaVisible = {() => {this.setState({tarjetaVisible:false})}}
                                        onmodalVisible = {()=> {this.setState({modalVisible: false})}}
                                        onreceiptVisible = {() => {this.setState({receiptVisible: true})}}
                                        onreceipt = {(url) => {this.setState({receipt: url})}}
                            />
                    </Modal>
                    <Modal animationType="slide" transparent={false} visible={this.state.receiptVisible}>
                        <TouchableHighlight style={{alignSelf:'flex-end'}} onPress={() => {this.setState({receiptVisible:false})}}>
                            <Text style={{fontSize:20, marginBottom: 20, marginRight: 5}}>X</Text>
                        </TouchableHighlight>
                        <WebView source={{ uri: this.state.receipt}} style={{marginTop:5}} />
                    </Modal>
                </View>
            )
        }
        else {
            return(
                <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                <Text style={{flex:1, fontSize: 50 }}>Cargando tienda</Text>
                </View>
            )
        }
            
    }
};

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
    },
    comprarbutton: {
        backgroundColor: 'black',
        fontSize: 25,
        paddingVertical: 10,
        margin: 30,
        width: 250,
        backgroundColor: 'black',
        marginTop:10,
        borderRadius: 60,
    },
    background: {
        alignItems:'center', justifyContent:'space-around', 
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
    }
})