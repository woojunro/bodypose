import { gql } from '@apollo/client';

export const UPDATE_EMAIL_MUTATION = gql`
  mutation UpdateEmail($input: UpdateEmailInput!) {
    updateEmail(input: $input) {
      ok
      error
    }
  }
`;
