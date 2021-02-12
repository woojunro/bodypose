import { gql } from '@apollo/client';

export const MY_HEART_STUDIOS_QUERY = gql`
  query MyHeartStudios {
    myHeartStudios {
      ok
      error
      studios {
        id
        name
        slug
        coverPhoto {
          id
          originalUrl
        }
        branches {
          name
          address
        }
        totalRating
        reviewCount
        lowestPrice
        isHearted
      }
    }
  }
`;
