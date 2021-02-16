import { gql } from '@apollo/client';

export const STUDIO_PHOTOS_QUERY = gql`
  query GetStudioPhotos(
    $page: Int
    $studioSlug: String!
    $gender: PhotoGender
  ) {
    studioPhotos(
      input: { page: $page, studioSlug: $studioSlug, gender: $gender }
    ) {
      ok
      error
      totalPages
      photos {
        id
        thumbnailUrl
        originalUrl
        isHearted
      }
    }
  }
`;
