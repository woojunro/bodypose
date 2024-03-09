import { gql } from '@apollo/client';

export const VIEW_STUDIO_INFO_MUTATION = gql`
  mutation ViewStudioInfo($input: ViewStudioInfoInput!) {
    viewStudioInfo(input: $input) {
      ok
      error
    }
  }
`;

export const EXPOSE_ORIGINAL_STUDIO_PHOTO_MUTATION = gql`
  mutation ExposeOriginalStudioPhoto($input: ExposeOriginalStudioPhotoInput!) {
    exposeOriginalStudioPhoto(input: $input) {
      ok
      error
    }
  }
`;

export const CONTACT_STUDIO_MUTATION = gql`
  mutation ContactStudio($input: ContactStudioInput!) {
    contactStudio(input: $input) {
      ok
      error
    }
  }
`;

export const VIEW_ARTICLE = gql`
  mutation ViewArticle($input: ViewArticleInput!) {
    viewArticle(input: $input) {
      ok
      error
    }
  }
`;
