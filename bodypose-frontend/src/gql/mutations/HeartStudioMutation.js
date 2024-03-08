import { gql } from '@apollo/client';

export const HEART_STUDIO_MUTATION = gql`
  mutation HeartStudio($slug: String!) {
    heartStudio(input: { slug: $slug }) {
      ok
      error
    }
  }
`;

export const DISHEART_STUDIO_MUTATION = gql`
  mutation DisheartStudio($slug: String!) {
    disheartStudio(input: { slug: $slug }) {
      ok
      error
    }
  }
`;
