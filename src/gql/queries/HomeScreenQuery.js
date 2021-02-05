import { gql } from '@apollo/client';

export const HOMESCREEN_MALE_PHOTO_QUERY = gql`
  query HomeScreenMalePhoto {
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

export const HOMESCREEN_FEMALE_PHOTO_QUERY = gql`
  query HomeScreenFemalePhoto {
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

export const HOMESCREEN_COUPLE_PHOTO_QUERY = gql`
  query HomeScreenCouplePhoto {
    allStudioPhotos(
      input: {
        page: 1
        gender: COUPLE
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
