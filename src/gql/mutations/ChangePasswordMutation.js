import { gql } from '@apollo/client';

export const REQUEST_PASSWORD_CHANGE_MUTATION = gql`
  mutation RequestPasswordChange($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      ok
      error
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($code: String!, $newPassword: String!) {
    updatePassword(input: { code: $code, newPassword: $newPassword }) {
      ok
      error
    }
  }
`;
