import { gql } from '@apollo/client';

export const DELETE_STUDIO_REVIEW_MUTATION = gql`
  mutation DeleteStudioReview($id: Int!) {
    deleteStudioReview(input: { id: $id }) {
      ok
      error
    }
  }
`;
