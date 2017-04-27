/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, {Component} from "react";
import {AppRegistry, StyleSheet, Text, View, TouchableHighlight, Button} from "react-native";
import * as firebase from "firebase";
import codePush from "react-native-code-push";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXYUTi-MFlrK__ju2pP-DNBVTAbi9Sr5I",
  authDomain: "lights-d8f33.firebaseapp.com",
  databaseURL: "https://lights-d8f33.firebaseio.com",
  projectId: "lights-d8f33",
  storageBucket: "lights-d8f33.appspot.com",
  messagingSenderId: "357912341849"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export class Lights extends Component {

  constructor(props) {
    super(props);
    this.itemsRef = firebase.database().ref('/');

    this.state = {
      green: '-',
      red: '-',
    };
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  listenForItems() {
    firebase.database().ref('/').on('value', (snapshot) => {
      console.log('Snapshot changed', snapshot.val());
      this.setState(snapshot.val());
    })
  }

  onReset = () => {
    const acceptHeaders = {accept: 'application/json', 'Content-Type': 'application/json'};
    fetch('https://us-central1-lights-d8f33.cloudfunctions.net/reset', {
      headers: {...acceptHeaders},
      method: 'POST'
    })
  };

  onPressDown = (color) => {
    const acceptHeaders = {accept: 'application/json', 'Content-Type': 'application/json'};
    fetch('https://us-central1-lights-d8f33.cloudfunctions.net/onDown', {
      headers: {...acceptHeaders},
      method: 'POST',
      body: JSON.stringify({
        color: color
      })
    });
  };

  onPressUp = (color) => {
    const acceptHeaders = {accept: 'application/json', 'Content-Type': 'application/json'};
    fetch('https://us-central1-lights-d8f33.cloudfunctions.net/onUp', {
      headers: {...acceptHeaders},
      method: 'POST',
      body: JSON.stringify({
        color: color
      })
    });
  };

  render() {
    const {green, red} = this.state;
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', top: 0, zIndex: 1}}>
          <Button color={'orange'} style={{backgroundColor: 'yellow', color: 'orange'}} title={'Reset'} onPress={this.onReset} />
        </View>
        <TouchableHighlight style={{flex: 1}}
                            onPressIn={() => {this.onPressDown('green')}}
                            onPressOut={() => {this.onPressUp('green')}}
                            onResponderTerminationRequest={(evt) => {this.onPressUp('green'); return false;}}
        >
          <View style={[styles.count, {backgroundColor: '#4CAF50'}]}>
            <Text style={[styles.number]}>
              {green}
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{flex: 1}}
                            onPressIn={() => {this.onPressDown('red')}}
                            onPressOut={() => {this.onPressUp('red')}}
                            onResponderTerminationRequest={(evt) => {this.onPressUp('red'); return false;}}
        >
          <View style={[styles.count, {backgroundColor: '#F44336'}]}>
            <Text style={[styles.number]}>
              {red}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 92,
    color: '#FAFAFA'
  }
});
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

export default codePush(codePushOptions)(Lights);