import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { DEV_SERVER_URL, PROD_SERVER_URL } from './constants/urls';

const httpLink = createHttpLink({
  uri: `${PROD_SERVER_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const clearTokenAndCache = () => {
  localStorage.clear();
  client.resetStore();
};
