import React from 'react';
import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import './Product.css';
import { MyStudioSlugVar } from '../../graphql/variables';
import { LoggedInPaths } from '../../routers/LoggedInRouter';
import DashboardLoading from './DashboardLoading';

const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProductsQuery($slug: String!) {
    studioProducts(input: { slug: $slug }) {
      studioProducts {
        id
        type
      }
    }
    additionalProducts(input: { slug: $slug }) {
      additionalProducts {
        id
      }
    }
    hairMakeupShops(input: { slug: $slug }) {
      hairMakeupShops {
        id
      }
    }
  }
`;

const Product = () => {
  const slug = useReactiveVar(MyStudioSlugVar);
  const { data, loading } = useQuery(GET_ALL_PRODUCTS_QUERY, {
    variables: { slug },
  });

  const history = useHistory();

  const studioProducts = (data?.studioProducts?.studioProducts || []).filter(
    p => p.type === 'STUDIO'
  );
  const outdoorProducts = (data?.studioProducts?.studioProducts || []).filter(
    p => p.type === 'OUTDOOR'
  );
  const optionalProducts = data?.additionalProducts?.additionalProducts || [];
  const hairMakeupShops = data?.hairMakeupShops?.hairMakeupShops || [];

  const total =
    studioProducts.length +
    outdoorProducts.length +
    optionalProducts.length +
    hairMakeupShops.length;

  return (
    <div className="dashboardProductContainer">
      <div className="boxTitle">
        <div>상품</div>
        <div
          className="gotoPage"
          onClick={() => history.push(LoggedInPaths.PRODUCT_GENERAL)}
        >
          상품 관리하기
        </div>
      </div>
      {loading ? (
        <DashboardLoading />
      ) : (
        <div className="dashboardProductItemContainer">
          <div className="dashboardProductItem">
            <div className="dashboardProductItemTitle">스튜디오 촬영 상품</div>
            <div
              className="dashboardProductItemNumber"
              onClick={() => history.push(LoggedInPaths.STUDIO_PRODUCT)}
            >
              {studioProducts.length}
              <span className="dashboardProductItemNumberText">건</span>
            </div>
          </div>
          <div className="dashboardProductItem">
            <div className="dashboardProductItemTitle">아웃도어 촬영 상품</div>
            <div
              className="dashboardProductItemNumber"
              onClick={() => history.push(LoggedInPaths.OUTDOOR_PRODUCT)}
            >
              {outdoorProducts.length}
              <span className="dashboardProductItemNumberText">건</span>
            </div>
          </div>
          <div className="dashboardProductItem">
            <div className="dashboardProductItemTitle">추가 상품</div>
            <div
              className="dashboardProductItemNumber"
              onClick={() => history.push(LoggedInPaths.OPTIONAL_PRODUCT)}
            >
              {optionalProducts.length}
              <span className="dashboardProductItemNumberText">건</span>
            </div>
          </div>
          <div className="dashboardProductItem">
            <div className="dashboardProductItemTitle">제휴 헤어/메이크업</div>
            <div
              className="dashboardProductItemNumber"
              onClick={() => history.push(LoggedInPaths.HAIR_MAKEUP)}
            >
              {hairMakeupShops.length}
              <span className="dashboardProductItemNumberText">건</span>
            </div>
          </div>
          <div className="dashboardProductTotalcontainer">
            <div className="dashboardProductTotal">
              총 <span className="dashboardProductTotalNumber">{total}</span> 건
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
