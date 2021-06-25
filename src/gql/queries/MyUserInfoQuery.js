import { gql } from '@apollo/client';

export const MY_USER_INFO_QUERY = gql`
  query MyUserInfoQuery {
    userInfo(input: {}) {
      ok
      error
      userInfo {
        id
        createdAt
        type
        email
        isVerified
        lastLoginAt
        deletedAt
        profile {
          id
          nickname
          isMale
          profileImageUrl
        }
        oauthList {
          id
          provider
        }
      }
    }
  }
`;
