import { gql } from '@apollo/client';

export const MY_PROFILE_QUERY = gql`
  query GetMyProfile {
    myProfile {
      ok
      error
      profile {
        id
        email
        nickname
      }
    }
  }
`;
