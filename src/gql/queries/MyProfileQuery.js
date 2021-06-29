import { gql } from '@apollo/client';

export const MY_PROFILE_QUERY = gql`
  query userProfile {
    userProfile(input: {}) {
      ok
      error
      profile {
        id
        nickname
        isMale
        profileImageUrl
      }
    }
  }
`;
