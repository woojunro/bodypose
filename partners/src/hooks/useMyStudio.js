import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { MyStudioSlugVar } from '../graphql/variables';

const GET_MY_STUDIO = gql`
  query GetMyStudio($slug: String!) {
    studio(input: { slug: $slug }) {
      ok
      studio {
        id
        name
        slug
        isPublic
        logoUrl
        coverPhotoUrl
        branches {
          id
          name
          address
          parkingInfo
        }
        lowestPrice
        info {
          contactUrl
          reservationUrl
          weekdayPriceTag
          weekendPriceTag
          studioProduct
          outdoorProduct
          additionalProduct
          description
          reservation
          cancel
        }
      }
    }
  }
`;

const useMyStudio = () => {
  const slug = useReactiveVar(MyStudioSlugVar);
  const { data, loading, refetch } = useQuery(GET_MY_STUDIO, {
    variables: { slug },
    notifyOnNetworkStatusChange: true,
  });

  const studio = data?.studio?.studio;
  return { studio, loading: slug ? loading : true, refetch };
};

export default useMyStudio;
