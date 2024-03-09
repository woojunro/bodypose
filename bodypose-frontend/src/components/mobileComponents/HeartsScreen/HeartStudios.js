import { useQuery } from '@apollo/client';
import React from 'react';
import { Redirect } from 'react-router-dom';
import StudioListView from '../../../components/mobileComponents/studioListScreen/StudioListView';
import { MY_HEART_STUDIOS_QUERY } from '../../../gql/queries/MyHeartQuery';
import AppLoadingScreen from '../AppLoadingScreen';

const HeartStudio = () => {
  const { data, loading } = useQuery(MY_HEART_STUDIOS_QUERY, {
    fetchPolicy: 'network-only',
    onError: () => <Redirect to="/error" />,
  });

  return (
    <div>
      {loading ? (
        <div className="heartScreenLoadingDiv">
          <AppLoadingScreen />
        </div>
      ) : !data.myHeartStudios.studios ||
        data.myHeartStudios.studios.length === 0 ? (
        <div className="heartScreenLoadingDiv">
          <p>찜한 스튜디오가 없습니다.</p>
        </div>
      ) : (
        <StudioListView
          studioList={data.myHeartStudios.studios}
          isHeartView={true}
        />
      )}
    </div>
  );
};

export default HeartStudio;
