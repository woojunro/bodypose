import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import AppLoadingScreen from '../../../components/mobileComponents/AppLoadingScreen';
import ColumnHeader from '../../../components/mobileComponents/column/column-header';
import ColumnMain from '../../../components/mobileComponents/column/column-main';
import ColumnTitle from '../../../components/mobileComponents/column/column-title';
import ColumnLowMenu from '../../../components/mobileComponents/column/column-low-menu';
import { VIEW_ARTICLE } from '../../../gql/mutations/LogMutation';
import { GET_ARTICLE } from '../../../gql/queries/ArticleQuery';
import './column-screen.css';

const ColumnScreen = () => {
  const { columnId } = useParams();
  const history = useHistory();

  const [viewArticle] = useMutation(VIEW_ARTICLE);

  const { data, loading } = useQuery(GET_ARTICLE, {
    variables: { id: Number(columnId) },
    onCompleted: data => {
      if (!data.article.ok) history.goBack();
      else {
        viewArticle({
          variables: { input: { articleId: Number(columnId), source: 'ETC' } },
        });
      }
    },
    onError: () => history.goBack(),
  });

  return loading ? (
    <div className="appFullScreenCenter">
      <AppLoadingScreen />
    </div>
  ) : (
    <>
      <ColumnHeader />
      <div className="column-screen">
        <ColumnTitle data={data?.article?.article} />
        <ColumnMain data={data?.article?.article} />
        {/* <ColumnShowMore columnId={columnId} /> */}
      </div>
      <ColumnLowMenu />
    </>
  );
};

export default ColumnScreen;
