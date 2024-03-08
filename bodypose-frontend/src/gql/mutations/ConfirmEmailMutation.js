import { gql } from '@apollo/client';

export const CONFIRM_EMAIL_MUTATION = gql`
  mutation ConfirmEmail($userId: Int!, $code: String!) {
    verifyUser(input: { userId: $userId, code: $code }) {
      ok
      error
    }
  }
`;
