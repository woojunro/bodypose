import React, { useEffect, useState } from 'react';
import HeaderM from '../../components/mobileComponents/HeaderM';
import AdTapCarousel from '../../components/mobileComponents/homeScreen/AdTabCarousel';
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
import { ALL_STUDIOS_QUERY } from '../../gql/queries/AllStudiosQuery';
import HomeColumnList from '../../components/mobileComponents/homeScreen/home-column-list';

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
    data: studioData,
    loading: studioLoading,
    error: studioError,
  } = useQuery(ALL_STUDIOS_QUERY);
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
  const {
    data: maleData,
    loading: maleLoading,
    error: maleError,
  } = useQuery(ALL_STUDIO_PHOTOS_QUERY, {
    variables: {
      take,
      page: randomMalePage,
      gender: 'MALE',
      backgroundConceptSlugs: [],
      costumeConceptSlugs: [],
      objectConceptSlugs: [],
    },
  });
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
    femaleLoading ||
    maleLoading ||
    coupleLoading ||
    noticesLoading ||
    studioLoading;
  const isError =
    femaleError || maleError || coupleError || noticesError || studioError;

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <div>
      <HeaderM pageName="home" />
      {loading ? (
        <div className="appLoader">
          <AppLoadingScreen />
        </div>
      ) : isError ? (
        <AppErrorScreen />
      ) : (
        <>
          <AdTapCarousel />
          <MainCardScrollView studios={studioData.allStudios.studios} />
          {/* <SeeAll /> */}
          <HomeColumnList />
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
