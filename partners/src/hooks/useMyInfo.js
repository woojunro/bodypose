import { useQuery, useReactiveVar, gql } from '@apollo/client';
import { IsLoggedInVar, MyStudioSlugVar } from '../graphql/variables';

const GET_MY_INFO = gql`
  query GetMyInfo {
    partner {
      ok
      partner {
        email
        name
        phoneNumber
        instagram
        businessNumber
        emailAgreedAt
        smsAgreedAt
        studios {
          slug
        }
      }
    }
  }
`;

const useMyInfo = () => {
  const isLoggedIn = useReactiveVar(IsLoggedInVar);
  const myStudioSlug = useReactiveVar(MyStudioSlugVar);
  const { data, loading, refetch } = useQuery(GET_MY_INFO, {
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const { ok, partner } = data.partner;
      if (ok) {
        const slug = partner.studios[0].slug;
        if (myStudioSlug !== slug) MyStudioSlugVar(slug);
        if (!isLoggedIn) IsLoggedInVar(true);
      }
    },
    onError: () => IsLoggedInVar(false),
  });

  const info = data?.partner?.partner;
  return { info, loading, refetch };
};

export default useMyInfo;
