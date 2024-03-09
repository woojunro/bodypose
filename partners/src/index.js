import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-responsive-modal/styles.css';
import { isIE } from 'react-device-detect';
import IEScreen from './screens/IEScreen';
import App from './App';
import axios from 'axios';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/apollo';

axios.defaults.withCredentials = true;

ReactDOM.render(
  <>
    {isIE ? (
      <IEScreen />
    ) : (
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    )}
  </>,
  document.getElementById('root')
);
