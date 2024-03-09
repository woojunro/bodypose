import './ShootingProductScreen.css';
import React, { useState } from 'react';
import useRefresh from '../../hooks/useRefresh';
import PageTitle from '../../components/PageTitle';
import ProductList from '../../components/Product/ProductList';
import Footer from '../../components/Footer';
import WholeDescription from '../../components/Product/WholeDescription';
import NoticeMent from '../../components/NoticeMent';
import SaveButtons from '../../components/SaveButtons';
import { useQuery, gql, useMutation } from '@apollo/client';
import { GET_SHOOTING_PRODUCTS } from '../../graphql/queries/shootingProducts';
import useMyStudio from '../../hooks/useMyStudio';
import LoadingScreen from '../LoadingScreen';
import UPDATE_STUDIO_INFO from '../../graphql/mutations/updateStudioInfo';
import { ERROR_MESSAGE } from '../../constants/errorMessages';
import { CONFIRM_INFO_UPDATE } from '../../constants/messages';

const UPDATE_SHOOTING_PRODUCTS = gql`
  mutation UpdateShootingProducts(
    $slug: String!
    $payload: [UpdateStudioProductPayload!]!
  ) {
    updateStudioProducts(input: { slug: $slug, payload: $payload }) {
      ok
      error
    }
  }
`;

const ShootingProductScreen = ({ outdoor = false }) => {
  const {
    studio: {
      slug,
      info: { weekdayPriceTag, weekendPriceTag, studioProduct, outdoorProduct },
    },
    refetch: refetchStudio,
  } = useMyStudio();

  const [studioProducts, setStudioProducts] = useState([]);
  const [outdoorProducts, setOutdoorProducts] = useState([]);
  const [productDescription, setProductDescription] = useState(
    outdoor ? outdoorProduct : studioProduct
  );

  const { loading, refetch } = useQuery(GET_SHOOTING_PRODUCTS, {
    variables: { slug },
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const products = data.studioProducts?.studioProducts || [];
      setStudioProducts(products.filter(p => p.type === 'STUDIO'));
      setOutdoorProducts(products.filter(p => p.type === 'OUTDOOR'));
    },
  });

  const [updateShootingProducts, { loading: updateProductsLoading }] =
    useMutation(UPDATE_SHOOTING_PRODUCTS);

  const [updateStudioInfo, { loading: updateInfoLoading }] =
    useMutation(UPDATE_STUDIO_INFO);

  const refresh = useRefresh();

  const saveData = async () => {
    const ok = window.confirm(CONFIRM_INFO_UPDATE('상품'));
    if (!ok) return;

    const products = [
      ...studioProducts.map(product => ({ ...product, type: 'STUDIO' })),
      ...outdoorProducts.map(product => ({ ...product, type: 'OUTDOOR' })),
    ];
    const payload = products.map(product => {
      const { id, __typename, ...fields } = product;
      return { ...fields };
    });

    try {
      const updateProductsResult = await updateShootingProducts({
        variables: { slug, payload },
      });
      const updateInfoResult = await updateStudioInfo({
        variables: {
          slug,
          payload: outdoor
            ? { outdoorProduct: productDescription }
            : { studioProduct: productDescription },
        },
      });

      if (
        updateProductsResult.data?.updateStudioProducts?.ok &&
        updateInfoResult.data?.updateStudioInfo?.ok
      ) {
        await refetchStudio();
        await refetch();
        refresh();
      }
    } catch (e) {
      alert(ERROR_MESSAGE);
    }
  };

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <PageTitle title={`${outdoor ? '아웃도어' : '스튜디오'} 상품 관리`} />
          <ProductList
            outdoor={outdoor}
            products={outdoor ? outdoorProducts : studioProducts}
            setProducts={outdoor ? setOutdoorProducts : setStudioProducts}
            weekdayPriceTag={weekdayPriceTag}
            weekendPriceTag={weekendPriceTag}
          />
          <WholeDescription
            productType={outdoor ? '아웃도어' : '스튜디오'}
            description={productDescription}
            setDescription={setProductDescription}
          />
          <NoticeMent />
          <SaveButtons
            saveData={saveData}
            refresh={refresh}
            isActive={!(updateProductsLoading || updateInfoLoading)}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ShootingProductScreen;
