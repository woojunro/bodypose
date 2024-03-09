import { gql } from '@apollo/client';

export const GET_PARTNERS_NOTICES = gql`
  query GetPartnersNotices($page: Int) {
    partnersNotices(input: { page: $page }) {
      ok
      error
      totalPages
      partnersNotices {
        id
        updatedAt
        title
      }
    }
  }
`;
