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
        premiumTier
        heartCount
      }
    }
  }
`;
