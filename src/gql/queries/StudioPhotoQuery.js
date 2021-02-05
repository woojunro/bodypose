import { gql } from '@apollo/client';

export const ALL_STUDIO_PHOTOS_QUERY = gql`
  query GetAllStudioPhotos(
    $take: Int
    $page: Int!
    $gender: PhotoGender
    $backgroundConceptSlugs: [String!]!
    $costumeConceptSlugs: [String!]!
    $objectConceptSlugs: [String!]!
  ) {
    allStudioPhotos(
      input: {
        take: $take
        page: $page
        gender: $gender
        backgroundConceptSlugs: $backgroundConceptSlugs
        costumeConceptSlugs: $costumeConceptSlugs
        objectConceptSlugs: $objectConceptSlugs
      }
    ) {
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
      }
    }
  }
`;
