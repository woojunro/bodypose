import { gql } from '@apollo/client';

export const GET_ARTICLE = gql`
  query GetArticle($id: Int!) {
    article(input: { id: $id }) {
      ok
      error
      article {
        id
        title
        categories {
          id
          name
        }
        author {
          id
          name
          logoUrl
          studioSlug
        }
        createdAt
        content
      }
    }
  }
`;
