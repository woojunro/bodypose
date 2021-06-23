import { gql } from '@apollo/client';

export const MY_HEART_STUDIOS_QUERY = gql`
  query GetMyHeartStudios {
    myHeartStudios {
      ok
      error
      studios {
        id
        name
        slug
        coverPhotoUrl
        branches {
          name
          address
        }
        totalRating
        reviewCount
        lowestPrice
        isHearted
      }
    }
  }
`;

export const MY_HEART_STUDIO_PHOTOS_QUERY = gql`
  query GetMyHeartStudioPhotos($page: Int) {
    myHeartStudioPhotos(input: { page: $page }) {
      ok
      error
      totalPages
      photos {
        id
        thumbnailUrl
        originalUrl
        studio {
          name
          slug
        }
        isHearted
      }
    }
  }
`;
