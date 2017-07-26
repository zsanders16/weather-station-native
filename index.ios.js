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
import WeatherStation from './app/components/WeatherStation'
import store from './store';
import { NativeRouter, Route, Link, Switch } from 'react-router-native'
import { Provider } from 'react-redux';

export default class weatherStationNative extends Component {
  render() {
    return (
      <Provider store={store}>
        <NativeRouter>
          <Switch>
            <Route path='/' render={ () => (<Homepage />) } />
            <Route exact path='/weatherStation' render={ () => (<WeatherStation />) } />
            </Switch>
        </NativeRouter>
      </Provider>
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
