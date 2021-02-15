import { gql } from '@apollo/client';

export const HEART_STUDIO_PHOTO_MUTATION = gql`
  mutation HeartStudioPhoto($id: Int!) {
    heartStudioPhoto(input: { id: $id }) {
      ok
      error
      id
    }
  }
`;

export const DISHEART_STUDIO_PHOTO_MUTATION = gql`
  mutation DisheartStudioPhoto($id: Int!) {
    disheartStudioPhoto(input: { id: $id }) {
      ok
      error
      id
    }
  }
`;
