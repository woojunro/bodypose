import { gql } from '@apollo/client';

export const MY_PROFILE_QUERY = gql`
  query userProfile {
    myProfile(input: {}) {
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
