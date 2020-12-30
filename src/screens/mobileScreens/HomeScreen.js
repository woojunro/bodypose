import React from 'react';
import './HomeScreen.css';
import HeaderM from '../../components/mobileComponents/HeaderM';
import AdTap from '../../components/mobileComponents/homeScreen/AdTap';
import MainCardScrollView from '../../components/mobileComponents/homeScreen/MainCardScrollView';
import SeeAll from '../../components/mobileComponents/homeScreen/SeeAll';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import { BottomBox } from '../../components/mobileComponents/BottomBox';
import WomanConcepts from '../../components/mobileComponents/homeScreen/WomanConcepts';
import ManConcepts from '../../components/mobileComponents/homeScreen/ManConcepts';
import CoupleConcepts from '../../components/mobileComponents/homeScreen/CoupleConcepts';
import NoticeBox from '../../components/mobileComponents/homeScreen/NoticeBox';

const HomeScreen = () => {
  return (
    <div className="homeScreen">
      <HeaderM pageName="home" />
      <AdTap />
      <MainCardScrollView />
      <SeeAll />
      <WomanConcepts />
      <ManConcepts />
      <CoupleConcepts />
      <NoticeBox />
      <BottomBox />
      <BottomNavigation pageName="home" />
    </div>
  );
};

export default HomeScreen;
