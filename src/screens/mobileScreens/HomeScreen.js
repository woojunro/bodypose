import React, { useEffect, useState } from 'react';
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
import { NOTICES_QUERY } from '../../gql/queries/NoticeQuery';
import {
  COUPLE_PHOTOS_NUM,
  FEMALE_PHOTOS_NUM,
  MALE_PHOTOS_NUM,
} from '../../constants/numOfPhotos';
import { randomPage } from '../../components/functions/Concept/randomPages';

const take = 8;

const HomeScreen = () => {
  const [randomFemalePage] = useState(
    randomPage(Math.floor(FEMALE_PHOTOS_NUM / take))
  );
  const [randomMalePage] = useState(
    randomPage(Math.floor(MALE_PHOTOS_NUM / take))
  );
  const [randomCouplePage] = useState(
    randomPage(Math.floor(COUPLE_PHOTOS_NUM / take))
  );

  const {
    data: femaleData,
    loading: femaleLoading,
    error: femaleError,
  } = useQuery(ALL_STUDIO_PHOTOS_QUERY, {
    variables: {
      take,
      page: randomFemalePage,
      gender: 'FEMALE',
      backgroundConceptSlugs: [],
      costumeConceptSlugs: [],
      objectConceptSlugs: [],
    },
  });
  const { data: maleData, loading: maleLoading, error: maleError } = useQuery(
    ALL_STUDIO_PHOTOS_QUERY,
    {
      variables: {
        take,
        page: randomMalePage,
        gender: 'MALE',
        backgroundConceptSlugs: [],
        costumeConceptSlugs: [],
        objectConceptSlugs: [],
      },
    }
  );
  const {
    data: coupleData,
    loading: coupleLoading,
    error: coupleError,
  } = useQuery(ALL_STUDIO_PHOTOS_QUERY, {
    variables: {
      take,
      page: randomCouplePage,
      gender: 'COUPLE',
      backgroundConceptSlugs: [],
      costumeConceptSlugs: [],
      objectConceptSlugs: [],
    },
  });
  const {
    data: noticesData,
    loading: noticesLoading,
    error: noticesError,
  } = useQuery(NOTICES_QUERY, { variables: { page: 1 } });

  const loading =
    femaleLoading || maleLoading || coupleLoading || noticesLoading;
  const isError = femaleError || maleError || coupleError || noticesError;

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
          <FemaleConcepts concepts={femaleData.allStudioPhotos.photos} />
          <MaleConcepts concepts={maleData.allStudioPhotos.photos} />
          <CoupleConcepts concepts={coupleData.allStudioPhotos.photos} />
          <NoticeBox notices={noticesData.notices.notices} />
          <Footer />
        </>
      )}
      <BottomNavigation pageName="home" />
    </div>
  );
};

export default HomeScreen;
