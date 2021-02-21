import { gql } from '@apollo/client';

export const REPORT_STUDIO_REVIEW_MUTATION = gql`
  mutation ReportStudioReview(
    $studioReviewId: Int!
    $reason: ReportStudioReviewReason!
    $detail: String!
  ) {
    reportStudioReview(
      input: {
        studioReviewId: $studioReviewId
        reason: $reason
        detail: $detail
      }
    ) {
      ok
      error
    }
  }
`;
