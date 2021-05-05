import React from 'react';
import {View, Image, Text, Modal, TouchableHighlight, TouchableOpacity, StyleSheet, Alert, SectionList} from "react-native";
import TarjetaScreen from './TarjetaScreen';
import Product from './Product';
import { WebView } from 'react-native-webview';



export default class App extends React.Component {


    constructor(props){
        super(props);
        this.state = {modalVisible:false, money: 0, tarjetaVisible: false, receipt: "", receiptVisible: false}
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
                <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                    <Text style={{fontSize: 20 }}>Estás en la tienda: {this.props.shop.name} </Text>
                    <SectionList 
                        sections={[{data: this.getOfferProducts(), title: 'Productos en oferta'}, {data: this.getNoOfferProducts(), title: 'Resto de productos'}]}
                        renderItem={({item}) =>   <Product 
                                                        price = {item.price}
                                                        quantity = {item.quantity}
                                                        productname = {item.productname}
                                                        onAddProduct = {() => this.addProduct(item)}
                                                        onRemoveProduct = {() => this.removeProduct(item)}
                                                        url = {item.url}
                        />
                        }
                        renderSectionHeader={({section}) => <Text style={{textAlign:'center', color: '#465881', fontSize:30, padding:10, margin:5}}>{section.title}
                                                            </Text>}
                    />
                    <Modal animationType="slide" transparent={false} visible={this.state.modalVisible}>
                        <View style={{padding:30, alignItems:'center', justifyContent:'center'}}>
                            <TouchableHighlight style={{alignSelf:'flex-end'}} onPress={() => {this.setModalVisible(false)}}>
                                <Text style={{fontSize:20, marginBottom: 20}}>X</Text>
                            </TouchableHighlight>
                            <SectionList sections={[{data: this.extraerCarro(), title: 'Productos en carro'}]}
                            renderItem={({item}) =>   <View style={{ flex:1, flexDirection: 'column', alignItems:'center', justifyContent:'space-around'}}>
                                                            <Text style={{fontSize:25}}>{item.quantity + 'x' + item.productname}</Text>
                                                            <Text style={{fontSize:15}}>Precio por producto: {item.price + '€'}</Text>
                                                    </View>} />
                            <Text style={{fontSize:35}}>{this.calcularCompra() + '€'}</Text>
                            <TouchableHighlight style={styles.comprarbutton} onPress={() => {this.comprar()}}>
                                <Text style={{fontSize:20, marginBottom: 20, color: 'white'}}>Comprar</Text>
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
                    <View style={{
                    width: 280,
                    marginTop: 10,
                    marginBottom: 20,
                    backgroundColor: 'black',
                    borderRadius: 60,
                    }}>
                        <TouchableOpacity onPress={()=>this.setModalVisible(true)}>
                            <Text style={{
                                textAlign: 'center',
                                fontSize: 17,
                                color: 'white',
                                paddingVertical: 15
                            }}>Ver carro y comprar</Text>
                        </TouchableOpacity>
                    </View>
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
        height: 100,
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'black',
        fontSize: 25,
        textAlign: 'center',
        padding: 10,
        margin: 30
    }
})