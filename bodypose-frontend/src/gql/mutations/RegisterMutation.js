import { gql } from '@apollo/client';

export const EMAIL_REGISTER_MUTATION = gql`
  mutation EmailRegister($email: String!, $password: String!) {
    createUserWithEmail(input: { email: $email, password: $password }) {
      ok
      error
    }
  }
`;
