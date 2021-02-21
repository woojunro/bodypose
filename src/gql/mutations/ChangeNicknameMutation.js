import { gql } from '@apollo/client';

export const CHANGE_NICKNAME_MUTATION = gql`
  mutation UpdateNickname($nickname: String!) {
    updateNickname(input: { nickname: $nickname }) {
      ok
      error
    }
  }
`;
