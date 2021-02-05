import { gql } from '@apollo/client';

export const NOTICES_QUERY = gql`
  query GetNotices($page: Int!) {
    notices(input: { page: $page }) {
      ok
      error
      totalPages
      notices {
        id
        updatedAt
        title
      }
    }
  }
`;
