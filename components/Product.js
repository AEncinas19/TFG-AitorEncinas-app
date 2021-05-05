import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, TouchableHighlight, Text, Button, Icon, Left, Body, Right } from 'native-base';
export default class Product extends Component {

  render() {
    return (
      <Container style={{height: 460}}>
        <Header />
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Body>
                  <Text>{this.props.productname}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: this.props.url}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                  <Text> Precio por unidad: +{this.props.price + '€'}</Text>
              </Left>
              <Right>                                                        
                  <Button onPress = {() => {this.props.onAddProduct()}}>
                    <Text>+</Text>
                  </Button>
                  <Text>{this.props.quantity}</Text>
                  <Button onPress = {() => {this.props.onRemoveProduct()}}>
                    <Text>-</Text>
                  </Button>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}