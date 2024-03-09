import { gql } from '@apollo/client';

export const EMAIL_LOGIN_MUTATION = gql`
  mutation EmailLogin($email: String!, $password: String!) {
    loginWithEmail(input: { email: $email, password: $password }) {
      ok
      error
      token
    }
  }
`;

export const SOCIAL_LOGIN_MUTATION = gql`
  mutation SocialLogin($accessToken: String!, $provider: LoginMethod!) {
    createOrLoginUserWithOAuth(
      input: { accessToken: $accessToken, createWith: $provider }
    ) {
      ok
      error
      token
    }
  }
`;
