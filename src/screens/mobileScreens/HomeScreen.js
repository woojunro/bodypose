import React from 'react';
import './HomeScreen.css';
import HeaderM from '../../components/mobileComponents/HeaderM';
import AdTap from '../../components/mobileComponents/AdTap';
import SemiTitle from '../../components/mobileComponents/SemiTitle';
import MainCardM from '../../components/mobileComponents/MainCardM';

const Home = () => {
  return (
    <div>
      <HeaderM pageName="home" />
      <AdTap />
      <SemiTitle title="추천 스튜디오" />
      <MainCardM studioName="bodylog" price="256,000" />
    </div>
  );
};

export default Home;
