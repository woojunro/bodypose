import { gql } from '@apollo/client';

export const ALL_PREMIUM_STUDIOS_QUERY = gql`
  query GetAllPremiumStudios {
    allPremiumStudios {
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
export const ALL_SPECIAL_STUDIOS_QUERY = gql`
  query GetAllSpecialStudios {
    allSpecialStudios {
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
