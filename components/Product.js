import React, { Component } from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Button, Left, Body, Right } from 'native-base';

export default class Product extends Component {

  render() {
    return (
      <Container style={{height: 200}}>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Body>
                  <Image source={{uri: this.props.url}} style={styles.card}/> 
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
            <Text>{this.props.productname}</Text>
            <Text style={{marginTop:100}}> Precio por unidad: +{this.props.price + '€'}</Text>
            </CardItem>
            <CardItem>
              <Right>                                                        
                  <Button style={{height:40, width:40}} onPress = {() => {this.props.onAddProduct()}}>
                    <Text style={{fontSize:15}}>+</Text>
                  </Button>
                  <Text style={{alignSelf: 'center', marginLeft: 70}}>{this.props.quantity}</Text>
                  <Button style={{height:40, width:40}} onPress = {() => {this.props.onRemoveProduct()}}>
                    <Text style={{alignSelf: 'center', fontSize:30}}>-</Text>
                  </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {height: 200, width: Dimensions.get('window').width/3, flex: 1}
});