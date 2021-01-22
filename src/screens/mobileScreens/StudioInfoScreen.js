import React, { useState, useEffect } from 'react';
import { GetStudioInfo } from '../../components/functions/WithDb/StudioInfo';
import HeaderBar from '../../components/mobileComponents/StudioInfoScreen/HeaderBar';
import TitlePart from '../../components/mobileComponents/StudioInfoScreen/TitlePart';
import StudioLinks from '../../components/mobileComponents/StudioInfoScreen/StudioLinks';
import TopNavigator from '../../components/mobileComponents/StudioInfoScreen/TopNavigator';
import Portfolio from '../../components/mobileComponents/StudioInfoScreen/Portfolio';
import ItemTab from '../../components/mobileComponents/StudioInfoScreen/ItemTab';
import InfoTab from '../../components/mobileComponents/StudioInfoScreen/InfoTab';
import ReviewTab from '../../components/mobileComponents/StudioInfoScreen/ReviewTab';
import WriteReview from '../../components/mobileComponents/ReviewList/WriteReview';
import BottomAlertDialog from '../../components/mobileComponents/BottomAlertDialog';

import SeeMoreStudio from '../../components/mobileComponents/StudioInfoScreen/SeeMoreStudio';

const StudioInfoScreen = ({ match }) => {
  const currentStudio = GetStudioInfo(match.params.id);
  const [navigator, setNavigator] = useState('portfolio');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const copyTextToClipboard = () => {
    var dummy = document.createElement('input'),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  useEffect(() => {
    document.body.style.overflow = isWriteReviewOpen ? 'hidden' : 'auto';
  }, [isWriteReviewOpen]);

  const renderedItem = () => {
    if (navigator === 'portfolio') {
      return <Portfolio studioName={currentStudio.studioName} />;
    } else if (navigator === 'item') {
      return <ItemTab currentStudio={currentStudio} />;
    } else if (navigator === 'info') {
      return <InfoTab currentStudio={currentStudio} />;
    } else {
      return (
        <ReviewTab
          currentStudio={currentStudio}
          setIsWriteReviewOpen={setIsWriteReviewOpen}
        />
      );
    }
  };
  return (
    <div>
      <BottomAlertDialog
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        dialog="주소가 복사되었습니다."
      />
      <WriteReview
        studioName={currentStudio.studioName}
        studioTitle={currentStudio.title}
        isWriteReviewOpen={isWriteReviewOpen}
        setIsWriteReviewOpen={setIsWriteReviewOpen}
      />
      <HeaderBar
        currentStudio={currentStudio}
        copyTextToClipboard={copyTextToClipboard}
        setIsAlertOpen={setIsAlertOpen}
      />
      <TitlePart currentStudio={currentStudio} />
      <StudioLinks currentStudio={currentStudio} />
      <TopNavigator
        navigator={navigator}
        setNavigator={setNavigator}
        reviews={currentStudio.reviews}
      />
      {renderedItem()}
      <SeeMoreStudio currentStudioName={currentStudio.studioName} />
    </div>
  );
};

export default StudioInfoScreen;
