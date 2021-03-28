import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { isIE } from 'react-device-detect';
import IEScreen from './screens/mobileScreens/IEScreen';

import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import App from './components/App';

ReactDOM.render(
  <ApolloProvider client={client}>
    {isIE ? <IEScreen /> : <App />}
  </ApolloProvider>,
  document.getElementById('root')
);
