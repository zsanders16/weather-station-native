import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import apiMiddleware from 'redux-devise-axios';
import rootReducer from './app/reducers/index';
import axios from 'axios';

const options = { axios }

const enhancers = compose(
  applyMiddleware(thunk, apiMiddleware(options)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(rootReducer, {}, enhancers);

if(module.hot) {
  module.hot.accept('./app/reducers/',() => {
    const nextRootReducer = require('./app/reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
