import { gql } from '@apollo/client';

export const ALL_STUDIOS_QUERY = gql`
  query GetAllStudios {
    allStudios {
      ok
      error
      studios {
        id
        name
        slug
        tier
        coverPhotoUrl
        heartCount
        lowestPrice
        isHearted
        branches {
          name
          address
        }
      }
    }
  }
`;
