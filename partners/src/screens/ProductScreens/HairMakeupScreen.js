import React, { useState } from 'react';
import useRefresh from '../../hooks/useRefresh';
import PageTitle from '../../components/PageTitle';
import NoticeMent from '../../components/NoticeMent';
import SaveButtons from '../../components/SaveButtons';
import Footer from '../../components/Footer';
import './HairMakeupScreen.css';
import HairMakeupList from '../../components/HairMakeup/HairMakeupList';
import { useQuery, useReactiveVar, gql, useMutation } from '@apollo/client';
import { GET_HAIR_MAKEUP_SHOPS } from '../../graphql/queries/hairMakeupShops';
import { MyStudioSlugVar } from '../../graphql/variables';
import LoadingScreen from '../LoadingScreen';
import { CONFIRM_INFO_UPDATE } from '../../constants/messages';
import { ERROR_MESSAGE } from '../../constants/errorMessages';

const UPDATE_HAIR_MAKEUP_SHOPS = gql`
  mutation UpdateHairMakeupShops(
    $slug: String!
    $payload: [UpdateHairMakeupShopPayload!]!
  ) {
    updateHairMakeupShops(input: { slug: $slug, payload: $payload }) {
      ok
      error
    }
  }
`;

const HairMakeupScreen = () => {
  const [hairMakeupProducts, setHairMakeupProducts] = useState([]);

  const slug = useReactiveVar(MyStudioSlugVar);

  const { loading, refetch } = useQuery(GET_HAIR_MAKEUP_SHOPS, {
    variables: { slug },
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const shops = data.hairMakeupShops?.hairMakeupShops || [];
      setHairMakeupProducts(shops);
    },
  });

  const [update, { loading: updateLoading }] = useMutation(
    UPDATE_HAIR_MAKEUP_SHOPS,
    {
      onCompleted: async data => {
        if (data.updateHairMakeupShops.ok) {
          await refetch();
          refresh();
        }
      },
      onError: () => alert(ERROR_MESSAGE),
    }
  );

  const saveData = () => {
    const ok = window.confirm(CONFIRM_INFO_UPDATE('헤어/메이크업'));
    if (!ok) return;

    const payload = hairMakeupProducts.map(shop => {
      const { id, __typename, products, ...fields } = shop;
      return {
        ...fields,
        products: products.map(product => {
          const { id, __typename, ...fields } = product;
          return { ...fields };
        }),
      };
    });

    update({ variables: { slug, payload } });
  };

  const refresh = useRefresh();

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <PageTitle title="헤어/메이크업 관리" />
          <HairMakeupList
            shops={hairMakeupProducts}
            setShops={setHairMakeupProducts}
          />
          <NoticeMent />
          <SaveButtons
            saveData={saveData}
            refresh={refresh}
            isActive={!updateLoading}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HairMakeupScreen;
