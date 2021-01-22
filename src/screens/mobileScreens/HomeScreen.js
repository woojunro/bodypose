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

const HomeScreen = () => {
  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);
  return (
    <div>
      <HeaderM pageName="home" />
      <AdTap />
      <MainCardScrollView />
      <SeeAll />
      <FemaleConcepts />
      <MaleConcepts />
      <CoupleConcepts />
      <NoticeBox />
      <Footer />
      <BottomNavigation pageName="home" />
    </div>
  );
};

export default HomeScreen;
