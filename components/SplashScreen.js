import React from 'react';
import {StyleSheet, Text, View,ImageBackground} from "react-native";
import { render } from 'react-dom';

export default class Loading extends React.Component{
  render() {
    return (
      <View style={styles.root}>
        <ImageBackground
          source={require("../assets/splash.png")}
          resize="cover"
          style={styles.image}
        >
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  image: {
    width: 300,
    height: 100,
  }
})