import React from 'react';
import './HomeScreen.css';
import HeaderM from '../../components/mobileComponents/HeaderM';
import AdTap from '../../components/mobileComponents/AdTap';
import SemiTitle from '../../components/mobileComponents/SemiTitle';

const Home = () => {
  return (
    <div>
      <HeaderM pageName="home" />
      <AdTap />
      <SemiTitle title="추천 스튜디오" />
    </div>
  );
};

export default Home;
