import { gql } from '@apollo/client';

export const CREATE_MY_PROFILE_MUTATION = gql`
  mutation CreateMyProfile($input: CreateProfileInput!) {
    createMyProfile(input: $input) {
      ok
      error
    }
  }
`;

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateProfileInput!) {
    updateMyProfile(input: $input) {
      ok
      error
    }
  }
`;
