import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import App from './components/App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
