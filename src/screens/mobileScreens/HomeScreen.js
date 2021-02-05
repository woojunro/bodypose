import React, { useEffect } from 'react';
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
import AppLoadingScreen from '../../components/mobileComponents/AppLoadingScreen';
import { useQuery } from '@apollo/client';
import { ALL_STUDIO_PHOTOS_QUERY } from '../../gql/queries/StudioPhotoQuery';
import AppErrorScreen from '../../components/mobileComponents/AppErrorScreen';

const femalePhotoPages = 12;
const malePhotoPages = 4;
const couplePhotoPages = 1;

const randomPage = page => Math.floor(Math.random() * page) + 1;

const HomeScreen = () => {
  const {
    data: femalePhotos,
    loading: femaleLoading,
    error: femaleError,
  } = useQuery(ALL_STUDIO_PHOTOS_QUERY, {
    variables: {
      page: randomPage(femalePhotoPages),
      gender: 'FEMALE',
      backgroundConceptSlugs: [],
      costumeConceptSlugs: [],
      objectConceptSlugs: [],
    },
    onCompleted: data => console.log(data),
  });

  const loading = femaleLoading;
  const isError = femaleError;

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
      {loading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : isError ? (
        <AppErrorScreen />
      ) : (
        <>
          <AdTap />
          <MainCardScrollView />
          <SeeAll />
          <FemaleConcepts />
          <MaleConcepts />
          <CoupleConcepts />
          <NoticeBox />
          <Footer />
        </>
      )}
      <BottomNavigation pageName="home" />
    </div>
  );
};

export default HomeScreen;
