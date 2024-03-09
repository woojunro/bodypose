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
          id
          profile {
            id
            nickname
          }
        }
      }
    }
  }
`;

export const ALL_STUDIO_REVIEWS_QUERY = gql`
  query GetAllStudioReviews($page: Int) {
    allStudioReviews(input: { page: $page }) {
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
          id
          profile {
            id
            nickname
          }
        }
        studio {
          name
          slug
        }
      }
    }
  }
`;

export const MY_STUDIO_REVIEWS_QUERY = gql`
  query GetMyStudioReviews {
    myStudioReviews {
      ok
      error
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
          id
          profile {
            id
            nickname
          }
        }
        studio {
          name
          slug
        }
      }
    }
  }
`;
