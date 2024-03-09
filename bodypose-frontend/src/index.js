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
import { initialize } from 'react-ga';
import TagManager from 'react-gtm-module';

import App from './components/App';

initialize(process.env.REACT_APP_GA_ID);

//Google Tag Manager
const tagManagerArgs = {
  gtmId: 'GTM-M4KDZRJ',
};

TagManager.initialize(tagManagerArgs);
ReactDOM.render(
  <ApolloProvider client={client}>
    {isIE ? <IEScreen /> : <App />}
  </ApolloProvider>,
  document.getElementById('root')
);
