import { gql } from '@apollo/client';

export const STUDIO_REVIEWS_QUERY = gql`
  query GetStudioReviews(
    $page: Int
    $studioSlug: String!
    $order: StudioReviewOrder
  ) {
    studioReviews(
      input: { page: $page, studioSlug: $studioSlug, order: $order }
    ) {
      ok
      error
      totalPages
      studioReviews {
        id
        createdAt
        rating
        text
        thumbnailPhotoId
        isPhotoForProof
        photos {
          id
          url
        }
        user {
          nickname
        }
      }
    }
  }
`;
