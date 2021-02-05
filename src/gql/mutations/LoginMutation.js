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
