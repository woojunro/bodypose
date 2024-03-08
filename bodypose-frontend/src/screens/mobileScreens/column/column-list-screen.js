import React, { useState } from 'react';
import ColumnHeader from '../../../components/mobileComponents/column/column-header';
import ColumnNavigator from '../../../components/mobileComponents/column/column-navigator';
import './column-list-screen.css';
import { GET_ALL_ARTICLE_CATEGORIES } from '../../../gql/queries/AllArticleCategoriesQuery';
import ColumnList from '../../../components/mobileComponents/column/column-list';
import { useQuery } from '@apollo/client';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import { GET_ARTICLES } from '../../../gql/queries/ArticlesQuery';

const ColumnListScreen = () => {
  const {
    data,
    loading,
    error: categoriesError,
  } = useQuery(GET_ALL_ARTICLE_CATEGORIES);

  const [categoryId, setCategoryId] = useState(null);

  const changeCategoryId = id => {
    setColumnData([]);
    setCategoryId(id);
  };

  const [columnData, setColumnData] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const {
    data: articlesData,
    error,
    refetch,
  } = useQuery(GET_ARTICLES, {
    variables: { input: { categoryId, afterCursor: null } },
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const { articles, afterCursor } = data.articles;
      setColumnData([...columnData, ...articles]);
      setHasMore(Boolean(afterCursor));
    },
  });

  //칼럼 추가로 불러오는 함수.
  const fetchMore = () => {
    const afterCursor = articlesData?.articles?.afterCursor;
    if (!afterCursor) {
      setHasMore(false);
      return;
    }
    refetch({ input: { categoryId, afterCursor } });
  };

  return loading ? (
    <div className="appFullScreenCenter">
      <AppLoadingScreen />
    </div>
  ) : (
    <div>
      <ColumnHeader />
      {error || categoriesError ? (
        <div className="appLoader">
          <p>오류가 발생하였습니다. 다시 시도해주세요.</p>
        </div>
      ) : (
        <>
          <ColumnNavigator
            categoryId={categoryId}
            setCategoryId={changeCategoryId}
            categories={data.allArticleCategories.categories}
          />
          <ColumnList
            list={columnData}
            fetchMoreData={fetchMore}
            hasMore={hasMore}
          />
        </>
      )}
    </div>
  );
};

export default ColumnListScreen;
