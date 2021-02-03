import { gql } from '@apollo/client';

export const MALE_PHOTO_QUERY = gql`
  query MalePhoto {
    allStudioPhotos(
      input: {
        page: 1
        gender: MALE
        backgroundConceptSlugs: []
        costumeConceptSlugs: []
        objectConceptSlugs: []
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

export const FEMALE_PHOTO_QUERY = gql`
  query FemalePhoto {
    allStudioPhotos(
      input: {
        page: 1
        gender: FEMALE
        backgroundConceptSlugs: []
        costumeConceptSlugs: []
        objectConceptSlugs: []
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

export const COUPLE_PHOTO_QUERY = gql`
  query CouplePhoto {
    allStudioPhotos(
      input: {
        page: 1
        gender: FEMALE
        backgroundConceptSlugs: []
        costumeConceptSlugs: []
        objectConceptSlugs: []
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
