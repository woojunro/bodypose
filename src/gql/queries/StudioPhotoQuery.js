import { gql } from '@apollo/client';

export const ALL_STUDIO_PHOTOS_QUERY = gql`
  query GetAllStudioPhotos(
    $page: Int!
    $gender: PhotoGender
    $backgroundConceptSlugs: [String!]!
    $costumeConceptSlugs: [String!]!
    $objectConceptSlugs: [String!]!
  ) {
    allStudioPhotos(
      input: {
        page: $page
        gender: $gender
        backgroundConceptSlugs: $backgroundConceptSlugs
        costumeConceptSlugs: $costumeConceptSlugs
        objectConceptSlugs: $objectConceptSlugs
      }
    ) {
      ok
      error
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
