import { gql } from '@apollo/client';

export const GET_HAIR_MAKEUP_SHOPS = gql`
  query GetHairMakupShops($slug: String!) {
    hairMakeupShops(input: { slug: $slug }) {
      ok
      error
      hairMakeupShops {
        id
        type
        name
        contactInfo
        address
        productListDescription
        products {
          id
          title
          price
        }
      }
    }
  }
`;
