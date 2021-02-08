import { gql } from '@apollo/client';

export const CONFIRM_EMAIL_MUTATION = gql`
  mutation ConfirmEmail($code: String!) {
    verifyUser(input: { code: $code }) {
      ok
      error
    }
  }
`;
