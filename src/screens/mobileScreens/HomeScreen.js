import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import './HomeScreen.css';
import HeaderM from '../../components/mobileComponents/HeaderM';
import AdTap from '../../components/mobileComponents/homeScreen/AdTap';
import MainCardScrollView from '../../components/mobileComponents/homeScreen/MainCardScrollView';
import SeeAll from '../../components/mobileComponents/homeScreen/SeeAll';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import {
  MaleConcepts,
  FemaleConcepts,
  CoupleConcepts,
} from '../../components/mobileComponents/homeScreen/HomePageConcepts';
import NoticeBox from '../../components/mobileComponents/homeScreen/NoticeBox';
import Footer from '../../components/mobileComponents/Footer';
import { MALE_PHOTO_QUERY } from '../../gql/queries/HomeScreenQuery';
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';

const HomeScreen = () => {
  const { loading } = useQuery(MALE_PHOTO_QUERY, {
    onCompleted: data => console.log(data),
    onError: error => console.log(error),
  });

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const IEText =
    '인터넷 익스플로러는 보안에 취약하여 지원하지 않고 있습니다.\n인터넷 익스플로러에서는 사진의 비율이 깨져 보일 수 있습니다.';
  const renderIfIE = () => {
    var agent = navigator.userAgent.toLowerCase();
    if (
      (navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) ||
      agent.indexOf('msie') !== -1
    ) {
      return <div className="notIEText">{IEText}</div>;
    } else {
      return null;
    }
  };

  return (
    <div>
      <HeaderM pageName="home" />
      {renderIfIE()}
      <AdTap />
      {loading ? (
        <div>
          <AppLoadingScreen />
        </div>
      ) : (
        <>
          <MainCardScrollView />
          <SeeAll />
          <FemaleConcepts />
          <MaleConcepts />
          <CoupleConcepts />
          <NoticeBox />
          <Footer />
          <BottomNavigation pageName="home" />
        </>
      )}
    </div>
  );
};

export default HomeScreen;
