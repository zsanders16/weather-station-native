/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Homepage from './app/components/Homepage'
import { NativeRouter, Route, Link } from 'react-router-native'
import WeatherStation from './app/components/WeatherStation'

export default class weatherStationNative extends Component {
  render() {
    return (
      <NavtiveRouter>
          <Route path='/' render={ () => (<Homepage />) } />
          <Route exact path='/weatherStation' render={ () => (<WeatherStation />) } />
      </NavtiveRouter>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('weatherStationNative', () => weatherStationNative);
