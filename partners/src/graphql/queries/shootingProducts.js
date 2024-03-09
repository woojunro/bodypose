import { gql } from '@apollo/client';

export const GET_SHOOTING_PRODUCTS = gql`
  query GetShootingProducts($slug: String!) {
    studioProducts(input: { slug: $slug }) {
      ok
      error
      studioProducts {
        id
        type
        title
        peopleCount
        maxPeopleCount
        conceptCount
        maxConceptCount
        cutCount
        minuteCount
        description
        weekdayPrice
        weekendPrice
        isOriginalProvided
      }
    }
  }
`;
