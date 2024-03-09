import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
  query GetArticles($input: ArticlesInput!) {
    articles(input: $input) {
      ok
      error
      afterCursor
      articles {
        id
        title
        thumbnailUrl
        author {
          id
          name
          logoUrl
        }
        categories {
          id
          name
        }
      }
    }
  }
`;
