import React from 'react';
import './HomeScreen.css';
import HeaderM from '../../components/mobileComponents/HeaderM';
import AdTap from '../../components/mobileComponents/homeScreen/AdTap';
import MainCardScrollView from '../../components/mobileComponents/homeScreen/MainCardScrollView';
import SeeAll from '../../components/mobileComponents/homeScreen/SeeAll';
import BottomNavigation from '../../components/mobileComponents/BottomNavigation';
import FemaleConcepts from '../../components/mobileComponents/homeScreen/FemaleConcepts';
import MaleConcepts from '../../components/mobileComponents/homeScreen/MaleConcepts';
import CoupleConcepts from '../../components/mobileComponents/homeScreen/CoupleConcepts';
import NoticeBox from '../../components/mobileComponents/homeScreen/NoticeBox';
import Footer from '../../components/mobileComponents/Footer';

const HomeScreen = () => {
  return (
    <div className="homeScreen">
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
