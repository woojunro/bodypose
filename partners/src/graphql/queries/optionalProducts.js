import { gql } from '@apollo/client';

export const GET_OPTIONAL_PRODUCTS = gql`
  query GetOptionalProducts($slug: String!) {
    additionalProducts(input: { slug: $slug }) {
      ok
      error
      additionalProducts {
        id
        title
        description
        price
      }
    }
  }
`;
