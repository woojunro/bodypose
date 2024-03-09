import { gql } from '@apollo/client';

const UPDATE_STUDIO_INFO = gql`
  mutation UpdateStudioInfo(
    $slug: String!
    $payload: UpdateStudioInfoPayload!
  ) {
    updateStudioInfo(input: { slug: $slug, payload: $payload }) {
      ok
      error
    }
  }
`;

export default UPDATE_STUDIO_INFO;
