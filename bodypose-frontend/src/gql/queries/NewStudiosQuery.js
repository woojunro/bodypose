import { gql } from '@apollo/client';

export const NEW_STUDIOS_QUERY = gql`
  query GetNewStudios($input: GetNewStudiosInput!) {
    newStudios(input: $input) {
      ok
      error
      studios {
        id
        name
        slug
        coverPhotoUrl
        lowestPrice
      }
    }
  }
`;
