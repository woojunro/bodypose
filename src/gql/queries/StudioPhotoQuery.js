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
        isHearted
      }
    }
  }
`;
export const GET_PREMIUM_CONCEPT_BOOK_PHOTOS = gql`
  query GetPremiumConceptBookPhotos($input: GetConceptBookPhotosInput!) {
    premiumConceptBookPhotos(input: $input) {
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

export const GET_SPECIAL_CONCEPT_BOOK_PHOTOS = gql`
  query GetSpecialConceptBookPhotos($input: GetConceptBookPhotosInput!) {
    specialConceptBookPhotos(input: $input) {
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
