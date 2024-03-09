import React, { useState } from 'react';
import useRefresh from '../../hooks/useRefresh';
import PageTitle from '../../components/PageTitle';
import './OptionalProductScreen.css';
import OptionalProductList from '../../components/OptionalProduct/OptionalProductList';
import NoticeMent from '../../components/NoticeMent';
import SaveButtons from '../../components/SaveButtons';
import Footer from '../../components/Footer';
import WholeDescription from '../../components/Product/WholeDescription';
import useMyStudio from '../../hooks/useMyStudio';
import { useQuery, gql, useMutation } from '@apollo/client';
import { GET_OPTIONAL_PRODUCTS } from '../../graphql/queries/optionalProducts';
import LoadingScreen from '../LoadingScreen';
import UPDATE_STUDIO_INFO from '../../graphql/mutations/updateStudioInfo';
import { CONFIRM_INFO_UPDATE } from '../../constants/messages';
import { ERROR_MESSAGE } from '../../constants/errorMessages';

const UPDATE_OPTIONAL_PRODUCTS = gql`
  mutation UpdateOptionalProducts(
    $slug: String!
    $payload: [UpdateAdditionalProductPayload!]!
  ) {
    updateAdditionalProducts(input: { slug: $slug, payload: $payload }) {
      ok
      error
    }
  }
`;

const OptionalProductScreen = () => {
  const {
    studio: {
      slug,
      info: { additionalProduct },
    },
    refetch: refetchStudio,
  } = useMyStudio();

  const { loading, refetch } = useQuery(GET_OPTIONAL_PRODUCTS, {
    variables: { slug },
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const products = data.additionalProducts?.additionalProducts || [];
      setOptionalProducts([...products]);
    },
  });

  const [optionalProducts, setOptionalProducts] = useState([]);
  const [optionalDescription, setOptionalDescription] =
    useState(additionalProduct);

  const [updateProducts, { loading: updateProductsLoading }] = useMutation(
    UPDATE_OPTIONAL_PRODUCTS
  );

  const [updateInfo, { loading: updateInfoLoading }] =
    useMutation(UPDATE_STUDIO_INFO);

  const saveData = async () => {
    const ok = window.confirm(CONFIRM_INFO_UPDATE('추가 상품'));
    if (!ok) return;

    const payload = optionalProducts.map(product => {
      const { id, __typename, ...fields } = product;
      return { ...fields };
    });

    try {
      const updateProductsResult = await updateProducts({
        variables: { slug, payload },
      });
      const updateInfoResult = await updateInfo({
        variables: {
          slug,
          payload: { additionalProduct: optionalDescription },
        },
      });

      if (
        updateProductsResult.data?.updateAdditionalProducts?.ok &&
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

  const refresh = useRefresh();

  return loading ? (
    <LoadingScreen />
  ) : (
    <div className="Dashboard">
      <div className="partnersMainPartContainer">
        <div className="partnersMainPart">
          <PageTitle title="추가 상품 관리" />
          <OptionalProductList
            products={optionalProducts}
            setProducts={setOptionalProducts}
          />
          <WholeDescription
            productType="추가"
            description={optionalDescription}
            setDescription={setOptionalDescription}
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

export default OptionalProductScreen;
