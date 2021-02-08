import { gql } from '@apollo/client';

export const EMAIL_REGISTER_MUTATION = gql`
  mutation EmailRegister(
    $email: String!
    $password: String!
    $nickname: String!
  ) {
    createUserWithEmail(
      input: { email: $email, password: $password, nickname: $nickname }
    ) {
      ok
      error
      token
    }
  }
`;
