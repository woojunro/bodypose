import React, { useState, useEffect } from 'react';
import { GetStudioInfo } from '../../components/functions/WithDb/StudioInfo';
import './StudioInfoScreen.css';
import HeaderBar from '../../components/mobileComponents/StudioInfoScreen/HeaderBar';
import TitlePart from '../../components/mobileComponents/StudioInfoScreen/TitlePart';
import StudioLinks from '../../components/mobileComponents/StudioInfoScreen/StudioLinks';
import TopNavigator from '../../components/mobileComponents/StudioInfoScreen/TopNavigator';
import Portfolio from '../../components/mobileComponents/StudioInfoScreen/Portfolio';
import ItemTab from '../../components/mobileComponents/StudioInfoScreen/ItemTab';
import InfoTab from '../../components/mobileComponents/StudioInfoScreen/InfoTab';
import SeeMoreStudio from '../../components/mobileComponents/StudioInfoScreen/SeeMoreStudio';

const StudioInfoScreen = ({ match }) => {
  const currentStudio = GetStudioInfo(match.params.id);
  const [navigator, setNavigator] = useState('portfolio');

  const renderedItem = () => {
    if (navigator === 'portfolio') {
      return <Portfolio studioName={currentStudio.studioName} />;
    } else if (navigator === 'item') {
      return <ItemTab currentStudio={currentStudio} />;
    } else if (navigator === 'info') {
      return <InfoTab currentStudio={currentStudio} />;
    } else {
      return <div>다른거</div>;
    }
  };
  return (
    <>
      <HeaderBar currentStudio={currentStudio} />
      <TitlePart currentStudio={currentStudio} />
      <StudioLinks currentStudio={currentStudio} />
      <TopNavigator
        navigator={navigator}
        setNavigator={setNavigator}
        reviews={currentStudio.reviews}
      />
      {renderedItem()}
      <SeeMoreStudio currentStudioName={currentStudio.studioName} />
    </>
  );
};

export default StudioInfoScreen;
