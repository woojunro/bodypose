import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { Observable } from 'apollo-link';
import refreshAccessToken from '../components/function/Auth/refreshAccessToken';
import API_URLS from '../constants/urls';
import { IsLoggedInVar } from './variables';

const httpLink = createHttpLink({
  uri: API_URLS.GRAPHQL,
  credentials: 'include',
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) =>
        console.log(`GraphQL: ${message}`)
      );
      if (graphQLErrors.some(err => err.message === 'Forbidden resource')) {
        return new Observable(observer => {
          refreshAccessToken()
            .then(isRefreshed => {
              if (isRefreshed) {
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              } else {
                IsLoggedInVar(false);
                throw new Error('Token refresh failed.');
              }
            })
            .catch(error => {
              IsLoggedInVar(false);
              observer.error(error);
            });
        });
      }
    }
    if (networkError) console.log(`[GraphQL Network error]: ${networkError}`);
  }
);

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      StudioPhotoWithCount: {
        keyFields: false,
      },
    },
  }),
});

export const resetClient = () => client.resetStore();

export default client;
