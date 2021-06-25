import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { BASE_URL } from './constants/urls';

export const IsLoggedInVar = makeVar(false);

const httpLink = createHttpLink({
  uri: `${BASE_URL}/graphql`,
  credentials: 'include',
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) =>
        console.log(`GraphQL: ${message}`)
      );
    }
    if (networkError) console.log(`[GraphQL Network error]: ${networkError}`);
  }
);

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export const clearTokenAndCache = () => {
  localStorage.clear();
  client.resetStore();
};
