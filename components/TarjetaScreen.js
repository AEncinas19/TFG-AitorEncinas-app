import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, TouchableHighlight } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import {PaymentsStripe as Stripe} from 'expo-payments-stripe';
var stripe = require('stripe-client')('pk_test_51IkSMjAwYEmxhVRRPOaKFC3ORP9KNS1PymGMGdoer0InVFq0HbDaa2VLAas9UdjJvM1LIsKKsrLFhicEtfq5wrtm00oaDwyGJ8')


import {baseURL} from '../consts/url';

export default class TarjetaScreen extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data: {},  //JSON vacío
            bolTarjeta: false
        }
    }

    // Metodo que se va a ejecutar cada vez que el usuario rellene un campo del formulario y pasa en formData los valores en un JSON.
    onChange = (formData) => {
        this.setState({data: formData.values,  //Metemos en data el JSON de los valores insertados.
        bolTarjeta: formData.valid})  //Sera true cuando el usuario retorne todos los campos y sean válidos.
    }

    onFocus = (field) => console.log("focus", field) //Se va a ejecutar cada vez que el usuario pinche en un textinput.

    pagar = async () => {
        const params = {
            card:{
                number: this.state.data.number,
                exp_month: parseInt(this.state.data.expiry.substring(0,2)),
                exp_year: parseInt(this.state.data.expiry.substring(3,5)),
                cvc: this.state.data.cvc
            }
        }
        console.log(params.number)
        const card = await stripe.createToken(params)
        const token = card.id //Es lo que tengo que pasar en el backend.
        let response = fetch(baseURL+'/pay', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: token, total: this.props.money*100})
        });

        if(response.status == 200){
            alert('Compra realizada con éxito')
        }
        console.log(response)
    }

    render() {
        return (
            <View style={{ flex:1, alignItems: 'center'}}>
                <View style={{ width: '100%', height: '30%', marginTop: 60}}>
                    <CreditCardInput
                        autofocus
                        requiresName
                        requiresCVC
                        cardScale={0.9}
                        validColor={'black'}
                        invalidColor={'red'}
                        placeholderColor={'darkgray'}
                        placeholders={{number: "1234 5678 1234 5678", name: "NOMBRE COMPLETO", expiry: "MM/YY", cvc:"CVC"}}
                        labels={{number: "NÚMERO TARJETA", expiry: "EXPIRA", name: "NOMBRE COMPLETO", cvc: "CVC/CCV"}} //Lo pongo en español, por defecto vienen en inglés
                        onFocus={this.onFocus}
                        onChange={this.onChange}
                    />
                </View>
                <View style={{
                    width: 280,
                    marginTop: 150,
                    marginBottom: 20,
                    backgroundColor: 'black',
                    borderRadius: 60,
                }}>
                    <TouchableOpacity onPress={()=>this.pagar()}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 17,
                            color: 'white',
                            paddingVertical: 15
                        }}>Pagar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    constainer: {
        alignItems:'center',
        marginTop:60,
    }

})