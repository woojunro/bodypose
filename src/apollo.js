import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { refreshAccessToken } from './components/functions/Common/refreshAccessToken';
import { BASE_URL } from './constants/urls';
import { Observable } from 'apollo-link';
import { STUDIO_SORT_OPTIONS } from './components/mobileComponents/studioListScreen/SortingOptions';

// 로그인 여부
export const IsLoggedInVar = makeVar(false);

// 스튜디오 리스트
export const StudioLocationVar = makeVar(null);
export const StudioSortByVar = makeVar(STUDIO_SORT_OPTIONS[0]);
export const StudioListVar = makeVar([]);

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

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

export const clearCache = async () => {
  await client.resetStore();
};
