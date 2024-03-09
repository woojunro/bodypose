import { gql } from '@apollo/client';

export const LEAVE_BODYPOSE_MUTATION = gql`
  mutation LeaveBodypose {
    deleteMyAccount {
      ok
      error
    }
  }
`;
