import { gql } from '@apollo/client';

export const CLICK_STUDIO_REVIEW_MUTATION = gql`
  mutation ClickStudioReview($input: ClickStudioReviewInput!) {
    clickStudioReview(input: $input) {
      ok
      error
    }
  }
`;
