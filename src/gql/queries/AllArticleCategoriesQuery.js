import { gql } from '@apollo/client';

export const GET_ALL_ARTICLE_CATEGORIES = gql`
  query GetAllArticleCategories {
    allArticleCategories {
      ok
      error
      categories {
        id
        name
        order
      }
    }
  }
`;
