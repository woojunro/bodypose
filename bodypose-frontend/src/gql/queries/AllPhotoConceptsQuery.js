import { gql } from '@apollo/client';

export const ALL_PHOTO_CONCEPTS_QUERY = gql`
  query GetAllPhotoConcepts {
    allPhotoConcepts {
      backgroundConcepts {
        name
        slug
      }
      costumeConcepts {
        name
        slug
      }
      objectConcepts {
        name
        slug
      }
    }
  }
`;
